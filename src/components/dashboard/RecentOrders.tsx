import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Clock, Phone, MapPin, Calendar, IndianRupee } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    avatar?: string;
    initials: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  itemCount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: string;
  estimatedTime?: string;
  deliveryAddress?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  specialInstructions?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1248',
    customer: {
      name: 'Priya Sharma',
      initials: 'PS',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210'
    },
    items: [
      { name: 'Paneer Tikka Pizza', quantity: 1, price: 285.50 },
      { name: 'Mixed Veg Salad', quantity: 1, price: 90.00 },
      { name: 'Garlic Naan', quantity: 2, price: 25.00 }
    ],
    itemCount: 3,
    total: 425.50,
    status: 'preparing',
    orderTime: '2 min ago',
    estimatedTime: '15 min',
    deliveryAddress: '123 MG Road, Pune, Maharashtra 411001',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    specialInstructions: 'Extra spicy, no onions'
  },
  {
    id: '2',
    orderNumber: '#1247',
    customer: {
      name: 'Rohit Patel',
      initials: 'RP',
      email: 'rohit.patel@email.com',
      phone: '+91 98765 43211'
    },
    items: [
      { name: 'Butter Chicken Pizza', quantity: 1, price: 195.00 },
      { name: 'Masala Chai', quantity: 1, price: 85.00 }
    ],
    itemCount: 2,
    total: 280.00,
    status: 'ready',
    orderTime: '5 min ago',
    deliveryAddress: '456 FC Road, Pune, Maharashtra 411016',
    paymentMethod: 'Card',
    paymentStatus: 'paid'
  },
  {
    id: '3',
    orderNumber: '#1246',
    customer: {
      name: 'Anjali Reddy',
      initials: 'AR',
      email: 'anjali.reddy@email.com',
      phone: '+91 98765 43212'
    },
    items: [
      { name: 'Chicken Biryani', quantity: 1, price: 275.00 },
      { name: 'Paneer Butter Masala', quantity: 1, price: 225.00 },
      { name: 'Butter Naan', quantity: 3, price: 35.00 },
      { name: 'Gulab Jamun', quantity: 1, price: 122.75 }
    ],
    itemCount: 4,
    total: 657.75,
    status: 'delivered',
    orderTime: '12 min ago',
    deliveryAddress: '789 Koregaon Park, Pune, Maharashtra 411001',
    paymentMethod: 'Cash',
    paymentStatus: 'paid'
  },
  {
    id: '4',
    orderNumber: '#1245',
    customer: {
      name: 'Vikram Singh',
      initials: 'VS',
      email: 'vikram.singh@email.com',
      phone: '+91 98765 43213'
    },
    items: [
      { name: 'Veg Thali', quantity: 1, price: 185.50 }
    ],
    itemCount: 1,
    total: 185.50,
    status: 'pending',
    orderTime: '18 min ago',
    deliveryAddress: '321 Baner Road, Pune, Maharashtra 411045',
    paymentMethod: 'UPI',
    paymentStatus: 'pending'
  },
  {
    id: '5',
    orderNumber: '#1244',
    customer: {
      name: 'Neha Gupta',
      initials: 'NG',
      email: 'neha.gupta@email.com',
      phone: '+91 98765 43214'
    },
    items: [
      { name: 'Family Feast Combo', quantity: 1, price: 675.00 },
      { name: 'Mango Lassi', quantity: 2, price: 85.00 },
      { name: 'Ice Cream', quantity: 1, price: 132.25 }
    ],
    itemCount: 5,
    total: 892.25,
    status: 'preparing',
    orderTime: '25 min ago',
    estimatedTime: '8 min',
    deliveryAddress: '654 Hadapsar, Pune, Maharashtra 411028',
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    specialInstructions: 'Birthday celebration - include candles'
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'preparing':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    case 'ready':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'delivered':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    case 'cancelled':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export const RecentOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewOrder = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };

  const OrderDetailsModal = ({ order }: { order: Order }) => (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Order Details - {order.orderNumber}</span>
          <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
            {getStatusText(order.status)}
          </Badge>
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{order.customer.initials}</AvatarFallback>
              </Avatar>
              Customer Details
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {order.customer.name}</div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{order.customer.phone}</span>
              </div>
              <div><strong>Email:</strong> {order.customer.email}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Order Information
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Order Time:</strong> {order.orderTime}</div>
              {order.estimatedTime && (
                <div><strong>Estimated:</strong> {order.estimatedTime}</div>
              )}
              <div className="flex items-center gap-2">
                <IndianRupee className="h-3 w-3" />
                <span><strong>Total:</strong> ₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </h3>
            <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Order Items ({order.itemCount})</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <div className="flex-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span className="text-sm font-medium">₹{(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Total Amount</span>
              <span className="font-semibold text-lg">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm">
              <div><strong>Method:</strong> {order.paymentMethod}</div>
              <div className="flex items-center gap-2">
                <strong>Status:</strong>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'} className="text-xs">
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Special Instructions</h3>
            <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">{order.specialInstructions}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => alert(`Calling ${order.customer.name} at ${order.customer.phone}`)}
            className="flex items-center gap-2"
          >
            <Phone className="h-3 w-3" />
            Call Customer
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2"
          >
            <Eye className="h-3 w-3" />
            View in Orders
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-3">
      {mockOrders.map((order) => (
        <div key={order.id} className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          {/* Mobile Layout */}
          <div className="sm:hidden space-y-3">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                  <AvatarFallback className="text-xs">{order.customer.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{order.orderNumber}</span>
                    <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-0.5`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center text-sm font-medium flex-shrink-0">
                <span className="text-xs mr-1">₹</span>
                {order.total.toFixed(2)}
              </div>
            </div>

            {/* Details Row */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <span>{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {order.orderTime}
                </span>
                {order.estimatedTime && (
                  <span className="text-orange-600 font-medium">
                    Est. {order.estimatedTime}
                  </span>
                )}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                {<OrderDetailsModal order={order} />}
              </Dialog>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                <AvatarFallback>{order.customer.initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{order.orderNumber}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{order.customer.name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {order.orderTime}
                  </span>
                  {order.estimatedTime && (
                    <span className="text-xs text-orange-600 font-medium">
                      Est. {order.estimatedTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-center text-sm font-medium">
                  <span className="text-sm mr-1">₹</span>
                  {order.total.toFixed(2)}
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-shrink-0"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <OrderDetailsModal order={order} />
              </Dialog>
            </div>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm"
          onClick={handleViewAllOrders}
        >
          View All Orders
        </Button>
      </div>
    </div>
  );
};

RecentOrders.displayName = "RecentOrders";
