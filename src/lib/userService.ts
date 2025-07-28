import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  date_of_birth?: string
  address?: any
  loyalty_points: number
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface UserAnalytics {
  total_users: number
  new_users_this_month: number
  total_loyalty_points: number
  total_revenue: number
  average_order_value: number
}

class UserService {
  
  async getUsers(filters?: {
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    users: User[]
    pagination: any
    analytics: UserAnalytics
  }> {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const { data, error } = await supabase.functions.invoke('get-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })

      if (error) {
        throw new Error(error.message || 'Failed to fetch users')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users')
      }

      return data.data
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to fetch user')
      }

      return user
    } catch (error) {
      console.error('Get user by ID error:', error)
      throw error
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to update user')
      }

      return updatedUser
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }

  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, price)
          ),
          promotions (code, name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch user orders')
      }

      return orders || []
    } catch (error) {
      console.error('Get user orders error:', error)
      throw error
    }
  }

  async getUserPromotionUsage(userId: string): Promise<any[]> {
    try {
      const { data: promotionUsage, error } = await supabase
        .from('user_promotions')
        .select(`
          *,
          promotions (code, name, discount_type, discount_value),
          orders (total_amount, created_at)
        `)
        .eq('user_id', userId)
        .order('used_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch user promotion usage')
      }

      return promotionUsage || []
    } catch (error) {
      console.error('Get user promotion usage error:', error)
      throw error
    }
  }

  // Create a new customer (for walk-ins or phone orders)
  async createUser(userData: {
    email: string
    full_name: string
    phone?: string
    address?: any
  }): Promise<User> {
    try {
      const { data: newUser, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to create user')
      }

      return newUser
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  // Get top customers by spending
  async getTopCustomers(limit: number = 10): Promise<User[]> {
    try {
      const { data: topCustomers, error } = await supabase
        .from('users')
        .select('*')
        .order('total_spent', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(error.message || 'Failed to fetch top customers')
      }

      return topCustomers || []
    } catch (error) {
      console.error('Get top customers error:', error)
      throw error
    }
  }

  // Search users
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('full_name', { ascending: true })
        .limit(20)

      if (error) {
        throw new Error(error.message || 'Failed to search users')
      }

      return users || []
    } catch (error) {
      console.error('Search users error:', error)
      throw error
    }
  }
}

export const userService = new UserService()
