import { supabase } from './supabase'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AdminUser {
  id: string
  full_name: string
  email: string
  role: 'admin'
}

export interface LoginResponse {
  user: AdminUser
  message: string
}

class AuthService {
  private user: AdminUser | null = null

  constructor() {
    // Try to restore session from Supabase auth on initialization
    this.loadSession()
  }

  private async loadSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Get admin profile from database
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (adminData) {
          this.user = {
            id: adminData.id,
            full_name: adminData.full_name,
            email: adminData.email,
            role: adminData.role
          }
        }
      }
    } catch (error) {
      console.error('Error loading session:', error)
      this.clearSession()
    }
  }

  private clearSession() {
    this.user = null
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // First, sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Login failed')
      }

      // Get admin profile from database
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', authData.user.email)
        .single()

      if (adminError || !adminData) {
        throw new Error('Admin account not found')
      }

      this.user = {
        id: adminData.id,
        full_name: adminData.full_name,
        email: adminData.email,
        role: adminData.role
      }
      
      return {
        user: this.user,
        message: 'Login successful'
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearSession()
    }
  }

  getUser(): AdminUser | null {
    return this.user
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session?.user && !!this.user
    } catch {
      return false
    }
  }

  hasRole(requiredRole: AdminUser['role'] | AdminUser['role'][]): boolean {
    if (!this.user) return false
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(this.user.role)
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin'
  }

  // For backward compatibility - all admins have full access now
  isSuperAdmin(): boolean {
    return this.user?.role === 'admin'
  }

  isManager(): boolean {
    return this.user?.role === 'admin'
  }

  // Get authenticated Supabase client
  getAuthenticatedClient() {
    return supabase
  }
}

// Create a singleton instance
export const authService = new AuthService()

// Helper hook for React components
export const useAuth = () => {
  return {
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    getUser: authService.getUser.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    isAdmin: authService.isAdmin.bind(authService),
    isSuperAdmin: authService.isSuperAdmin.bind(authService),
    isManager: authService.isManager.bind(authService)
  }
}
