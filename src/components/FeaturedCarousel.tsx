import { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { menuData } from "@/data/menuData";

const featuredItems = [
  { id: "sonna-chocolate", categoryId: "cakes", highlight: "🏆 Best Seller" },
  { id: "almond-brittle", categoryId: "cakes", highlight: "⭐ Signature" },
  { id: "strawberry-chocolate", categoryId: "cakes", highlight: "💝 Customer Favorite" },
  { id: "fresh-farm-mango", categoryId: "cakes", highlight: "🥭 Seasonal Special" }
];

interface FeaturedCarouselProps {
  onSelectCategory: (categoryId: string) => void;
}

export const FeaturedCarousel = ({ onSelectCategory }: FeaturedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentFeatured = featuredItems[currentIndex];
  const category = menuData.find(cat => cat.id === currentFeatured.categoryId);
  const item = category?.items.find(item => item.id === currentFeatured.id);

  if (!item || !category) return null;

  return (
    <section className="px-4 mb-6">
      <div className="signature-highlight">
        <div className="bg-background rounded-lg p-4 relative overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-warning/5 rounded-lg" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {currentFeatured.highlight}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">
                    ₹{item.halfKgPrice || item.price}
                    {item.halfKgPrice && item.fullKgPrice && (
                      <span className="text-sm text-muted-foreground ml-1">
                        - ₹{item.fullKgPrice}
                      </span>
                    )}
                  </span>
                  {item.isBestSeller && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      🔥 Trending
                    </span>
                  )}
                </div>
              </div>
              <div className="text-3xl animate-[appetite-pulse_2s_ease-in-out_infinite]">
                {category.emoji}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onSelectCategory(category.id)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors touch-comfortable"
              >
                Order Now
              </button>
              
              {/* Carousel indicators */}
              <div className="flex gap-1">
                {featuredItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};