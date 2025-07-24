
import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20">
      {!activeCategory ? (
        <>
          <Header 
            showBack 
            onBack={() => navigate('/')} 
            title="🍽️ Menu"
          />
          
          {/* Menu Hero Section */}
          <section className="relative overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl mx-4 mb-6 p-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  🌟 Fresh Made Daily
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  What's calling to you today?
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  From our signature chocolate cakes to fresh pasta - every dish crafted with love and the finest ingredients
                </p>
              </div>
            </div>
          </section>

          {/* Featured Rotating Carousel */}
          <FeaturedCarousel onSelectCategory={setActiveCategory} />

          {/* Seasonal Highlights */}
          <section className="px-4 mb-6">
            <div className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-xl p-4 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🥭</span>
                <h3 className="font-semibold text-foreground">Mango Season Special</h3>
                <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">Limited Time</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Fresh Farm Mango & Mango Litchi cakes now available with seasonal discounts!
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveCategory('cakes')}
                  className="bg-warning/20 text-warning hover:bg-warning/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  View Mango Cakes 🥭
                </button>
              </div>
            </div>
          </section>

          {/* Search within menu */}
          <section className="px-4 mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for your favorite dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-muted focus:border-primary transition-all duration-200 rounded-xl"
              />
            </div>
          </section>

          {/* Categories Section */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Explore Our Menu</h2>
              <span className="text-sm text-muted-foreground">10 categories</span>
            </div>
            <CategoryGrid onSelectCategory={setActiveCategory} />
          </section>
        </>
      ) : (
        <MenuSection 
          categoryId={activeCategory} 
          onBack={() => setActiveCategory(null)}
        />
      )}
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Menu;
