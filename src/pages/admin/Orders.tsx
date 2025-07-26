import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { menuData } from '@/data/menuData';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin, 
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChefHat,
  Truck,
  Package,
  Edit,
  Calendar,
  Users,
  Plus,
  Minus,
  X
} from 'lucide-react';

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

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1248',
    customer: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      initials: 'PS'
    },
    items: [
      { name: 'Paneer Tikka Pizza', quantity: 1, price: 285.50 },
      { name: 'Mixed Veg Salad', quantity: 1, price: 180.00 },
      { name: 'Garlic Naan', quantity: 2, price: 90.00 }
    ],
    total: 555.50,
    status: 'preparing',
    orderTime: new Date(Date.now() - 10 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000),
    deliveryAddress: '15/A, MG Road, Hubli, Karnataka 580020',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    specialInstructions: 'Extra paneer on pizza'
  },
  {
    id: '2',
    orderNumber: '#1247',
    customer: {
      name: 'Rohit Patel',
      email: 'rohit.patel@email.com',
      phone: '+91 87654 32109',
      initials: 'RP'
    },
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 340.00 },
      { name: 'Masala Chai', quantity: 2, price: 90.00 }
    ],
    total: 430.00,
    status: 'ready',
    orderTime: new Date(Date.now() - 25 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 5 * 60 * 1000),
    deliveryAddress: '22, Vidyanagar, Hubli, Karnataka 580029',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending'
  },
  {
    id: '3',
    orderNumber: '#1246',
    customer: {
      name: 'Anjali Reddy',
      email: 'anjali.reddy@email.com',
      phone: '+91 76543 21098',
      initials: 'AR'
    },
    items: [
      { name: 'Gulab Jamun', quantity: 4, price: 480.00 },
      { name: 'Masala Chai', quantity: 3, price: 135.00 }
    ],
    total: 615.00,
    status: 'delivered',
    orderTime: new Date(Date.now() - 45 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() - 10 * 60 * 1000),
    deliveryAddress: '8, Nehru Nagar, Hubli, Karnataka 580031',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid'
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'preparing':
      return 'bg-yellow-100 text-yellow-700';
    case 'cooking':
      return 'bg-orange-100 text-orange-700';
    case 'ready':
      return 'bg-green-100 text-green-700';
    case 'out_for_delivery':
      return 'bg-purple-100 text-purple-700';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'cooking':
      return 'Cooking';
    case 'ready':
      return 'Ready';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
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
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

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
          <DialogTitle className="flex items-center justify-between">
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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

interface NewOrderFormData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  specialInstructions: string;
}

const NewOrderForm: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (order: NewOrderFormData) => void; 
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewOrderFormData>({
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    items: [],
    deliveryAddress: '',
    paymentMethod: 'cash',
    specialInstructions: ''
  });

  const [activeCategory, setActiveCategory] = useState('cakes');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = (menuItem: any) => {
    const existingItem = formData.items.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          id: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price
        }]
      }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer.name || !formData.customer.phone || formData.items.length === 0) {
      alert('Please fill in all required fields and add at least one item.');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      customer: { name: '', email: '', phone: '' },
      items: [],
      deliveryAddress: '',
      paymentMethod: 'cash',
      specialInstructions: ''
    });
    
    onClose();
  };

  const filteredMenuItems = menuData
    .find(category => category.id === activeCategory)
    ?.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Details</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customer.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, name: e.target.value }
                    }))}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customer.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, phone: e.target.value }
                    }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      customer: { ...prev.customer, email: e.target.value }
                    }))}
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      deliveryAddress: e.target.value
                    }))}
                    placeholder="Enter full delivery address"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, paymentMethod: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg">
                      <SelectItem value="cash" className="bg-background hover:bg-muted">Cash on Delivery</SelectItem>
                      <SelectItem value="upi" className="bg-background hover:bg-muted">UPI</SelectItem>
                      <SelectItem value="card" className="bg-background hover:bg-muted">Credit/Debit Card</SelectItem>
                      <SelectItem value="online" className="bg-background hover:bg-muted">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specialInstructions: e.target.value
                    }))}
                    placeholder="Any special requests or notes"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Menu Items Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Items</h3>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {menuData.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className="text-xs"
                  >
                    {category.emoji} {category.name}
                  </Button>
                ))}
              </div>

              {/* Search Items */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* Menu Items */}
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">₹{item.price}</div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddItem(item)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Items */}
          {formData.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Selected Items ({formData.items.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {formData.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">₹{item.price} each</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-6 w-6 p-0 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-sm font-medium ml-4">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t-2 border-primary/20">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-lg font-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={formData.items.length === 0}>
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Orders = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  // Check if we should open the new order form from navigation state
  useEffect(() => {
    if (location.state?.openNewOrderForm) {
      setShowNewOrderForm(true);
      // Clear the state to prevent reopening on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const handleNewOrder = () => {
    setShowNewOrderForm(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
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

  const handleCreateNewOrder = (orderData: NewOrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `#${1200 + orders.length + 1}`,
      customer: {
        name: orderData.customer.name,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        initials: orderData.customer.name.split(' ').map(n => n[0]).join('').toUpperCase()
      },
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
      status: 'pending',
      orderTime: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
      specialInstructions: orderData.specialInstructions
    };

    setOrders(prev => [newOrder, ...prev]);
    alert(`Order ${newOrder.orderNumber} created successfully!`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => ['confirmed', 'preparing', 'cooking'].includes(o.status)).length,
      ready: orders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).length,
      completed: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const counts = getOrderCounts();

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage and track all customer orders</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={handleNewOrder}>
            <span className="sm:hidden">+ New</span>
            <span className="hidden sm:inline">+ New Order</span>
          </Button>
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
                  <Button onClick={() => setShowNewOrderForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Order
                  </Button>
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
      
      {/* New Order Form Modal */}
      <NewOrderForm 
        isOpen={showNewOrderForm}
        onClose={() => setShowNewOrderForm(false)}
        onSubmit={handleCreateNewOrder}
      />
    </DashboardLayout>
  );
};

export default Orders;
