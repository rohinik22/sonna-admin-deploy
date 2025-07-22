
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  // Steve Jobs: "Focus is about saying no to the hundred other good ideas"
  // Single question interface: What do you want to eat today?
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Landing state - maximum cognitive simplicity */}
      <LandingHero />
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Index;
