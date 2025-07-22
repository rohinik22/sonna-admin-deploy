
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        onBack={() => navigate(-1)} 
        title="🛒 Cart"
      />
      
      {/* Empty Cart State */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]">
        <div className="empty-state-icon mb-6">
          <ShoppingCart className="w-24 h-24 text-muted-foreground" />
        </div>
        
        <h2 className="empty-state-title font-playfair text-2xl mb-4">
          Your cart is empty
        </h2>
        
        <p className="empty-state-description font-poppins text-muted-foreground mb-8 max-w-sm">
          Looks like you haven't added any delicious items to your cart yet. 
          Let's find something that makes your taste buds dance!
        </p>
        
        <div className="space-y-4 w-full max-w-sm">
          <Button 
            className="w-full cta-primary font-poppins font-semibold"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline"
            className="w-full font-poppins"
            onClick={() => navigate('/cakes')}
          >
            🎂 Order Birthday Cake
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Cart;
