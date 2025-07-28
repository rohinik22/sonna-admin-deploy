import { supabase } from './supabase'

export interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  minimum_order_amount: number
  maximum_discount_amount?: number
  usage_limit?: number
  used_count: number
  valid_from: string
  valid_until?: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreatePromotionData {
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

class PromotionService {
  
  private async getAuthToken(): Promise<string> {
    const session = await supabase.auth.getSession()
    if (!session.data.session?.access_token) {
      throw new Error('No authentication token available')
    }
    return session.data.session.access_token
  }

  async getPromotions(filters?: {
    search?: string
    status?: 'active' | 'expired' | 'all'
    page?: number
    limit?: number
  }): Promise<{
    promotions: Promotion[]
    pagination: any
  }> {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.status) queryParams.append('status', filters.status)

      const token = await this.getAuthToken()
      
      const { data, error } = await supabase.functions.invoke('manage-promotions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (error) {
        throw new Error(error.message || 'Failed to fetch promotions')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch promotions')
      }

      return data.data
    } catch (error) {
      console.error('Get promotions error:', error)
      throw error
    }
  }

  async getPromotionById(promotionId: string): Promise<Promotion> {
    try {
      const token = await this.getAuthToken()
      
      const { data, error } = await supabase.functions.invoke(`manage-promotions/${promotionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (error) {
        throw new Error(error.message || 'Failed to fetch promotion')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch promotion')
      }

      return data.promotion
    } catch (error) {
      console.error('Get promotion by ID error:', error)
      throw error
    }
  }

  async createPromotion(promotionData: CreatePromotionData): Promise<Promotion> {
    try {
      const token = await this.getAuthToken()
      
      const { data, error } = await supabase.functions.invoke('manage-promotions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: promotionData
      })

      if (error) {
        throw new Error(error.message || 'Failed to create promotion')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create promotion')
      }

      return data.promotion
    } catch (error) {
      console.error('Create promotion error:', error)
      throw error
    }
  }

  async updatePromotion(promotionId: string, updateData: Partial<CreatePromotionData>): Promise<Promotion> {
    try {
      const token = await this.getAuthToken()
      
      const { data, error } = await supabase.functions.invoke(`manage-promotions/${promotionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updateData
      })

      if (error) {
        throw new Error(error.message || 'Failed to update promotion')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to update promotion')
      }

      return data.promotion
    } catch (error) {
      console.error('Update promotion error:', error)
      throw error
    }
  }

  async deletePromotion(promotionId: string): Promise<void> {
    try {
      const token = await this.getAuthToken()
      
      const { data, error } = await supabase.functions.invoke(`manage-promotions/${promotionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (error) {
        throw new Error(error.message || 'Failed to delete promotion')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete promotion')
      }
    } catch (error) {
      console.error('Delete promotion error:', error)
      throw error
    }
  }

  // Validate promotion code (for frontend use)
  async validatePromotionCode(code: string, orderAmount: number): Promise<{
    valid: boolean
    promotion?: Promotion
    discountAmount?: number
    error?: string
  }> {
    try {
      const { data: promotion, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !promotion) {
        return {
          valid: false,
          error: 'Invalid promotion code'
        }
      }

      // Check if promotion is expired
      if (promotion.valid_until && new Date(promotion.valid_until) < new Date()) {
        return {
          valid: false,
          error: 'Promotion code has expired'
        }
      }

      // Check minimum order amount
      if (orderAmount < promotion.minimum_order_amount) {
        return {
          valid: false,
          error: `Minimum order amount of ₹${promotion.minimum_order_amount} required`
        }
      }

      // Check usage limit
      if (promotion.usage_limit && promotion.used_count >= promotion.usage_limit) {
        return {
          valid: false,
          error: 'Promotion usage limit exceeded'
        }
      }

      // Calculate discount
      let discountAmount = 0
      if (promotion.discount_type === 'percentage') {
        discountAmount = (orderAmount * promotion.discount_value) / 100
        if (promotion.maximum_discount_amount) {
          discountAmount = Math.min(discountAmount, promotion.maximum_discount_amount)
        }
      } else {
        discountAmount = promotion.discount_value
      }

      return {
        valid: true,
        promotion,
        discountAmount
      }
    } catch (error) {
      console.error('Validate promotion code error:', error)
      return {
        valid: false,
        error: 'Failed to validate promotion code'
      }
    }
  }

  // Get active promotions for public display
  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message || 'Failed to fetch active promotions')
      }

      return promotions || []
    } catch (error) {
      console.error('Get active promotions error:', error)
      throw error
    }
  }

  // Get promotion usage analytics
  async getPromotionAnalytics(): Promise<{
    totalPromotions: number
    activePromotions: number
    totalUsage: number
    totalDiscountGiven: number
  }> {
    try {
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')

      if (error) {
        throw new Error(error.message || 'Failed to fetch promotion analytics')
      }

      const totalPromotions = promotions?.length || 0
      const activePromotions = promotions?.filter(p => 
        p.is_active && (!p.valid_until || new Date(p.valid_until) > new Date())
      ).length || 0
      const totalUsage = promotions?.reduce((sum, p) => sum + p.used_count, 0) || 0

      // Get total discount given
      const { data: orders } = await supabase
        .from('orders')
        .select('discount_amount')
        .not('discount_amount', 'is', null)

      const totalDiscountGiven = orders?.reduce((sum, order) => sum + (order.discount_amount || 0), 0) || 0

      return {
        totalPromotions,
        activePromotions,
        totalUsage,
        totalDiscountGiven
      }
    } catch (error) {
      console.error('Get promotion analytics error:', error)
      throw error
    }
  }
}

export const promotionService = new PromotionService()
