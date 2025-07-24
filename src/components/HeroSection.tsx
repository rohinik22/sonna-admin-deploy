import { Button } from "@/components/ui/button";
import { Clock, MapPin, Truck } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image with enhanced effects */}
      <div className="relative h-48 bg-gradient-hero overflow-hidden">
        <img 
          src={heroFood} 
          alt="Delicious vegetarian food from Somas" 
          className="w-full h-full object-cover opacity-90 scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 opacity-60" />
        
        {/* Story Overlay with glassmorphism */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="glass-dark rounded-lg p-3 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-1 font-playfair">Sonna Aunty's Kitchen</h2>
            <p className="text-sm opacity-90 leading-tight font-poppins">
              Lovingly made 100% vegetarian food & heartfelt cakes since decades ❤️
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Stats with enhanced styling */}
      <div className="glass-card px-4 py-3 shadow-lg mx-4 -mt-4 relative z-10 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Clock className="w-3 h-3 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">25-30 min</span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <Truck className="w-3 h-3 text-success" />
            </div>
            <span className="text-muted-foreground font-medium">Free delivery</span>
          </div>
          <div className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <MapPin className="w-3 h-3 text-accent" />
            </div>
            <span className="text-muted-foreground font-medium">2.1 km away</span>
          </div>
        </div>
      </div>
      
      {/* CTA Buttons with enhanced styling */}
      <div className="p-4 space-y-3">
        <Button className="w-full h-12 text-white font-semibold relative overflow-hidden group bg-gradient-to-r from-primary via-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
          <span className="relative z-10 flex items-center justify-center gap-2">
            🎂 Order Birthday Cake
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="touch-target h-11 glass-card hover:scale-105 transition-all duration-300 font-medium">
            🍝 Quick Meal
          </Button>
          <Button variant="outline" className="touch-target h-11 glass-card hover:scale-105 transition-all duration-300 font-medium">
            📅 Pre-book Order
          </Button>
        </div>
      </div>
    </section>
  );
};