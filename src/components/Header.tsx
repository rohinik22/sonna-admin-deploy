
import { ShoppingCart, Star, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const Header = ({ showBack, onBack, title }: HeaderProps) => {
  const navigate = useNavigate();
  const { state: cart } = useCart();
  const { wishlistItems } = useWishlist();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoyaltyClick = () => {
    navigate('/profile');
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-2 flex-1">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <button 
            onClick={handleLogoClick} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                {title || "Sonna's Kitchen"}
              </h1>
            </div>
          </button>
        </div>
        
        {/* Loyalty Points */}
        <button 
          onClick={handleLoyaltyClick}
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Star className="w-3 h-3 text-primary fill-current" />
          <span className="text-xs font-medium text-primary">1,250</span>
        </button>
        
        {/* Right side */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={handleWishlistClick}
          >
            <Heart className="w-4 h-4" />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full p-0 flex items-center justify-center min-w-0">
                {wishlistItems.length}
              </Badge>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-primary text-primary-foreground rounded-full p-0 flex items-center justify-center min-w-0">
                {cart.itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
