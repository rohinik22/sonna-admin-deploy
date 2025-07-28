import { supabase } from './supabase'
import { authService } from './auth'
import type { 
  MenuCategory, 
  MenuItem, 
  Order, 
  OrderItem, 
  Inventory,
  Admin 
} from './supabase'

class DataService {
  private getAuthenticatedClient() {
    if (!authService.isAuthenticated()) {
      throw new Error('User is not authenticated')
    }
    return supabase
  }

  // Admin Management
  async getAdmins(): Promise<Admin[]> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createAdmin(admin: Omit<Admin, 'id' | 'created_at' | 'updated_at'>): Promise<Admin> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('admins')
      .insert([admin])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateAdmin(id: string, updates: Partial<Admin>): Promise<Admin> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteAdmin(id: string): Promise<void> {
    const client = this.getAuthenticatedClient()
    const { error } = await client
      .from('admins')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Menu Categories
  async getMenuCategories(): Promise<MenuCategory[]> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('menu_categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createMenuCategory(category: Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>): Promise<MenuCategory> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('menu_categories')
      .insert([category])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMenuCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('menu_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMenuCategory(id: string): Promise<void> {
    const client = this.getAuthenticatedClient()
    const { error } = await client
      .from('menu_categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Menu Items
  async getMenuItems(categoryId?: string): Promise<MenuItem[]> {
    const client = this.getAuthenticatedClient()
    let query = client
      .from('menu_items')
      .select('*')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('menu_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteMenuItem(id: string): Promise<void> {
    const client = this.getAuthenticatedClient()
    const { error } = await client
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Orders
  async getOrders(status?: Order['status'], limit?: number): Promise<Order[]> {
    const client = this.getAuthenticatedClient()
    let query = client
      .from('orders')
      .select('*')

    if (status) {
      query = query.eq('status', status)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getOrderWithItems(orderId: string): Promise<Order & { order_items: (OrderItem & { menu_items: MenuItem })[] }> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('orders')
      .insert([order])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Order Items
  async createOrderItems(items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('order_items')
      .insert(items)
      .select()

    if (error) throw error
    return data || []
  }

  // Inventory
  async getInventory(): Promise<Inventory[]> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('inventory')
      .select('*')
      .order('item_name', { ascending: true })

    if (error) throw error
    return data || []
  }

  async getLowStockItems(): Promise<Inventory[]> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('inventory')
      .select('*')
      .filter('current_stock', 'lte', 'minimum_stock')
      .order('current_stock', { ascending: true })

    if (error) throw error
    return data || []
  }

  async updateInventoryStock(id: string, newStock: number): Promise<Inventory> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('inventory')
      .update({ 
        current_stock: newStock,
        last_restocked: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async createInventoryItem(item: Omit<Inventory, 'id' | 'created_at' | 'updated_at' | 'last_restocked'>): Promise<Inventory> {
    const client = this.getAuthenticatedClient()
    const { data, error } = await client
      .from('inventory')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  async getDashboardStats() {
    const client = this.getAuthenticatedClient()
    
    // Get basic counts
    const [ordersResult, menuItemsResult, inventoryResult] = await Promise.all([
      client.from('orders').select('*', { count: 'exact', head: true }),
      client.from('menu_items').select('*', { count: 'exact', head: true }),
      client.from('inventory').select('*', { count: 'exact', head: true })
    ])

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data: todayOrders } = await client
      .from('orders')
      .select('total_amount')
      .gte('created_at', today.toISOString())

    // Calculate today's revenue
    const todayRevenue = todayOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get pending orders count
    const { count: pendingOrders } = await client
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    return {
      totalOrders: ordersResult.count || 0,
      totalMenuItems: menuItemsResult.count || 0,
      totalInventoryItems: inventoryResult.count || 0,
      todayRevenue,
      pendingOrders: pendingOrders || 0
    }
  }
}

// Create singleton instance
export const dataService = new DataService()
