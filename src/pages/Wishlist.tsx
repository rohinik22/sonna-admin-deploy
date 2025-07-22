
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        onBack={() => navigate(-1)} 
        title="💖 Wishlist"
      />
      
      {/* Empty Wishlist State */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]">
        <div className="empty-state-icon mb-6">
          <Heart className="w-24 h-24 text-muted-foreground" />
        </div>
        
        <h2 className="empty-state-title font-playfair text-2xl mb-4">
          Your wishlist is empty
        </h2>
        
        <p className="empty-state-description font-poppins text-muted-foreground mb-8 max-w-sm">
          Start building your collection of favorites! 
          Save items you love for easy ordering later.
        </p>
        
        <div className="space-y-4 w-full max-w-sm">
          <Button 
            className="w-full cta-primary font-poppins font-semibold"
            onClick={() => navigate('/menu')}
          >
            Discover Food
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            className="w-full font-poppins"
            onClick={() => navigate('/cakes')}
          >
            🎂 Browse Cakes
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Wishlist;
