
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Heart, Phone, MapPin, Gift, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [showRewards, setShowRewards] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" />
      
      <div className="p-4 space-y-6">
        {/* User Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Welcome back!</h2>
                <p className="text-muted-foreground">+91 98765 43210</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">1,250 loyalty points</span>
                  <Badge variant="secondary" className="text-xs">Gold Member</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/wishlist')}>
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-sm">Favorites</p>
              <p className="text-xs text-muted-foreground">5 saved items</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowRewards(true)}>
            <CardContent className="p-4 text-center">
              <Gift className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-sm">Rewards</p>
              <p className="text-xs text-muted-foreground">2 available</p>
            </CardContent>
          </Card>
        </div>

        {/* Loyalty Program */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Loyalty Program
            </CardTitle>
            <CardDescription>
              Earn points with every order and unlock rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to Platinum</span>
                <span>1,250 / 2,000 points</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '62.5%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                750 more points to unlock Platinum benefits
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Settings */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => {
            const newWindow = window.open('tel:+919876543210', '_self');
            if (newWindow) {
              newWindow.opener = null;
            }
          }}>
            <Phone className="w-4 h-4 mr-3" />
            Contact Support
          </Button>
          
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddresses(true)}>
            <MapPin className="w-4 h-4 mr-3" />
            Delivery Addresses
          </Button>
          
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-3" />
            Settings & Privacy
          </Button>
        </div>

        {/* About Sonna's */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Made with Love ❤️</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for being part of the Sonna's family. Every dish is prepared with care and passion.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <FloatingCart />
      <BottomNav />

      {/* Rewards Dialog */}
      <Dialog open={showRewards} onOpenChange={setShowRewards}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Rewards</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Free Dessert</h4>
              <p className="text-sm text-muted-foreground">Valid on orders above ₹500</p>
              <Button size="sm" className="mt-2" onClick={() => { toast({ title: "Reward applied to your cart!" }); setShowRewards(false); }}>
                Use Now
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">20% Off Next Order</h4>
              <p className="text-sm text-muted-foreground">Valid for 7 days</p>
              <Button size="sm" className="mt-2" onClick={() => { toast({ title: "Discount applied!" }); setShowRewards(false); }}>
                Use Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Addresses Dialog */}
      <Dialog open={showAddresses} onOpenChange={setShowAddresses}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Addresses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Home</h4>
              <p className="text-sm text-muted-foreground">123 Main Street, City, State 12345</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
            <Button onClick={() => toast({ title: "Add new address feature coming soon!" })}>
              Add New Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings & Privacy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Notifications settings updated!" })}>
              Notification Preferences
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Privacy settings available in app!" })}>
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Account settings updated!" })}>
              Account Information
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
