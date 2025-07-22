import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";

export const FloatingCart = () => {
  const itemCount = 3;
  const totalAmount = 789;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40">
      <Button 
        className="w-full cta-button gradient-primary text-white h-14 shadow-floating"
        onClick={() => {/* Navigate to cart */}}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-accent text-accent-foreground rounded-full p-0 flex items-center justify-center">
                {itemCount}
              </Badge>
            </div>
            <div className="text-left">
              <div className="font-semibold">{itemCount} items</div>
              <div className="text-xs opacity-90">₹{totalAmount}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Button>
    </div>
  );
};