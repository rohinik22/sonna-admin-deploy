
import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone } from "lucide-react";

const Orders = () => {
  // Mock order data
  const orders = [
    {
      id: "ORD-001",
      items: ["Chocolate Birthday Cake", "Masala Chai"],
      total: 789,
      status: "preparing",
      estimatedTime: "15 mins",
      orderTime: "2:30 PM"
    },
    {
      id: "ORD-002", 
      items: ["Samosa", "Filter Coffee"],
      total: 120,
      status: "completed",
      estimatedTime: "Delivered",
      orderTime: "Yesterday"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-orange-500";
      case "ready": return "bg-green-500";
      case "completed": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Orders" />
      
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <p className="text-muted-foreground">
            Track your current and past orders
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {order.orderTime} • {order.estimatedTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Items:</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">₹{order.total}</p>
                    {order.status === "preparing" && (
                      <Button size="sm" variant="outline">
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
            <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-4">
              Your order history will appear here
            </p>
            <Button>Start Ordering</Button>
          </div>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Need Help?</p>
                <p className="text-xs text-muted-foreground">
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
