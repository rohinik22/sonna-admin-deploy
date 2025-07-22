import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "cakes", name: "🎂 Cakes", highlight: true },
  { id: "small-bites", name: "🍿 Small Bites" },
  { id: "pizza", name: "🍕 Pizza" },
  { id: "pasta", name: "🍝 Pasta" },
  { id: "indian", name: "🍛 Indian" },
  { id: "chinese", name: "🥢 Chinese" },
  { id: "drinks", name: "🥤 Drinks" },
  { id: "desserts", name: "🍰 Desserts" }
];

export const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState("cakes");

  return (
    <section className="bg-card sticky top-16 z-40 border-b border-border">
      <div className="overflow-x-auto px-4 py-3">
        <div className="flex gap-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth touch-target",
                activeCategory === category.id
                  ? category.highlight 
                    ? "gradient-warm text-white shadow-button" 
                    : "bg-primary text-primary-foreground shadow-button"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};