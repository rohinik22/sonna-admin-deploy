// supabase/functions/get-users/index.ts
// Edge Function for admin to get all user profiles with analytics

// @ts-ignore - Deno ESM.sh imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore - Deno global
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get auth header to verify admin access
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify admin access by checking if user exists in admins table
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('role')
      .eq('email', user.email)
      .single()

    // If admins table doesn't exist or user not found, allow any authenticated user for now
    // TODO: Properly set up admins table in production
    if (adminError && adminError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is acceptable
      // Other errors indicate table doesn't exist or permission issues
      console.warn('Admins table error:', adminError.message)
      console.warn('Allowing access for authenticated user temporarily')
    } else if (!adminData || adminData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse query parameters for pagination and filtering
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100) // Max 100 per page
    const search = url.searchParams.get('search') || ''
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        phone,
        loyalty_points,
        total_orders,
        total_spent,
        created_at,
        updated_at
      `)

    // Add search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Add pagination
    query = query.range(offset, offset + limit - 1)

    const { data: users, error: usersError, count } = await query

    if (usersError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get analytics data
    const { data: analytics } = await supabase
      .from('users')
      .select(`
        id,
        loyalty_points,
        total_orders,
        total_spent,
        created_at
      `)

    const totalUsers = count || 0
    const totalLoyaltyPoints = analytics?.reduce((sum, user) => sum + (user.loyalty_points || 0), 0) || 0
    const totalRevenue = analytics?.reduce((sum, user) => sum + (user.total_spent || 0), 0) || 0
    const averageOrderValue = totalUsers > 0 ? totalRevenue / totalUsers : 0

    // Calculate new users this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const newUsersThisMonth = analytics?.filter(user => 
      new Date(user.created_at) >= startOfMonth
    ).length || 0

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: users || [],
          pagination: {
            page,
            limit,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            hasNext: offset + limit < totalUsers,
            hasPrev: page > 1
          },
          analytics: {
            total_users: totalUsers,
            new_users_this_month: newUsersThisMonth,
            total_loyalty_points: totalLoyaltyPoints,
            total_revenue: totalRevenue,
            average_order_value: averageOrderValue
          }
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Get users error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
