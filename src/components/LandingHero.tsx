
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, UtensilsCrossed, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 py-20">
      {/* Single Focus Question - Steve Jobs Philosophy */}
      <div className="hero-question animate-fade-in">
        <div className="space-y-4 mb-8 text-center">
          <h1 className="text-hero bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            What would you like to eat today?
          </h1>
          <p className="text-subheading text-muted-foreground">
            Made with love by Sonna ❤️
          </p>
        </div>
        
        {/* Primary Action - Birthday Cakes (Business Priority) */}
        <Button 
          className="cta-primary w-full mb-6 h-14 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/cakes')}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Order Birthday Cake
        </Button>
        
        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline"
            className="h-12 action-secondary hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/menu')}
          >
            <UtensilsCrossed className="w-5 h-5 mr-2" />
            Browse Menu
          </Button>
          
          <Button 
            variant="outline"
            className="h-12 action-secondary hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/prebook')}
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Pre-book Order
          </Button>
        </div>
        
        {/* Trust Indicators - Enhanced with visual appeal */}
        <div className="flex items-center justify-center gap-6 text-caption text-muted-foreground mt-8">
          <span className="flex items-center gap-2 p-2 rounded-lg bg-success/10 hover:bg-success/20 transition-colors">
            🌱 <span>100% Vegetarian</span>
          </span>
          <span className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            ⏱️ <span>Fresh Made</span>
          </span>
          <span className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
            📱 <span>Easy Ordering</span>
          </span>
        </div>
      </div>
    </section>
  );
};
