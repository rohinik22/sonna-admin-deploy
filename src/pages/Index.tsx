
import { Header } from "@/components/Header";
import { LandingHero } from "@/components/LandingHero";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { SwipeNavigation } from "@/components/mobile/SwipeNavigation";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { FloatingActionButton } from "@/components/mobile/FloatingActionButton";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleRefresh = async () => {
    // Simulate refresh - reload page data
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <SwipeNavigation>
      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen bg-background pb-20 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="relative z-10">
          <Header />
          <LandingHero />
          <FloatingCart />

          <div className="fixed bottom-36 right-4 z-20">
            <FloatingActionButton onClick={() => navigate('/cart')}>
              <Plus className="w-6 h-6" />
            </FloatingActionButton>
          </div>
          
          <BottomNav />
        </div>
      </PullToRefresh>
    </SwipeNavigation>
  );
};

export default Index;
