
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, UtensilsCrossed, ChefHat, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 py-12">
      {/* Dynamic Hero Background */}
      <div className="absolute inset-0 -top-4 overflow-hidden rounded-b-3xl">
        <img 
          src={heroBackground} 
          alt="Delicious vegetarian dishes from Sonna's Kitchen"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      
      {/* Single Focus Question - Steve Jobs Philosophy */}
      <div className="hero-question animate-fade-in relative z-10">
        <div className="space-y-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Trusted by 1000+ families
            </span>
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold bg-gradient-to-r from-primary via-primary-emphasis to-warning bg-clip-text text-transparent leading-tight">
            What would you like to eat today?
          </h1>
          <p className="text-xl font-dancing text-muted-foreground font-medium">
            Made with love by Sonna ❤️
          </p>
        </div>
        
        {/* Primary Action - Birthday Cakes (Business Priority) */}
        <Button 
          className="cta-primary w-full mb-6 h-14 text-lg font-poppins font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/cakes')}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Order Birthday Cake
        </Button>
        
        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline"
            className="h-12 action-secondary hover:bg-primary/5 transition-all duration-200 hover:scale-105 font-poppins font-medium"
            onClick={() => navigate('/menu')}
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Browse Menu
          </Button>
          
          <Button 
            variant="outline"
            className="h-12 action-secondary hover:bg-primary/5 transition-all duration-200 hover:scale-105 font-poppins font-medium"
            onClick={() => navigate('/prebook')}
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Pre-book Order
          </Button>
        </div>
        
        {/* Trust Indicators - Enhanced with visual appeal */}
        <div className="grid grid-cols-3 gap-3 text-caption text-muted-foreground mt-8 max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-success/10 hover:bg-success/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <span className="text-2xl">🌱</span>
            <span className="font-medium text-xs text-center">100% Vegetarian</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <span className="text-2xl">⏱️</span>
            <span className="font-medium text-xs text-center">Fresh Made</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-warning/10 hover:bg-warning/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <span className="text-2xl">📱</span>
            <span className="font-medium text-xs text-center">Easy Ordering</span>
          </div>
        </div>
      </div>
    </section>
  );
};
