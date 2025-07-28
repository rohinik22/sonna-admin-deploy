import React, { useState, useEffect } from 'react';
import { menuData } from '@/data/menuData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  User,
  MapPin,
  MessageSquare,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  tableNumber?: string;
  orderTime: Date;
  estimatedPrepTime: number;
  priority: 'normal' | 'urgent' | 'delayed';
  status: 'pending' | 'acknowledged' | 'preparing' | 'cooking' | 'ready';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    customizations: string[];
    allergens: string[];
    specialInstructions?: string;
    station: 'hot' | 'cold' | 'pizza' | 'dessert' | 'grill';
  }>;
  deliveryType: 'dine_in' | 'takeout' | 'delivery';
  specialInstructions?: string;
  startTime?: Date;
  completedItems: string[];
}

// Generate kitchen orders from menuData for full menu sync
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const menuItemsFlat = menuData.flatMap(cat => cat.items);
const sampleCustomers = [
  { name: 'Priya Sharma', table: '12', deliveryType: 'dine_in' },
  { name: 'Rohit Patel', table: undefined, deliveryType: 'takeout' },
  { name: 'Anjali Reddy', table: undefined, deliveryType: 'delivery' },
  { name: 'Suresh Kumar', table: '7', deliveryType: 'dine_in' },
  { name: 'Meena Joshi', table: undefined, deliveryType: 'takeout' },
];

const kitchenStations = ['hot', 'cold', 'pizza', 'dessert', 'grill'] as const;

function getStationForMenuItem(itemName: string, category: string): KitchenOrder['items'][0]['station'] {
  if (category.toLowerCase().includes('pizza')) return 'pizza';
  if (category.toLowerCase().includes('dessert') || category.toLowerCase().includes('cake')) return 'dessert';
  if (category.toLowerCase().includes('soup') || category.toLowerCase().includes('salad') || category.toLowerCase().includes('cold')) return 'cold';
  if (category.toLowerCase().includes('grill')) return 'grill';
  return 'hot';
}

const mockKitchenOrders: KitchenOrder[] = Array.from({ length: 5 }).map((_, idx) => {
  const customer = sampleCustomers[idx % sampleCustomers.length];
  // Pick 2-4 random menu items for each order
  const orderItems = Array.from({ length: getRandomInt(2, 4) }).map(() => {
    const menuItem = menuItemsFlat[getRandomInt(0, menuItemsFlat.length - 1)];
    // Find the category name for this menu item
    const category = menuData.find(cat => cat.items.some(i => i.id === menuItem.id))?.name || '';
    return {
      id: menuItem.id,
      name: menuItem.name,
      quantity: getRandomInt(1, 3),
      customizations: menuItem.customizations ? [menuItem.customizations[getRandomInt(0, menuItem.customizations.length - 1)]] : [],
      allergens: menuItem.allergens.map(a => a.charAt(0).toUpperCase() + a.slice(1)),
      specialInstructions: undefined,
      station: getStationForMenuItem(menuItem.name, category),
    };
  });
  return {
    id: (idx + 1).toString(),
    orderNumber: `#${1248 - idx}`,
    customerName: customer.name,
    tableNumber: customer.table,
    orderTime: new Date(Date.now() - getRandomInt(3, 20) * 60 * 1000),
    estimatedPrepTime: getRandomInt(12, 25),
    priority: ['normal', 'urgent', 'delayed'][getRandomInt(0, 2)] as KitchenOrder['priority'],
    status: ['pending', 'acknowledged', 'preparing', 'cooking', 'ready'][getRandomInt(0, 4)] as KitchenOrder['status'],
    deliveryType: customer.deliveryType as KitchenOrder['deliveryType'],
    startTime: new Date(Date.now() - getRandomInt(1, 10) * 60 * 1000),
    completedItems: [],
    items: orderItems,
    specialInstructions: getRandomInt(0, 2) === 0 ? undefined : 'No nuts, please',
  };
});

const OrderTimer: React.FC<{ order: KitchenOrder }> = ({ order }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (order.startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - order.startTime!.getTime()) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOvertime = elapsedTime > order.estimatedPrepTime * 60;

  if (!order.startTime) {
    return (
      <div className="flex items-center space-x-1 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Est. {order.estimatedPrepTime} min</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center space-x-1 font-medium",
      isOvertime ? "text-red-600" : "text-orange-600"
    )}>
      <Timer className="w-4 h-4" />
      <span>{formatTime(elapsedTime)}</span>
      {isOvertime && (
        <Badge variant="destructive" className="ml-2">
          OVERDUE
        </Badge>
      )}
    </div>
  );
};

const OrderCard: React.FC<{ order: KitchenOrder }> = ({ order }) => {
  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-50';
      case 'delayed':
        return 'border-orange-500 bg-orange-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getStatusColor = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cooking':
        return 'bg-orange-100 text-orange-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: KitchenOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'New Order';
      case 'acknowledged':
        return 'Acknowledged';
      case 'preparing':
        return 'Preparing';
      case 'cooking':
        return 'Cooking';
      case 'ready':
        return 'Ready';
      default:
        return status;
    }
  };

  const getDeliveryIcon = (type: KitchenOrder['deliveryType']) => {
    switch (type) {
      case 'dine_in':
        return '🍽️';
      case 'takeout':
        return '🥡';
      case 'delivery':
        return '🚗';
      default:
        return '📦';
    }
  };

  const handleStatusUpdate = (newStatus: KitchenOrder['status']) => {
    // In a real app, this would update the order status via API
    console.log(`Updating order ${order.orderNumber} to ${newStatus}`);
  };

  const toggleItemComplete = (itemId: string) => {
    // In a real app, this would toggle item completion
    console.log(`Toggling item ${itemId} completion`);
  };

  return (
    <Card className={cn(
      "relative border-l-4 hover:shadow-lg transition-shadow",
      getPriorityColor(order.priority)
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {order.orderNumber}
                <span className="text-sm font-normal">
                  {getDeliveryIcon(order.deliveryType)}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{order.customerName}</span>
                </div>
                {order.tableNumber && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Table {order.tableNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
            <OrderTimer order={order} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {order.items.map((item) => {
            const isCompleted = order.completedItems.includes(item.id);
            return (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-start justify-between p-3 rounded-lg border",
                  isCompleted ? "bg-green-50 border-green-200" : "bg-background"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "font-medium",
                      isCompleted && "line-through text-muted-foreground"
                    )}>
                      {item.quantity}x {item.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.station}
                    </Badge>
                  </div>
                  
                  {item.customizations.length > 0 && (
                    <div className="mt-1 text-sm text-blue-600">
                      <strong>Customizations:</strong> {item.customizations.join(', ')}
                    </div>
                  )}
                  
                  {item.allergens.length > 0 && (
                    <div className="mt-1 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600">
                        <strong>Allergens:</strong> {item.allergens.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {item.specialInstructions && (
                    <div className="mt-1 text-sm text-purple-600">
                      <strong>Note:</strong> {item.specialInstructions}
                    </div>
                  )}
                </div>
                
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleItemComplete(item.id)}
                  className={cn(
                    "ml-3",
                    isCompleted && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-current rounded" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Special Instructions</p>
                <p className="text-sm text-red-600">{order.specialInstructions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {order.status === 'pending' && (
              <Button 
                variant="default"
                onClick={() => handleStatusUpdate('acknowledged')}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Acknowledge</span>
                <span className="sm:hidden">Accept</span>
              </Button>
            )}
            
            {order.status === 'acknowledged' && (
              <Button 
                variant="default"
                onClick={() => handleStatusUpdate('preparing')}
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Start Cooking</span>
                <span className="sm:hidden">Start</span>
              </Button>
            )}
            
            {(order.status === 'preparing' || order.status === 'cooking') && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate(order.status === 'preparing' ? 'acknowledged' : 'preparing')}
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <Pause className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                  <span className="sm:hidden">⏸</span>
                </Button>
                <Button 
                  variant="default"
                  onClick={() => handleStatusUpdate('ready')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark Ready</span>
                  <span className="sm:hidden">Ready</span>
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <MessageSquare className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Note</span>
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 flex-1 sm:flex-none">
              <AlertTriangle className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Issue</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const KitchenDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pendingOrders = mockKitchenOrders.filter(order => 
    ['pending', 'acknowledged'].includes(order.status)
  );
  
  const activeOrders = mockKitchenOrders.filter(order => 
    ['preparing', 'cooking'].includes(order.status)
  );
  
  const readyOrders = mockKitchenOrders.filter(order => 
    order.status === 'ready'
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Kitchen Display</h1>
            <p className="text-sm sm:text-lg text-gray-600">Order Queue & Management</p>
          </div>
          
          <div className="text-center sm:text-right">
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-bold">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-white p-3 lg:p-4 rounded-lg border">
            <div className="text-lg lg:text-2xl font-bold text-blue-600">{pendingOrders.length}</div>
            <div className="text-xs lg:text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white p-3 lg:p-4 rounded-lg border">
            <div className="text-lg lg:text-2xl font-bold text-orange-600">{activeOrders.length}</div>
            <div className="text-xs lg:text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-3 lg:p-4 rounded-lg border">
            <div className="text-lg lg:text-2xl font-bold text-green-600">{readyOrders.length}</div>
            <div className="text-xs lg:text-sm text-gray-600">Ready for Pickup</div>
          </div>
          <div className="bg-white p-3 lg:p-4 rounded-lg border">
            <div className="text-lg lg:text-2xl font-bold text-gray-600">
              {Math.round(mockKitchenOrders.reduce((sum, order) => sum + order.estimatedPrepTime, 0) / mockKitchenOrders.length)}
            </div>
            <div className="text-xs lg:text-sm text-gray-600">Avg Prep Time (min)</div>
          </div>
        </div>
      </div>

      {/* Order Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Pending Orders */}
        <div className="space-y-3 lg:space-y-4">
          <h2 className="text-lg lg:text-xl font-bold text-blue-600 mb-3 lg:mb-4">
            New Orders ({pendingOrders.length})
          </h2>
          {pendingOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {pendingOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending orders
            </div>
          )}
        </div>

        {/* Active Orders */}
        <div className="space-y-3 lg:space-y-4">
          <h2 className="text-lg lg:text-xl font-bold text-orange-600 mb-3 lg:mb-4">
            In Progress ({activeOrders.length})
          </h2>
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {activeOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders in progress
            </div>
          )}
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-600 mb-4">
            Ready ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {readyOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders ready
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;
