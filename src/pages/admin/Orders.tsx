import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Eye, Clock, DollarSign, MapPin, Phone, CheckCircle, ChefHat, Truck, Package, Edit, Calendar, Users } from 'lucide-react';
import { ordersAPI } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    initials: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderTime: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  deliveryAddress?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  specialInstructions?: string;
}


const getStatusColor = (status: Order['status']) => {
  const map: Record<Order['status'], string> = {
    pending: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    cooking: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
    out_for_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return map[status] || map['pending'];
};

const getStatusText = (status: Order['status']) => {
  const map: Record<Order['status'], string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    cooking: 'Cooking',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return map[status] || status;
};

const OrderCard: React.FC<{ 
  order: Order;
  onCallCustomer: (phone: string, customerName: string) => void;
  onViewDetails: (orderId: string, orderNumber: string) => void;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
  onAccept: (orderId: string) => void;
  onStartPreparing: (orderId: string) => void;
  onMarkReady: (orderId: string) => void;
  onStartDelivery: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}> = ({ 
  order, 
  onCallCustomer, 
  onViewDetails, 
  onStatusUpdate,
  onAccept,
  onStartPreparing,
  onMarkReady,
  onStartDelivery,
  onComplete,
  onCancel,
  onDelete
}) => {
  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const getTimeAgo = (date: Date) => { const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60)); return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`; };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
              <AvatarFallback className="text-xs sm:text-sm">{order.customer.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-mono">{order.orderNumber}</CardTitle>
              <CardDescription className="text-sm truncate">{order.customer.name}</CardDescription>
            </div>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1 whitespace-nowrap`}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Order Details - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm">{getTimeAgo(order.orderTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">₹{order.total.toFixed(2)}</span>
          </div>
          {order.deliveryAddress && (
            <div className="flex items-start space-x-2 col-span-1 sm:col-span-2">
              <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{order.deliveryAddress}</span>
            </div>
          )}
        </div>

        {/* Items - Simplified for mobile */}
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-medium">Items ({order.items.length}):</h4>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                <span className="flex-shrink-0">₹{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Special Instructions - Collapsed for mobile */}
        {order.specialInstructions && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-700 line-clamp-2">
              <strong>Note:</strong> {order.specialInstructions}
            </p>
          </div>
        )}

        {/* Actions - Mobile optimized */}
        <div className="space-y-2 pt-2 border-t">
          {/* Status-specific Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Payment:</span>
              <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-xs">
                {order.paymentStatus}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Action buttons based on status */}
              {order.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    className="text-xs px-3 bg-green-600 hover:bg-green-700"
                    onClick={() => onAccept(order.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs px-3"
                    onClick={() => onCancel(order.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              
              {order.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  className="text-xs px-3 bg-orange-600 hover:bg-orange-700"
                  onClick={() => onStartPreparing(order.id)}
                >
                  Start Prep
                </Button>
              )}
              
              {(order.status === 'preparing' || order.status === 'cooking') && (
                <Button 
                  size="sm" 
                  className="text-xs px-3 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onMarkReady(order.id)}
                >
                  Mark Ready
                </Button>
              )}
              
              {order.status === 'ready' && (
                <Button 
                  size="sm" 
                  className="text-xs px-3 bg-purple-600 hover:bg-purple-700"
                  onClick={() => onStartDelivery(order.id)}
                >
                  Start Delivery
                </Button>
              )}
              
              {order.status === 'out_for_delivery' && (
                <Button 
                  size="sm" 
                  className="text-xs px-3 bg-green-600 hover:bg-green-700"
                  onClick={() => onComplete(order.id)}
                >
                  Complete Order
                </Button>
              )}
            </div>
          </div>
          
          {/* Contact and View Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-3"
                onClick={() => onCallCustomer(order.customer.phone, order.customer.name)}
              >
                Call
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-3"
                onClick={() => onViewDetails(order.id, order.orderNumber)}
              >
                Details
              </Button>
            </div>
            
            {/* Delete button for completed/cancelled orders */}
            {(order.status === 'delivered' || order.status === 'cancelled') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-3 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => onDelete(order.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Estimated Delivery - Mobile friendly */}
        {order.estimatedDelivery && (
          <div className="text-xs sm:text-sm text-muted-foreground border-t pt-2">
            <span className="hidden sm:inline">Estimated delivery: </span>
            <span className="sm:hidden">ETA: </span>
            {formatTime(order.estimatedDelivery)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderDetailsModal: React.FC<{ order: Order | null; onClose: () => void }> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span>Order Details - {order.orderNumber}</span>
            <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
              {getStatusText(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                    <AvatarFallback>{order.customer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
                {order.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{order.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Order Time</div>
                    <div className="font-medium">{order.orderTime.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Method</div>
                    <div className="font-medium">{order.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Status</div>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Delivery</div>
                    <div className="font-medium">{order.estimatedDelivery.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Items ({order.items.length})</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">₹{item.price} each</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Special Instructions</h3>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{order.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => alert(`Calling ${order.customer.name} at ${order.customer.phone}`)}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Customer
            </Button>
            <Button 
              variant="outline"
              onClick={() => alert('Opening edit mode...')}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Order
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const Orders = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { (async () => {
    try {
      setError(null);
      const response = await ordersAPI.getAll();
      setOrders(response.orders || []);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  })(); }, []);

  const handleCallCustomer = (phone: string, customerName: string) => {
    // In a real app, this could integrate with a calling service
    alert(`Calling ${customerName} at ${phone}`);
  };

  const handleViewOrderDetails = (orderId: string, orderNumber: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    alert(`Order status updated to ${newStatus}`);
  };

  const handleAcceptOrder = (orderId: string) => {
    handleStatusUpdate(orderId, 'confirmed');
  };

  const handleStartPreparing = (orderId: string) => {
    handleStatusUpdate(orderId, 'preparing');
  };

  const handleMarkReady = (orderId: string) => {
    handleStatusUpdate(orderId, 'ready');
  };

  const handleStartDelivery = (orderId: string) => {
    handleStatusUpdate(orderId, 'out_for_delivery');
  };

  const handleCompleteOrder = (orderId: string) => {
    handleStatusUpdate(orderId, 'delivered');
  };

  const handleCancelOrder = (orderId: string) => {
    const reason = prompt('Reason for cancellation:');
    if (reason) {
      handleStatusUpdate(orderId, 'cancelled');
      alert(`Order cancelled. Reason: ${reason}`);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      alert('Order deleted successfully');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => ['confirmed', 'preparing', 'cooking'].includes(o.status)).length,
    ready: orders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage and track all customer orders</p>
          </div>
        </div>

        {/* Filters - Mobile optimized */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg">
              <SelectItem value="all" className="bg-background hover:bg-muted">All</SelectItem>
              <SelectItem value="pending" className="bg-background hover:bg-muted">Pending</SelectItem>
              <SelectItem value="confirmed" className="bg-background hover:bg-muted">Confirmed</SelectItem>
              <SelectItem value="preparing" className="bg-background hover:bg-muted">Preparing</SelectItem>
              <SelectItem value="cooking" className="bg-background hover:bg-muted">Cooking</SelectItem>
              <SelectItem value="ready" className="bg-background hover:bg-muted">Ready</SelectItem>
              <SelectItem value="out_for_delivery" className="bg-background hover:bg-muted">Delivery</SelectItem>
              <SelectItem value="delivered" className="bg-background hover:bg-muted">Delivered</SelectItem>
              <SelectItem value="cancelled" className="bg-background hover:bg-muted">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Status Tabs - Clean & Professional Design */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
            <div className="text-sm text-gray-600">
              Total Orders: <span className="font-semibold">{counts.all}</span>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 min-w-full sm:min-w-0">
                <TabsTrigger 
                  value="all" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2 min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">All Orders</span>
                    <span className="sm:hidden">All</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0 text-xs px-2 py-0.5">
                      {counts.all}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="pending" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2 min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Pending</span>
                    <span className="sm:hidden">Pending</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-0 text-xs px-2 py-0.5">
                      {counts.pending}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="preparing" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2 min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    <span className="hidden sm:inline">Preparing</span>
                    <span className="sm:hidden">Prep</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs px-2 py-0.5">
                      {counts.preparing}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="ready" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2 min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Ready</span>
                    <span className="sm:hidden">Ready</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-0 text-xs px-2 py-0.5">
                      {counts.ready}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="completed" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2 min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span className="hidden sm:inline">Completed</span>
                    <span className="sm:hidden">Done</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-0 text-xs px-2 py-0.5">
                      {counts.completed}
                    </Badge>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onCallCustomer={handleCallCustomer}
                    onViewDetails={handleViewOrderDetails}
                    onStatusUpdate={handleStatusUpdate}
                    onAccept={handleAcceptOrder}
                    onStartPreparing={handleStartPreparing}
                    onMarkReady={handleMarkReady}
                    onStartDelivery={handleStartDelivery}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500 mb-4">There are no orders matching your current filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredOrders.filter(o => o.status === 'pending').length > 0 ? (
                filteredOrders.filter(o => o.status === 'pending').map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onCallCustomer={handleCallCustomer}
                    onViewDetails={handleViewOrderDetails}
                    onStatusUpdate={handleStatusUpdate}
                    onAccept={handleAcceptOrder}
                    onStartPreparing={handleStartPreparing}
                    onMarkReady={handleMarkReady}
                    onStartDelivery={handleStartDelivery}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-orange-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending orders</h3>
                  <p className="text-gray-500">All orders have been processed or there are no new orders.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preparing" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredOrders.filter(o => ['confirmed', 'preparing', 'cooking'].includes(o.status)).length > 0 ? (
                filteredOrders.filter(o => ['confirmed', 'preparing', 'cooking'].includes(o.status)).map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onCallCustomer={handleCallCustomer}
                    onViewDetails={handleViewOrderDetails}
                    onStatusUpdate={handleStatusUpdate}
                    onAccept={handleAcceptOrder}
                    onStartPreparing={handleStartPreparing}
                    onMarkReady={handleMarkReady}
                    onStartDelivery={handleStartDelivery}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <ChefHat className="h-12 w-12 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders being prepared</h3>
                  <p className="text-gray-500">The kitchen is currently free. Perfect time for a break!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredOrders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).length > 0 ? (
                filteredOrders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onCallCustomer={handleCallCustomer}
                    onViewDetails={handleViewOrderDetails}
                    onStatusUpdate={handleStatusUpdate}
                    onAccept={handleAcceptOrder}
                    onStartPreparing={handleStartPreparing}
                    onMarkReady={handleMarkReady}
                    onStartDelivery={handleStartDelivery}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders ready</h3>
                  <p className="text-gray-500">No orders are currently ready for pickup or delivery.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredOrders.filter(o => o.status === 'delivered').length > 0 ? (
                filteredOrders.filter(o => o.status === 'delivered').map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onCallCustomer={handleCallCustomer}
                    onViewDetails={handleViewOrderDetails}
                    onStatusUpdate={handleStatusUpdate}
                    onAccept={handleAcceptOrder}
                    onStartPreparing={handleStartPreparing}
                    onMarkReady={handleMarkReady}
                    onStartDelivery={handleStartDelivery}
                    onComplete={handleCompleteOrder}
                    onCancel={handleCancelOrder}
                    onDelete={handleDeleteOrder}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Truck className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders</h3>
                  <p className="text-gray-500">No orders have been completed yet today.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </DashboardLayout>
  );
};

export default Orders;
