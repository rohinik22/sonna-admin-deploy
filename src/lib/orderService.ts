import { supabase } from './supabase'

export interface OrderItem {
  menu_item_id: string
  quantity: number
  customizations?: any
}

export interface CreateOrderRequest {
  user_id?: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  order_type: 'dine_in' | 'takeaway' | 'delivery' | 'pickup'
  delivery_address?: any
  table_number?: number
  notes?: string
  promotion_code?: string
  items: OrderItem[]
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  order_type: string
  status: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  delivery_fee: number
  total_amount: number
  table_number?: number
  notes?: string
  delivery_address?: any
  estimated_delivery_time?: string
  actual_delivery_time?: string
  created_at: string
  updated_at: string
  order_items: any[]
  promotions?: any
  users?: any
}

class OrderService {
  
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData
      })

      if (error) {
        throw new Error(error.message || 'Failed to create order')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data.order
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  }

  async updateOrderStatus(
    orderId: string, 
    newStatus: string, 
    notes?: string,
    adminId?: string
  ): Promise<Order> {
    try {
      const { data, error } = await supabase.functions.invoke('update-order-status', {
        body: {
          order_id: orderId,
          new_status: newStatus,
          notes,
          admin_id: adminId
        }
      })

      if (error) {
        throw new Error(error.message || 'Failed to update order status')
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to update order status')
      }

      return data.order
    } catch (error) {
      console.error('Update order status error:', error)
      throw error
    }
  }

  async getOrders(filters?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<{ orders: Order[], pagination: any }> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, price)
          ),
          promotions (code, name, discount_type, discount_value),
          users (full_name, email, phone)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.page && filters?.limit) {
        const start = (filters.page - 1) * filters.limit
        const end = start + filters.limit - 1
        query = query.range(start, end)
      }

      const { data: orders, error, count } = await query

      if (error) {
        throw new Error(error.message || 'Failed to fetch orders')
      }

      return {
        orders: orders || [],
        pagination: {
          total: count || 0,
          page: filters?.page || 1,
          limit: filters?.limit || 20
        }
      }
    } catch (error) {
      console.error('Get orders error:', error)
      throw error
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, price, description)
          ),
          promotions (code, name, discount_type, discount_value),
          users (full_name, email, phone, address)
        `)
        .eq('id', orderId)
        .single()

      if (error) {
        throw new Error(error.message || 'Failed to fetch order')
      }

      return order
    } catch (error) {
      console.error('Get order by ID error:', error)
      throw error
    }
  }

  // Real-time order updates subscription
  subscribeToOrderUpdates(callback: (order: Order) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        callback(payload.new as Order)
      })
      .subscribe()
  }

  // Kitchen display specific methods
  async getKitchenOrders(): Promise<{
    newOrders: Order[]
    inProgress: Order[]
    ready: Order[]
  }> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, prep_time_minutes)
          )
        `)
        .in('status', ['confirmed', 'preparing', 'cooking', 'ready'])
        .order('created_at', { ascending: true })

      if (error) {
        throw new Error(error.message || 'Failed to fetch kitchen orders')
      }

      const newOrders = orders?.filter(order => order.status === 'confirmed') || []
      const inProgress = orders?.filter(order => ['preparing', 'cooking'].includes(order.status)) || []
      const ready = orders?.filter(order => order.status === 'ready') || []

      return { newOrders, inProgress, ready }
    } catch (error) {
      console.error('Get kitchen orders error:', error)
      throw error
    }
  }
}

export const orderService = new OrderService()
