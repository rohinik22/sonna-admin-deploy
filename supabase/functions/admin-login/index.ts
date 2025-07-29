// supabase/functions/admin-login/index.ts
// Secure Admin Authentication Edge Function
// Handles admin login with enhanced security, rate limiting, and proper error handling

// @ts-ignore - Deno ESM.sh imports not recognized in Node.js environment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore
import bcrypt from 'https://esm.sh/bcryptjs@2'
// @ts-ignore
import jwt from 'https://esm.sh/jsonwebtoken@9'

// Security-focused CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}

// Rate limiting store (in-memory for demo, use Redis in production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

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
  status: 'active' | 'inactive' | 'suspended'
  last_login?: string
}

interface LoginResponse {
  token?: string
  user?: Omit<Admin, 'hashed_password'>
  message: string
  error?: string
}

// Input validation and sanitization
function validateLoginInput(email: string, password: string): { isValid: boolean; error?: string } {
  if (!email || !password) {
    return { isValid: false, error: 'Email and password are required' }
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  // Password strength validation
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' }
  }

  return { isValid: true }
}

// Rate limiting check
function checkRateLimit(identifier: string): { allowed: boolean; error?: string } {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)

  if (attempts) {
    // Reset if window expired
    if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
      loginAttempts.delete(identifier)
      return { allowed: true }
    }

    // Check if max attempts exceeded
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      return { 
        allowed: false, 
        error: `Too many login attempts. Please try again in ${Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.lastAttempt)) / 60000)} minutes.` 
      }
    }
  }

  return { allowed: true }
}

// Update rate limiting counter
function updateRateLimit(identifier: string, success: boolean) {
  if (success) {
    loginAttempts.delete(identifier) // Clear on successful login
    return
  }

  const now = Date.now()
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: now }
  
  loginAttempts.set(identifier, {
    count: attempts.count + 1,
    lastAttempt: now
  })
}

// Secure response helper
function createResponse(data: LoginResponse, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  })
}

// @ts-ignore - Deno global not available in Node.js environment
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return createResponse({ 
      message: 'Method not allowed', 
      error: 'Only POST requests are allowed' 
    }, 405)
  }

  const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
  
  try {
    // Parse and validate request body
    let requestBody: LoginRequest
    try {
      requestBody = await req.json()
    } catch {
      return createResponse({ 
        message: 'Invalid request', 
        error: 'Invalid JSON in request body' 
      }, 400)
    }

    const { email, password } = requestBody

    // Input validation
    const validation = validateLoginInput(email, password)
    if (!validation.isValid) {
      return createResponse({ 
        message: 'Validation failed', 
        error: validation.error 
      }, 400)
    }

    // Rate limiting check
    const rateLimitCheck = checkRateLimit(clientIP)
    if (!rateLimitCheck.allowed) {
      return createResponse({ 
        message: 'Rate limit exceeded', 
        error: rateLimitCheck.error 
      }, 429)
    }

    // Environment variables validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const jwtSecret = Deno.env.get('JWT_SECRET')

    if (!supabaseUrl || !serviceRoleKey || !jwtSecret) {
      console.error('Missing required environment variables')
      return createResponse({ 
        message: 'Server configuration error', 
        error: 'Server is not properly configured' 
      }, 500)
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    // Find admin user with additional security checks
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, full_name, email, hashed_password, role, status, last_login')
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'active') // Only allow active users to login
      .single()

    if (error || !admin) {
      console.warn(`Failed login attempt for email: ${email} from IP: ${clientIP}`)
      updateRateLimit(clientIP, false)
      
      // Generic error message to prevent user enumeration
      return createResponse({ 
        message: 'Authentication failed', 
        error: 'Invalid credentials' 
      }, 401)
    }

    // Verify password
    const passwordMatches = await bcrypt.compare(password, admin.hashed_password)

    if (!passwordMatches) {
      console.warn(`Invalid password attempt for admin: ${admin.email} from IP: ${clientIP}`)
      updateRateLimit(clientIP, false)
      
      return createResponse({ 
        message: 'Authentication failed', 
        error: 'Invalid credentials' 
      }, 401)
    }

    // Update rate limiting (successful login)
    updateRateLimit(clientIP, true)

    // Create secure JWT token
    const tokenPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      aud: 'authenticated',
      iss: 'sonna-admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8-hour expiry for security
      jti: crypto.randomUUID() // Unique token ID for revocation if needed
    }

    const customToken = jwt.sign(tokenPayload, jwtSecret, {
      algorithm: 'HS256'
    })

    // Update last login timestamp
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    // Remove sensitive data from response
    const { hashed_password, ...userWithoutPassword } = admin

    console.log(`Successful login for admin: ${admin.email} from IP: ${clientIP}`)

    return createResponse({
      token: customToken,
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Unexpected error in admin login:', error)
    updateRateLimit(clientIP, false)
    
    return createResponse({ 
      message: 'Internal server error', 
      error: 'An unexpected error occurred' 
    }, 500)
  }
})
