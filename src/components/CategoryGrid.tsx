
import React from "react";
import { menuData } from "@/data/menuData";
import { Button } from "@/components/ui/button";

// Import category images
import cakesImage from "@/assets/cakes-category.jpg";
import smallBitesImage from "@/assets/small-bites-category.jpg";
import pizzaImage from "@/assets/pizza-category.jpg";
import pastaImage from "@/assets/pasta-category.jpg";
import coldDrinksImage from "@/assets/cold-drinks-category.jpg";
import hotDrinksImage from "@/assets/hot-drinks-category.jpg";

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

const categoryImages: Record<string, string> = {
  "cakes": cakesImage,
  "small-bites": smallBitesImage,
  "pizza": pizzaImage,
  "pasta": pastaImage,
  "cold-drinks": coldDrinksImage,
  "hot-drinks": hotDrinksImage,
};

export const CategoryGrid = ({ onSelectCategory }: CategoryGridProps) => {
  return (
    <section className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {menuData.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative overflow-hidden rounded-2xl bg-card cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-target"
          >
            {/* Background Image */}
            <div className="relative h-40 overflow-hidden">
              {categoryImages[category.id] ? (
                <img 
                  src={categoryImages[category.id]} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-7xl">{category.emoji}</span>
                </div>
              )}
              
              {/* Clean Overlay - Only for text readability */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Minimal Content - Just Category Name */}
              <div className="absolute inset-0 flex items-end p-4">
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
