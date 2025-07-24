
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
            className="group relative overflow-hidden rounded-xl bg-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Background Image */}
            <div className="relative h-40 overflow-hidden">
              <img 
                src={categoryImages[category.id]} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Category Name Only */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-xl text-white font-playfair drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
