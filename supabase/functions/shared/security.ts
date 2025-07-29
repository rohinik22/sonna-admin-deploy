// supabase/functions/shared/security.ts
// Shared security utilities for backend functions

export class SecurityUtils {
  // Rate limiting configuration
  static readonly RATE_LIMITS = {
    LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 15 minutes
    API: { maxAttempts: 100, windowMs: 60 * 1000 }, // 1 minute
    PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 } // 1 hour
  }

  // Security headers for all responses
  static getSecurityHeaders(origin?: string): Record<string, string> {
    const isProduction = Deno.env.get('NODE_ENV') === 'production'
    
    return {
      'Access-Control-Allow-Origin': isProduction && origin ? origin : '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
      })
    }
  }

  // Input validation helpers
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email) && email.length <= 254
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters')
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return { isValid: errors.length === 0, errors }
  }

  // Sanitize input strings
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .substring(0, 1000) // Limit length
  }

  // Generate secure random tokens
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Validate JWT token structure
  static isValidJWTStructure(token: string): boolean {
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  }

  // Create secure response helper
  static createSecureResponse(
    data: any, 
    status: number = 200, 
    additionalHeaders: Record<string, string> = {}
  ): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        ...this.getSecurityHeaders(),
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    })
  }

  // Log security events
  static logSecurityEvent(
    event: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'RATE_LIMIT_HIT' | 'INVALID_TOKEN' | 'SUSPICIOUS_ACTIVITY',
    details: Record<string, any>
  ): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event,
      ...details,
      severity: this.getEventSeverity(event)
    }

    // In production, send to proper logging service
    console.log(`[SECURITY_EVENT] ${JSON.stringify(logEntry)}`)
  }

  private static getEventSeverity(event: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    switch (event) {
      case 'LOGIN_SUCCESS': return 'LOW'
      case 'LOGIN_FAILED': return 'MEDIUM'
      case 'RATE_LIMIT_HIT': return 'HIGH'
      case 'INVALID_TOKEN': return 'HIGH'
      case 'SUSPICIOUS_ACTIVITY': return 'CRITICAL'
      default: return 'MEDIUM'
    }
  }
}

// Rate limiting middleware
export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>()

  static async checkLimit(
    identifier: string, 
    maxAttempts: number, 
    windowMs: number
  ): Promise<{ allowed: boolean; error?: string; retryAfter?: number }> {
    const now = Date.now()
    const attempts = this.attempts.get(identifier)

    if (!attempts || now > attempts.resetTime) {
      // Reset or initialize
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return { allowed: true }
    }

    if (attempts.count >= maxAttempts) {
      const retryAfter = Math.ceil((attempts.resetTime - now) / 1000)
      return {
        allowed: false,
        error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter
      }
    }

    // Increment counter
    attempts.count++
    this.attempts.set(identifier, attempts)
    
    return { allowed: true }
  }

  static resetLimit(identifier: string): void {
    this.attempts.delete(identifier)
  }

  // Cleanup old entries periodically
  static cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.attempts.entries()) {
      if (now > value.resetTime) {
        this.attempts.delete(key)
      }
    }
  }
}

// Environment validation
export class ConfigValidator {
  static validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const required = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET'
    ]

    for (const envVar of required) {
      const value = Deno.env.get(envVar)
      if (!value) {
        errors.push(`Missing required environment variable: ${envVar}`)
      }
    }

    // Validate JWT secret strength
    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long')
    }

    return { isValid: errors.length === 0, errors }
  }
}
