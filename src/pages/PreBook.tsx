
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const PreBook = () => {
  const [showCakeBooking, setShowCakeBooking] = useState(false);
  const [showRegularBooking, setShowRegularBooking] = useState(false);
  const [cakeDate, setCakeDate] = useState<Date>();
  const [regularDate, setRegularDate] = useState<Date>();
  const [cakeTime, setCakeTime] = useState("");
  const [regularTime, setRegularTime] = useState("");

  const handleCakeBooking = () => {
    if (!cakeDate || !cakeTime) {
      toast({ title: "Please select date and time", variant: "destructive" });
      return;
    }
    toast({ title: "Cake booking scheduled!", description: `Your cake will be ready on ${format(cakeDate, "PPP")} at ${cakeTime}` });
    setShowCakeBooking(false);
    setCakeDate(undefined);
    setCakeTime("");
  };

  const handleRegularBooking = () => {
    if (!regularDate || !regularTime) {
      toast({ title: "Please select date and time", variant: "destructive" });
      return;
    }
    toast({ title: "Order scheduled!", description: `Your order is scheduled for ${format(regularDate, "PPP")} at ${regularTime}` });
    setShowRegularBooking(false);
    setRegularDate(undefined);
    setRegularTime("");
  };

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
            <Button className="w-full" size="lg" onClick={() => setShowCakeBooking(true)}>
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
            <Button variant="outline" className="w-full" size="lg" onClick={() => setShowRegularBooking(true)}>
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

      {/* Birthday Cake Booking Dialog */}
      <Dialog open={showCakeBooking} onOpenChange={setShowCakeBooking}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Birthday Cake</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Date (minimum 24h advance)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !cakeDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {cakeDate ? format(cakeDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={cakeDate}
                    onSelect={setCakeDate}
                    disabled={(date) => date < new Date(Date.now() + 24 * 60 * 60 * 1000)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="cake-time">Preferred Time</Label>
              <Input
                id="cake-time"
                type="time"
                value={cakeTime}
                onChange={(e) => setCakeTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="cake-instructions">Special Instructions</Label>
              <Textarea
                id="cake-instructions"
                placeholder="Any special decorations or messages..."
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCakeBooking(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCakeBooking} className="flex-1">
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Regular Order Booking Dialog */}
      <Dialog open={showRegularBooking} onOpenChange={setShowRegularBooking}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Regular Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !regularDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {regularDate ? format(regularDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={regularDate}
                    onSelect={setRegularDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="regular-time">Preferred Time</Label>
              <Input
                id="regular-time"
                type="time"
                value={regularTime}
                onChange={(e) => setRegularTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRegularBooking(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRegularBooking} className="flex-1">
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreBook;
