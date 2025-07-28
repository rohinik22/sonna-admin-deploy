// supabase/functions/admin-login/index.ts
// NOTE: TypeScript errors in this file are expected in VS Code environment
// This is a Deno Edge Function that uses Deno-specific imports and globals
// The function will work correctly when deployed to Supabase

// @ts-ignore - Deno ESM.sh imports not recognized in Node.js environment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import bcrypt from 'https://esm.sh/bcryptjs@2'
// @ts-ignore
import jwt from 'https://esm.sh/jsonwebtoken@9'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string
  password: string
}

interface Admin {
  id: string
  full_name: string
  email: string
  hashed_password: string
  role: string
}

// @ts-ignore - Deno global not available in Node.js environment
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get email and password from the request body
    const { email, password }: LoginRequest = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 2. Create a Supabase admin client to bypass RLS for this check
    const supabaseAdmin = createClient(
      // @ts-ignore - Deno.env not available in Node.js environment
      Deno.env.get('SUPABASE_URL')!,
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 3. Find the admin in your 'admins' table
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, full_name, email, hashed_password, role')
      .eq('email', email)
      .single()

    if (error || !admin) {
      console.error('Admin lookup error:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 4. Compare the provided password with the stored hash
    const passwordMatches = await bcrypt.compare(password, admin.hashed_password)

    if (!passwordMatches) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // 5. If successful, create and sign a custom JWT
    // @ts-ignore
    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const customToken = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role, // This is crucial for your RLS policies
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24-hour expiry
      },
      jwtSecret
    )

    // Return user data without sensitive information
    const { hashed_password, ...userWithoutPassword } = admin

    return new Response(
      JSON.stringify({ 
        token: customToken, 
        user: userWithoutPassword,
        message: 'Login successful'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
