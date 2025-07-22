
import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
