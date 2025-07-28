// supabase/functions/update-order-status/index.ts
// Edge Function to update order status with real-time broadcasting

// @ts-ignore - Deno ESM.sh imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateOrderStatusRequest {
  order_id: string
  new_status: 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'delivered' | 'cancelled'
  notes?: string
  admin_id?: string
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

    if (req.method !== 'PUT') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { order_id, new_status, notes, admin_id }: UpdateOrderStatusRequest = await req.json()

    // Validate required fields
    if (!order_id || !new_status) {
      return new Response(
        JSON.stringify({ error: 'Order ID and new status are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'preparing', 'cooking', 'ready', 'delivered', 'cancelled']
    if (!validStatuses.includes(new_status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status value' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get current order to check existing status
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, customer_name, order_type, total_amount')
      .eq('id', order_id)
      .single()

    if (fetchError || !currentOrder) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const oldStatus = currentOrder.status

    // Don't update if status is the same
    if (oldStatus === new_status) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Order status is already set to ' + new_status,
          order: currentOrder
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Update the order status
    const updateData: any = {
      status: new_status,
      updated_at: new Date().toISOString()
    }

    // Set delivery time if status is delivered
    if (new_status === 'delivered') {
      updateData.actual_delivery_time = new Date().toISOString()
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order_id)
      .select(`
        *,
        order_items (
          *,
          menu_items (name, price)
        )
      `)
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update order status' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create order status history record
    const { error: historyError } = await supabase
      .from('order_status_history')
      .insert({
        order_id: order_id,
        old_status: oldStatus,
        new_status: new_status,
        changed_by: admin_id,
        notes: notes || `Status changed from ${oldStatus} to ${new_status}`
      })

    if (historyError) {
      console.error('Failed to create status history:', historyError)
      // Don't fail the request if history creation fails
    }

    // Send real-time notification (Supabase automatically broadcasts changes)
    // The update above will automatically trigger real-time updates to subscribed clients

    // Prepare response message
    const statusMessages = {
      confirmed: 'Order confirmed and being prepared',
      preparing: 'Order is being prepared',
      cooking: 'Order is being cooked',
      ready: 'Order is ready for pickup/delivery',
      delivered: 'Order has been delivered',
      cancelled: 'Order has been cancelled'
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: statusMessages[new_status as keyof typeof statusMessages] || 'Order status updated',
        order: updatedOrder,
        status_change: {
          from: oldStatus,
          to: new_status,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Order status update error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
