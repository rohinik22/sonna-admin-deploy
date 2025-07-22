
import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
          
          <section className="p-4">
            <div className="text-center py-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What's calling to you today?
              </h2>
              <p className="text-muted-foreground">
                Fresh ingredients, made with love
              </p>
            </div>
            
            {/* Search within menu */}
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search our menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card border-muted focus:border-primary transition-colors"
              />
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
