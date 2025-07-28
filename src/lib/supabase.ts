import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          loyalty_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string | null
          image_url: string | null
          calories: number | null
          allergens: string[] | null
          is_vegan: boolean
          is_vegetarian: boolean
          is_gluten_free: boolean
          prep_time: number | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id?: string | null
          image_url?: string | null
          calories?: number | null
          allergens?: string[] | null
          is_vegan?: boolean
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          prep_time?: number | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string | null
          image_url?: string | null
          calories?: number | null
          allergens?: string[] | null
          is_vegan?: boolean
          is_vegetarian?: boolean
          is_gluten_free?: boolean
          prep_time?: number | null
          is_available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total_amount: number
          delivery_address: any | null
          estimated_delivery: string | null
          actual_delivery: string | null
          payment_method: string | null
          payment_status: string
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount: number
          delivery_address?: any | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          payment_method?: string | null
          payment_status?: string
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount?: number
          delivery_address?: any | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          payment_method?: string | null
          payment_status?: string
          special_instructions?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          menu_item_id: string | null
          quantity: number
          unit_price: number
          customizations: any | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          menu_item_id?: string | null
          quantity: number
          unit_price: number
          customizations?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          menu_item_id?: string | null
          quantity?: number
          unit_price?: number
          customizations?: any | null
          created_at?: string
        }
      }
    }
  }
}
