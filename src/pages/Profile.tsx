
import React from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Phone, MapPin, Gift, Settings } from "lucide-react";

const Profile = () => {
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
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium text-sm">Favorites</p>
              <p className="text-xs text-muted-foreground">5 saved items</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
          <Button variant="outline" className="w-full justify-start">
            <Phone className="w-4 h-4 mr-3" />
            Contact Support
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-3" />
            Delivery Addresses
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
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
    </div>
  );
};

export default Profile;
