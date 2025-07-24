
import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { state: cart } = useCart();

  // Dynamic bottom padding to prevent cart obstruction
  const dynamicPaddingClass = cart.itemCount > 0 ? "pb-40" : "pb-20";

  return (
    <div className={`min-h-screen bg-background ${dynamicPaddingClass}`}>
      {!activeCategory ? (
        <>
          <Header 
            showBack 
            onBack={() => navigate('/')} 
            title="🍽️ Menu"
          />
          
          {/* Search Icon in Header */}
          <div className="sticky top-16 z-40 bg-background border-b border-border px-4 py-3">
            <button 
              onClick={() => navigate('/search')}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
              <span>Search for your favorite dish...</span>
            </button>
          </div>

          <CategoryGrid onSelectCategory={setActiveCategory} />
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
