
import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Star } from "lucide-react";

const PreBook = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Pre-book" />
      
      <div className="p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Pre-book Your Order</h1>
          <p className="text-muted-foreground">
            Schedule your order in advance and skip the wait
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Special Birthday Cakes
            </CardTitle>
            <CardDescription>
              Order your custom birthday cake 24 hours in advance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Birthday Cake
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Regular Menu Items
            </CardTitle>
            <CardDescription>
              Pre-order for pickup or delivery at your preferred time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Regular Order
            </Button>
          </CardContent>
        </Card>

        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Why Pre-book?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Skip the queue and save time</li>
            <li>• Guarantee availability of your favorite items</li>
            <li>• Perfect for special occasions and events</li>
            <li>• Earn extra loyalty points on pre-booked orders</li>
          </ul>
        </div>
      </div>
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default PreBook;
