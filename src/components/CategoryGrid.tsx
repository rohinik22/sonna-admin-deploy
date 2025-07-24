
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
    <section className="px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 font-playfair">
          What's calling to you today?
        </h2>
        <p className="text-muted-foreground font-poppins">
          Handcrafted with love, served with passion
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {menuData.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative overflow-hidden rounded-xl bg-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Background Image */}
            <div className="relative h-32 overflow-hidden">
              {categoryImages[category.id] ? (
                <img 
                  src={categoryImages[category.id]} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-6xl">{category.emoji}</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{category.emoji}</span>
                  <h3 className="font-bold text-lg font-playfair">{category.name}</h3>
                </div>
                <p className="text-xs opacity-90 font-poppins mb-1">{category.description}</p>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-poppins">
                  {category.items.length} delicious items
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
