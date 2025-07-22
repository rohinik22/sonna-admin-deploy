
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

export const FloatingCart = () => {
  const { state } = useCart();
  const navigate = useNavigate();

  if (state.itemCount === 0) return null;

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="floating-action animate-fade-in">
      <Button 
        className="w-full h-auto p-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={handleCartClick}
      >
        <div className="flex items-center justify-between w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <Badge className="absolute -top-2 -right-2 w-6 h-6 text-xs bg-warning text-warning-foreground rounded-full p-0 flex items-center justify-center font-bold animate-pulse">
                {state.itemCount}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-heading font-semibold font-poppins">
                {state.itemCount} item{state.itemCount !== 1 ? 's' : ''}
              </div>
              <div className="text-caption opacity-90 font-poppins">
                ₹{state.grandTotal.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-subheading font-semibold font-poppins">View Cart</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Button>
    </div>
  );
};
