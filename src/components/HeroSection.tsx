import { Button } from "@/components/ui/button";
import { Clock, MapPin, Truck } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-48 bg-gradient-hero">
        <img 
          src={heroFood} 
          alt="Delicious vegetarian food from Somas" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Story Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-lg font-bold mb-1">Sonna Aunty's Kitchen</h2>
          <p className="text-sm opacity-90 leading-tight">
            Lovingly made 100% vegetarian food & heartfelt cakes since decades ❤️
          </p>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-card px-4 py-3 shadow-card">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">25-30 min</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Free delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">2.1 km away</span>
          </div>
        </div>
      </div>
      
      {/* CTA Buttons */}
      <div className="p-4 space-y-3">
        <Button className="w-full cta-button gradient-primary text-white">
          🎂 Order Birthday Cake
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="touch-target">
            🍝 Quick Meal
          </Button>
          <Button variant="outline" className="touch-target">
            📅 Pre-book Order
          </Button>
        </div>
      </div>
    </section>
  );
};