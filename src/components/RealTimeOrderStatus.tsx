import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck,
  ChefHat,
  PlayCircle,
  Package
} from 'lucide-react'
import { orderService, Order } from '@/lib/orderService'
import { useAuth } from '@/lib/auth'

const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'secondary',
    icon: Clock,
    nextStatus: 'confirmed'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'blue',
    icon: CheckCircle,
    nextStatus: 'preparing'
  },
  preparing: { 
    label: 'Preparing', 
    color: 'yellow',
    icon: ChefHat,
    nextStatus: 'cooking'
  },
  cooking: { 
    label: 'Cooking', 
    color: 'orange',
    icon: PlayCircle,
    nextStatus: 'ready'
  },
  ready: { 
    label: 'Ready', 
    color: 'green',
    icon: Package,
    nextStatus: 'delivered'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'green',
    icon: Truck,
    nextStatus: null
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'destructive',
    icon: AlertCircle,
    nextStatus: null
  }
}

interface OrderStatusCardProps {
  order: Order
  onStatusUpdate?: (orderId: string, newStatus: string) => void
  showActions?: boolean
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  order,
  onStatusUpdate,
  showActions = true
}) => {
  const { getUser } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = currentStatus?.icon || Clock

  const handleStatusUpdate = async (newStatus: string) => {
    if (!onStatusUpdate) return

    setIsUpdating(true)
    try {
      await onStatusUpdate(order.id, newStatus)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTimeDifference = (dateString: string) => {
    const orderTime = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      return `${hours}h ${minutes}m ago`
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Order #{order.id.slice(-8).toUpperCase()}
          </CardTitle>
          <Badge 
            variant={currentStatus?.color as any}
            className="flex items-center gap-1"
          >
            <StatusIcon className="w-3 h-3" />
            {currentStatus?.label}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          <div>{order.customer_name} • {order.customer_phone}</div>
          <div>{formatTime(order.created_at)} • {getTimeDifference(order.created_at)}</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Items:</h4>
          {order.order_items?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.menu_items?.name}</span>
              <span>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.subtotal?.toFixed(2)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{order.discount_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{order.tax_amount?.toFixed(2)}</span>
          </div>
          {order.delivery_fee > 0 && (
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>₹{order.delivery_fee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-1">
            <span>Total:</span>
            <span>₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Order Type & Special Instructions */}
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{order.order_type.replace('_', ' ').toUpperCase()}</Badge>
            {order.table_number && (
              <Badge variant="outline">Table {order.table_number}</Badge>
            )}
          </div>
          {order.notes && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
              <strong>Note:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Status Actions */}
        {showActions && currentStatus?.nextStatus && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(currentStatus.nextStatus!)}
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? 'Updating...' : `Mark as ${statusConfig[currentStatus.nextStatus as keyof typeof statusConfig]?.label}`}
            </Button>
            
            {order.status !== 'cancelled' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* Estimated Delivery Time */}
        {order.estimated_delivery_time && order.status !== 'delivered' && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            Estimated {order.order_type === 'delivery' ? 'delivery' : 'ready'}: {formatTime(order.estimated_delivery_time)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Real-time Orders Dashboard Component
export const RealTimeOrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { getUser } = useAuth()

  useEffect(() => {
    loadOrders()
    
    // Subscribe to real-time updates
    const subscription = orderService.subscribeToOrderUpdates((updatedOrder) => {
      setOrders(prev => 
        prev.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadOrders = async () => {
    try {
      const { orders: fetchedOrders } = await orderService.getOrders({
        limit: 50
      })
      setOrders(fetchedOrders)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const user = getUser()
      await orderService.updateOrderStatus(orderId, newStatus, undefined, user?.id)
      // The real-time subscription will handle the UI update
    } catch (error) {
      console.error('Failed to update order status:', error)
      throw error
    }
  }

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status)
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Orders */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">New Orders ({getOrdersByStatus('pending').length})</h3>
          {getOrdersByStatus('pending').map(order => (
            <OrderStatusCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>

        {/* In Progress */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">In Progress ({getOrdersByStatus('preparing').length + getOrdersByStatus('cooking').length})</h3>
          {[...getOrdersByStatus('preparing'), ...getOrdersByStatus('cooking')].map(order => (
            <OrderStatusCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>

        {/* Ready/Completed */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Ready ({getOrdersByStatus('ready').length})</h3>
          {getOrdersByStatus('ready').map(order => (
            <OrderStatusCard
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
