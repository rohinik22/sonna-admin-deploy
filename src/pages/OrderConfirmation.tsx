
import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

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

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('sonnas-orders') || '[]');
    const foundOrder = orders.find((o: Order) => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBack onBack={() => navigate('/')} title="Order Not Found" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const getEstimatedTime = () => {
    if (order.deliveryOption === 'now') {
      const orderTime = new Date(order.timestamp);
      const estimatedTime = new Date(orderTime.getTime() + 45 * 60000); // Add 45 minutes
      return estimatedTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return order.timeSlot;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showBack onBack={() => navigate('/')} title="Order Confirmed" />
      
      <div className="p-4 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-success font-playfair">
              Order Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground font-poppins">
              Thank you for choosing Sonna's Made with Love
            </p>
          </div>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order #{order.id}</span>
              <span className="text-lg font-bold">₹{order.total.toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">
                  {order.deliveryOption === 'now' ? 'Estimated Delivery' : 'Scheduled Delivery'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getEstimatedTime()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Items Ordered:</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Delivering to:</p>
                <p>{order.address.street}</p>
                <p>{order.address.area}, {order.address.city} - {order.address.pincode}</p>
                {order.address.instructions && (
                  <p className="text-muted-foreground mt-1">
                    Note: {order.address.instructions}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Need Help?</p>
                <p className="text-xs text-muted-foreground">
                  Call us at +91 98765 43210 for any assistance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => navigate('/orders')}
          >
            Track Your Order
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/menu')}
          >
            Order More Items
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
          <p className="font-dancing text-lg text-primary">
            Made with Love ❤️ by Sonna
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            We appreciate your business and can't wait to serve you again!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
