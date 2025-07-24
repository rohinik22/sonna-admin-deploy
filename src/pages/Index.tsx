
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      <div className="relative z-10">
        <Header />
        <LandingHero />
        <FloatingCart />
        <BottomNav />
      </div>
    </div>
  );
};

export default Index;
