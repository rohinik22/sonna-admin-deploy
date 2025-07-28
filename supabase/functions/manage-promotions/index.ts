// supabase/functions/manage-promotions/index.ts
// Edge Function for full CRUD operations on promotions

// @ts-ignore - Deno ESM.sh imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PromotionData {
  code: string
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  minimum_order_amount?: number
  maximum_discount_amount?: number
  usage_limit?: number
  valid_from?: string
  valid_until?: string
  is_active?: boolean
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

    // Verify admin access
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
      .select('id, role')
      .eq('email', user.email)
      .single()

    if (adminError || !adminData || adminData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const url = new URL(req.url)
    const promotionId = url.pathname.split('/').pop()

    // GET - Fetch promotions
    if (req.method === 'GET') {
      if (promotionId && promotionId !== 'manage-promotions') {
        // Get single promotion
        const { data: promotion, error } = await supabase
          .from('promotions')
          .select(`
            *,
            admins!promotions_created_by_fkey (full_name)
          `)
          .eq('id', promotionId)
          .single()

        if (error || !promotion) {
          return new Response(
            JSON.stringify({ error: 'Promotion not found' }),
            { 
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true, promotion }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      } else {
        // Get all promotions with pagination
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
        const search = url.searchParams.get('search') || ''
        const status = url.searchParams.get('status') // 'active', 'expired', 'all'

        const offset = (page - 1) * limit

        let query = supabase
          .from('promotions')
          .select(`
            *,
            admins!promotions_created_by_fkey (full_name)
          `, { count: 'exact' })

        // Add search filter
        if (search) {
          query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Add status filter
        if (status === 'active') {
          query = query.eq('is_active', true).gte('valid_until', new Date().toISOString())
        } else if (status === 'expired') {
          query = query.or('is_active.eq.false,valid_until.lt.' + new Date().toISOString())
        }

        // Add pagination and sorting
        query = query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        const { data: promotions, error, count } = await query

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to fetch promotions' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              promotions: promotions || [],
              pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
              }
            }
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // POST - Create new promotion
    if (req.method === 'POST') {
      const promotionData: PromotionData = await req.json()

      // Validate required fields
      if (!promotionData.code || !promotionData.name || !promotionData.discount_type || promotionData.discount_value === undefined) {
        return new Response(
          JSON.stringify({ error: 'Code, name, discount_type, and discount_value are required' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Check if promotion code already exists
      const { data: existingPromo } = await supabase
        .from('promotions')
        .select('id')
        .eq('code', promotionData.code)
        .single()

      if (existingPromo) {
        return new Response(
          JSON.stringify({ error: 'Promotion code already exists' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { data: newPromotion, error } = await supabase
        .from('promotions')
        .insert({
          ...promotionData,
          created_by: adminData.id
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create promotion' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          promotion: newPromotion,
          message: 'Promotion created successfully'
        }),
        { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // PUT - Update promotion
    if (req.method === 'PUT') {
      if (!promotionId || promotionId === 'manage-promotions') {
        return new Response(
          JSON.stringify({ error: 'Promotion ID is required for update' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const updateData: Partial<PromotionData> = await req.json()

      // If updating code, check for conflicts
      if (updateData.code) {
        const { data: existingPromo } = await supabase
          .from('promotions')
          .select('id')
          .eq('code', updateData.code)
          .neq('id', promotionId)
          .single()

        if (existingPromo) {
          return new Response(
            JSON.stringify({ error: 'Promotion code already exists' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }

      const { data: updatedPromotion, error } = await supabase
        .from('promotions')
        .update(updateData)
        .eq('id', promotionId)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update promotion' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          promotion: updatedPromotion,
          message: 'Promotion updated successfully'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // DELETE - Delete promotion
    if (req.method === 'DELETE') {
      if (!promotionId || promotionId === 'manage-promotions') {
        return new Response(
          JSON.stringify({ error: 'Promotion ID is required for deletion' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId)

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete promotion' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Promotion deleted successfully'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Promotions management error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
