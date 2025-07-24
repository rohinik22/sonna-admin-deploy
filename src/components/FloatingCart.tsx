
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
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-fade-in">
      <Button 
        className="w-full h-auto p-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
        onClick={handleCartClick}
      >
        <div className="flex items-center justify-between w-full px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="w-7 h-7" />
              <Badge className="absolute -top-2 -right-2 w-7 h-7 text-xs bg-warning text-warning-foreground rounded-full p-0 flex items-center justify-center font-bold animate-pulse">
                {state.itemCount}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold font-poppins">
                {state.itemCount} item{state.itemCount !== 1 ? 's' : ''}
              </div>
              <div className="text-sm opacity-90 font-poppins">
                ₹{state.grandTotal.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold font-poppins">View Cart</span>
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </Button>
    </div>
  );
};
