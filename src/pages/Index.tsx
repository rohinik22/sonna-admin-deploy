
import { useState } from "react";
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { SonnaRecommends } from "@/components/SonnaRecommends";
import { CategoryGrid } from "@/components/CategoryGrid";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Steve Jobs: "Focus is about saying no to the hundred other good ideas"
  // Single question interface: What do you want to eat today?
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {!activeCategory ? (
        // Landing state - maximum cognitive simplicity
        <div className="space-y-8">
          <LandingHero />
          <SonnaRecommends onViewCategory={setActiveCategory} />
          <CategoryGrid onSelectCategory={setActiveCategory} />
        </div>
      ) : (
        // Category selected state - progressive disclosure
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

export default Index;
