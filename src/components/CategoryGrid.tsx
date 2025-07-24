
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
import soupsAppetizersImage from "@/assets/soups-appetizers-category.jpg";
import houseSpecialsImage from "@/assets/house-specials-category.jpg";
import sandwichesImage from "@/assets/sandwiches-category.jpg";
import burgersImage from "@/assets/burgers-category.jpg";

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
  "soups-appetizers": soupsAppetizersImage,
  "house-specials": houseSpecialsImage,
  "sandwiches": sandwichesImage,
  "burgers": burgersImage,
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
            className="category-card hover-glow"
          >
            {/* Background Image with enhanced effects */}
            <div className="relative h-40 overflow-hidden">
              <img 
                src={categoryImages[category.id]} 
                alt={category.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Multi-layer overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glassmorphism accent */}
              <div className="absolute top-2 right-2 w-8 h-8 glass-card rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Name with enhanced styling */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-xl text-white font-playfair drop-shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                  {category.name}
                </h3>
                <div className="w-8 h-0.5 bg-gradient-to-r from-white to-transparent mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
