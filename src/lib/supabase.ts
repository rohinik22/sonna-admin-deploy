import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database schema
export interface Admin {
  id: string
  full_name: string
  email: string
  hashed_password: string
  role: 'admin'
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  is_available: boolean
  prep_time_minutes?: number
  allergens?: string[]
  nutritional_info?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  order_type: 'dine_in' | 'takeaway' | 'delivery' | 'pickup'
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  total_amount: number
  notes?: string
  table_number?: number
  delivery_address?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  customizations?: Record<string, any>
  created_at: string
}

export interface Inventory {
  id: string
  item_name: string
  current_stock: number
  minimum_stock: number
  unit: string
  cost_per_unit: number
  supplier?: string
  last_restocked: string
  created_at: string
  updated_at: string
}
