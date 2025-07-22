import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { MenuSection } from "@/components/MenuSection";
import { StorySection } from "@/components/StorySection";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("cakes");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Fixed Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Category Navigation */}
      <CategoryNav />
      
      {/* Menu Content */}
      <main className="pb-6">
        <MenuSection categoryId={activeCategory} />
        
        {/* Story Section */}
        <StorySection />
      </main>
      
      {/* Floating Cart */}
      <FloatingCart />
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
