
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const LandingHero = () => {
  return (
    <section className="relative px-4 py-16">
      {/* Single Focus Question - Steve Jobs Philosophy */}
      <div className="hero-question">
        <div className="space-y-3">
          <h1 className="text-hero">
            What would you like to eat today?
          </h1>
          <p className="text-subheading text-muted-foreground">
            Made with love by Sonna ❤️
          </p>
        </div>
        
        {/* Primary Action - Birthday Cakes (Business Priority) */}
        <Button 
          className="cta-primary w-full"
          onClick={() => {
            // Navigate to cakes - will implement navigation
            console.log('Navigate to birthday cakes');
          }}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Order Birthday Cake
        </Button>
        
        {/* Trust Indicators - Minimal but Powerful */}
        <div className="flex items-center justify-center gap-6 text-caption text-muted-foreground">
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
