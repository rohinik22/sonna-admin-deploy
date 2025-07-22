
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const LandingHero = () => {
  return (
    <section className="relative px-4 py-12 text-center">
      {/* Single focus question - Steve Jobs would eliminate everything else */}
      <div className="max-w-sm mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            What would you like to eat today?
          </h1>
          <p className="text-muted-foreground">
            Made with love by Sonna ❤️
          </p>
        </div>
        
        {/* Primary action - birthday cakes (business priority) */}
        <Button 
          className="w-full cta-button gradient-primary text-white h-16 text-lg"
          onClick={() => {/* Navigate to cakes */}}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Order Birthday Cake
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>🌱 100% Vegetarian</span>
          <span>⏱️ Fresh Made</span>
          <span>📱 Easy Ordering</span>
        </div>
      </div>
    </section>
  );
};
