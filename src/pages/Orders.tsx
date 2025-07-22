
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Package, Truck } from "lucide-react";

interface Order {
  id: string;
  items: any[];
  customerInfo: any;
  address: any;
  paymentMethod: string;
  deliveryOption: string;
  timeSlot: string;
  total: number;
  status: string;
  timestamp: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('sonnas-orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-500";
      case "preparing": return "bg-orange-500";
      case "ready": return "bg-green-500";
      case "out-for-delivery": return "bg-purple-500";
      case "delivered": return "bg-gray-500";
      case "completed": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <Clock className="w-4 h-4" />;
      case "preparing": return <Package className="w-4 h-4" />;
      case "ready": return <Package className="w-4 h-4" />;
      case "out-for-delivery": return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEstimatedTime = (order: Order) => {
    if (order.deliveryOption === 'now') {
      const orderTime = new Date(order.timestamp);
      const estimatedTime = new Date(orderTime.getTime() + 45 * 60000);
      return estimatedTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return order.timeSlot;
  };

  const formatOrderTime = (timestamp: string) => {
    const orderDate = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - orderDate.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return orderDate.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return orderDate.toLocaleDateString('en-IN');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Orders" />
      
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold font-playfair">Your Orders</h1>
          <p className="text-muted-foreground font-poppins">
            Track your current and past orders
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-playfair">#{order.id}</CardTitle>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 font-poppins">
                    <Clock className="w-4 h-4" />
                    Ordered: {formatOrderTime(order.timestamp)} • 
                    {order.status === 'delivered' ? 'Delivered' : `ETA: ${getEstimatedTime(order)}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1 font-poppins">Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="font-poppins">{item.name} x {item.quantity}</span>
                          <span className="font-poppins">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium font-poppins">Delivery Address:</p>
                      <p className="font-poppins">{order.address.street}</p>
                      <p className="font-poppins">
                        {order.address.area}, {order.address.city} - {order.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg font-poppins">₹{order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground font-poppins">
                        Paid via {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                      </p>
                    </div>
                    {(order.status === "preparing" || order.status === "confirmed") && (
                      <Button size="sm" variant="outline" className="font-poppins">
                        <Phone className="w-4 h-4 mr-1" />
                        Call Shop
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2 font-playfair">No Orders Yet</h2>
            <p className="text-muted-foreground mb-4 font-poppins">
              Your order history will appear here
            </p>
            <Button onClick={() => navigate('/menu')} className="font-poppins">
              Start Ordering
            </Button>
          </div>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm font-poppins">Need Help?</p>
                <p className="text-xs text-muted-foreground font-poppins">
                  Call us at +91 98765 43210 for order assistance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Orders;
