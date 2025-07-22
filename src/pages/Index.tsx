
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2081&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      
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
