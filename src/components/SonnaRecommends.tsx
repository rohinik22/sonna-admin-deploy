
import React, { useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { menuData, sonnaRecommends } from "@/data/menuData";
import { Heart } from "lucide-react";

interface SonnaRecommendsProps {
  onViewCategory: (categoryId: string) => void;
}

export const SonnaRecommends = ({ onViewCategory }: SonnaRecommendsProps) => {
  const recommendedItems = sonnaRecommends.map(itemId => {
    for (const category of menuData) {
      const item = category.items.find(item => item.id === itemId);
      if (item) return { ...item, categoryId: category.id };
    }
    return null;
  }).filter(Boolean);

  return (
    <section className="px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary fill-current" />
        <h2 className="text-xl font-bold text-foreground">Sonna Recommends</h2>
      </div>
      
      <div className="grid gap-4">
        {recommendedItems.map((item) => (
          item && (
            <FoodCard
              key={item.id}
              item={item}
              showRecommendedBadge
            />
          )
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4 italic">
        "These are my personal favorites that I make with extra love" - Sonna ❤️
      </p>
    </section>
  );
};
