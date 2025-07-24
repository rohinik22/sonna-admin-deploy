
import { ShoppingCart, Star, Heart, ArrowLeft, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import sonnaLogo from "@/assets/sonna-logo.jpg";

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Left side */}
        <div className="flex items-center gap-3 flex-1">
          {showBack ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : null}
          
          <button 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 transition-all duration-300 hover:scale-105 group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img 
                src={sonnaLogo} 
                alt="Sonna's Kitchen Logo" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary font-playfair group-hover:text-primary-emphasis transition-colors duration-300">
                {title || "Sonna's"}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1 font-dancing flex items-center gap-1">
                <ChefHat className="w-3 h-3" />
                Made with Love ❤️
              </p>
            </div>
          </button>
        </div>
        
        {/* Loyalty Points */}
        <button 
          onClick={handleLoyaltyClick}
          className="flex items-center gap-2 mx-4 px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-105"
        >
          <Star className="w-3 h-3 text-primary fill-current" />
          <span className="text-xs font-medium text-primary font-poppins">1,250 pts</span>
        </button>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative touch-target transition-transform duration-200 hover:scale-105"
            onClick={handleWishlistClick}
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white rounded-full p-0 flex items-center justify-center">
                {wishlistItems.length}
              </Badge>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative touch-target transition-transform duration-200 hover:scale-105"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full p-0 flex items-center justify-center">
                {cart.itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
