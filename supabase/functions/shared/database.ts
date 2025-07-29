// supabase/functions/shared/database.ts
// Database utilities and helpers

// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface DatabaseConfig {
  url: string
  serviceRoleKey: string
  schema?: string
}

export class DatabaseUtils {
  private static client: any = null

  static getClient(config?: DatabaseConfig) {
    if (!this.client) {
      const url = config?.url || Deno.env.get('SUPABASE_URL')
      const key = config?.serviceRoleKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

      if (!url || !key) {
        throw new Error('Database configuration missing')
      }

      this.client = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    return this.client
  }

  // Admin-specific database operations
  static async findAdminByEmail(email: string) {
    const client = this.getClient()
    
    const { data, error } = await client
      .from('admins')
      .select(`
        id,
        full_name,
        email,
        hashed_password,
        role,
        status,
        last_login,
        created_at,
        updated_at,
        permissions,
        failed_login_attempts,
        locked_until
      `)
      .eq('email', email.toLowerCase().trim())
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Database error finding admin:', error)
      return { admin: null, error }
    }

    return { admin: data, error: null }
  }

  static async updateAdminLastLogin(adminId: string) {
    const client = this.getClient()
    
    const { error } = await client
      .from('admins')
      .update({ 
        last_login: new Date().toISOString(),
        failed_login_attempts: 0, // Reset failed attempts on successful login
        locked_until: null
      })
      .eq('id', adminId)

    if (error) {
      console.error('Error updating admin last login:', error)
    }

    return { error }
  }

  static async incrementFailedLoginAttempts(adminId: string) {
    const client = this.getClient()
    
    // Get current failed attempts
    const { data: admin } = await client
      .from('admins')
      .select('failed_login_attempts')
      .eq('id', adminId)
      .single()

    const failedAttempts = (admin?.failed_login_attempts || 0) + 1
    const maxAttempts = 5
    
    // Lock account if too many failed attempts
    const updateData: any = { failed_login_attempts: failedAttempts }
    if (failedAttempts >= maxAttempts) {
      updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      updateData.status = 'suspended'
    }

    const { error } = await client
      .from('admins')
      .update(updateData)
      .eq('id', adminId)

    return { error, isLocked: failedAttempts >= maxAttempts }
  }

  // Audit logging
  static async logAdminActivity(activity: {
    admin_id: string
    action: string
    resource?: string
    details?: Record<string, any>
    ip_address?: string
    user_agent?: string
  }) {
    const client = this.getClient()
    
    const { error } = await client
      .from('admin_audit_logs')
      .insert({
        ...activity,
        timestamp: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging admin activity:', error)
    }

    return { error }
  }

  // Session management
  static async createAdminSession(sessionData: {
    admin_id: string
    token_jti: string
    expires_at: string
    ip_address?: string
    user_agent?: string
  }) {
    const client = this.getClient()
    
    const { data, error } = await client
      .from('admin_sessions')
      .insert({
        ...sessionData,
        created_at: new Date().toISOString(),
        is_active: true
      })
      .select()

    return { session: data?.[0], error }
  }

  static async invalidateAdminSession(tokenJti: string) {
    const client = this.getClient()
    
    const { error } = await client
      .from('admin_sessions')
      .update({ 
        is_active: false,
        invalidated_at: new Date().toISOString()
      })
      .eq('token_jti', tokenJti)

    return { error }
  }

  static async isSessionValid(tokenJti: string): Promise<boolean> {
    const client = this.getClient()
    
    const { data, error } = await client
      .from('admin_sessions')
      .select('is_active, expires_at')
      .eq('token_jti', tokenJti)
      .eq('is_active', true)
      .single()

    if (error || !data) return false

    // Check if session has expired
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    
    return expiresAt > now
  }

  // Security monitoring
  static async logSecurityEvent(event: {
    event_type: 'login_success' | 'login_failed' | 'rate_limit_exceeded' | 'suspicious_activity'
    admin_id?: string
    ip_address?: string
    user_agent?: string
    details?: Record<string, any>
  }) {
    const client = this.getClient()
    
    const { error } = await client
      .from('security_events')
      .insert({
        ...event,
        timestamp: new Date().toISOString()
      })

    return { error }
  }

  // Health check
  static async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const client = this.getClient()
      const { error } = await client.from('admins').select('count').limit(1)
      
      return { healthy: !error, error: error?.message }
    } catch (err) {
      return { healthy: false, error: err.message }
    }
  }

  // Cleanup expired sessions
  static async cleanupExpiredSessions() {
    const client = this.getClient()
    
    const { error } = await client
      .from('admin_sessions')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)

    return { error }
  }
}

// Query builder helper for complex operations
export class QueryBuilder {
  private client: any
  private tableName: string
  private selectFields: string = '*'
  private conditions: Array<{ column: string; operator: string; value: any }> = []
  private orderBy: Array<{ column: string; ascending: boolean }> = []
  private limitCount?: number
  private offsetCount?: number

  constructor(tableName: string) {
    this.client = DatabaseUtils.getClient()
    this.tableName = tableName
  }

  select(fields: string) {
    this.selectFields = fields
    return this
  }

  where(column: string, operator: string, value: any) {
    this.conditions.push({ column, operator, value })
    return this
  }

  eq(column: string, value: any) {
    return this.where(column, 'eq', value)
  }

  neq(column: string, value: any) {
    return this.where(column, 'neq', value)
  }

  gt(column: string, value: any) {
    return this.where(column, 'gt', value)
  }

  gte(column: string, value: any) {
    return this.where(column, 'gte', value)
  }

  lt(column: string, value: any) {
    return this.where(column, 'lt', value)
  }

  lte(column: string, value: any) {
    return this.where(column, 'lte', value)
  }

  like(column: string, value: string) {
    return this.where(column, 'like', value)
  }

  in(column: string, values: any[]) {
    return this.where(column, 'in', values)
  }

  order(column: string, ascending: boolean = true) {
    this.orderBy.push({ column, ascending })
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  offset(count: number) {
    this.offsetCount = count
    return this
  }

  async execute() {
    let query = this.client.from(this.tableName).select(this.selectFields)

    // Apply conditions
    for (const condition of this.conditions) {
      query = query[condition.operator](condition.column, condition.value)
    }

    // Apply ordering
    for (const order of this.orderBy) {
      query = query.order(order.column, { ascending: order.ascending })
    }

    // Apply pagination
    if (this.limitCount !== undefined) {
      query = query.limit(this.limitCount)
    }
    if (this.offsetCount !== undefined) {
      query = query.range(this.offsetCount, this.offsetCount + (this.limitCount || 10) - 1)
    }

    return await query
  }

  async single() {
    const query = await this.execute()
    return { ...query, data: query.data?.[0] || null }
  }
}
