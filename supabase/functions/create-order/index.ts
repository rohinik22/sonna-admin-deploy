// supabase/functions/create-order/index.ts
// Edge Function to create new orders with promotion validation and real-time updates

// @ts-ignore - Deno ESM.sh imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderItem {
  menu_item_id: string
  quantity: number
  customizations?: any
}

interface CreateOrderRequest {
  user_id: string
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

interface PromotionData {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  minimum_order_amount: number
  maximum_discount_amount?: number
  usage_limit?: number
  used_count: number
}

// @ts-ignore - Deno global
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const orderData: CreateOrderRequest = await req.json()

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order items are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get menu items with prices
    const menuItemIds = orderData.items.map(item => item.menu_item_id)
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, price, is_available')
      .in('id', menuItemIds)

    if (menuError || !menuItems) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch menu items' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if all items are available
    const unavailableItems = menuItems.filter(item => !item.is_available)
    if (unavailableItems.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Some items are not available',
          unavailable_items: unavailableItems.map(item => item.name)
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate subtotal
    let subtotal = 0
    for (const orderItem of orderData.items) {
      const menuItem = menuItems.find(item => item.id === orderItem.menu_item_id)
      if (menuItem) {
        subtotal += menuItem.price * orderItem.quantity
      }
    }

    let discountAmount = 0
    let promotionId: string | null = null

    // Validate promotion code if provided
    if (orderData.promotion_code) {
      const { data: promotion, error: promoError } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', orderData.promotion_code)
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single()

      if (promoError || !promotion) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired promotion code' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const promoData = promotion as PromotionData

      // Check minimum order amount
      if (subtotal < promoData.minimum_order_amount) {
        return new Response(
          JSON.stringify({ 
            error: `Minimum order amount of ₹${promoData.minimum_order_amount} required for this promotion`
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Check usage limit
      if (promoData.usage_limit && promoData.used_count >= promoData.usage_limit) {
        return new Response(
          JSON.stringify({ error: 'Promotion usage limit exceeded' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Calculate discount
      if (promoData.discount_type === 'percentage') {
        discountAmount = (subtotal * promoData.discount_value) / 100
        if (promoData.maximum_discount_amount) {
          discountAmount = Math.min(discountAmount, promoData.maximum_discount_amount)
        }
      } else {
        discountAmount = promoData.discount_value
      }

      promotionId = promoData.id
    }

    // Calculate tax (18% GST)
    const taxAmount = (subtotal - discountAmount) * 0.18

    // Calculate delivery fee (for delivery orders)
    const deliveryFee = orderData.order_type === 'delivery' ? 30 : 0

    // Calculate total amount
    const totalAmount = subtotal - discountAmount + taxAmount + deliveryFee

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        order_type: orderData.order_type,
        status: 'pending',
        subtotal: subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        promotion_id: promotionId,
        delivery_address: orderData.delivery_address,
        table_number: orderData.table_number,
        notes: orderData.notes,
        estimated_delivery_time: orderData.order_type === 'delivery' 
          ? new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes
          : new Date(Date.now() + 20 * 60 * 1000).toISOString()  // 20 minutes
      })
      .select()
      .single()

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create order items
    const orderItems = orderData.items.map(item => {
      const menuItem = menuItems.find(mi => mi.id === item.menu_item_id)
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem?.price || 0,
        customizations: item.customizations
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Rollback the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update promotion usage count if promotion was used
    if (promotionId) {
      await supabase
        .from('promotions')
        .update({ used_count: supabase.sql`used_count + 1` })
        .eq('id', promotionId)

      // Record promotion usage
      await supabase
        .from('user_promotions')
        .insert({
          user_id: orderData.user_id,
          promotion_id: promotionId,
          order_id: order.id
        })
    }

    // Get the complete order with items for response
    const { data: completeOrder } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, price)
        ),
        promotions (code, name, discount_type, discount_value)
      `)
      .eq('id', order.id)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        order: completeOrder,
        message: 'Order created successfully'
      }),
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Order creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
