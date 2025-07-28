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
        // Try to get admin profile from database
        const { data: adminData, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (adminData && !error) {
          this.user = {
            id: adminData.id,
            full_name: adminData.full_name,
            email: adminData.email,
            role: adminData.role
          }
        } else {
          // If admins table doesn't exist or no admin record found,
          // create a temporary admin user for testing
          console.warn('Admin table not found or user not in admins table. Creating temporary admin.')
          this.user = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 'Admin User',
            email: session.user.email || 'admin@temp.com',
            role: 'admin'
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

      // Try to get admin profile from database
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', authData.user.email)
        .single()

      if (adminData && !adminError) {
        this.user = {
          id: adminData.id,
          full_name: adminData.full_name,
          email: adminData.email,
          role: adminData.role
        }
      } else {
        // If admins table doesn't exist or no admin record found,
        // create a temporary admin user for testing
        console.warn('Admin table not found or user not in admins table. Creating temporary admin.')
        this.user = {
          id: authData.user.id,
          full_name: authData.user.user_metadata?.full_name || 'Admin User',
          email: authData.user.email || 'admin@temp.com',
          role: 'admin'
        }
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
      // Clear user state first
      this.clearSession()
      // Then sign out from Supabase
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Ensure user is cleared even if signOut fails
      this.clearSession()
    }
  }

  getUser(): AdminUser | null {
    return this.user
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Only return true if we have both a valid session AND a user object set
      if (session?.user && this.user) {
        return true
      }
      
      // If we have a session but no user object, try to load it
      if (session?.user && !this.user) {
        await this.loadSession()
        return !!this.user
      }
      
      return false
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
