
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 py-20">
      {/* Single Focus Question - Steve Jobs Philosophy */}
      <div className="hero-question">
        <div className="space-y-4 mb-8">
          <h1 className="text-hero">
            What would you like to eat today?
          </h1>
          <p className="text-subheading text-muted-foreground">
            Made with love by Sonna ❤️
          </p>
        </div>
        
        {/* Primary Action - Birthday Cakes (Business Priority) */}
        <Button 
          className="cta-primary w-full mb-6"
          onClick={() => navigate('/cakes')}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Order Birthday Cake
        </Button>
        
        {/* Secondary Action - Browse Menu */}
        <Button 
          variant="outline"
          className="w-full action-secondary"
          onClick={() => navigate('/menu')}
        >
          <UtensilsCrossed className="w-5 h-5 mr-2" />
          Browse Full Menu
        </Button>
        
        {/* Trust Indicators - Minimal but Powerful */}
        <div className="flex items-center justify-center gap-6 text-caption text-muted-foreground mt-8">
          <span className="flex items-center gap-1">
            🌱 <span>100% Vegetarian</span>
          </span>
          <span className="flex items-center gap-1">
            ⏱️ <span>Fresh Made</span>
          </span>
          <span className="flex items-center gap-1">
            📱 <span>Easy Ordering</span>
          </span>
        </div>
      </div>
    </section>
  );
};
