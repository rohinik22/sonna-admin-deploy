
import { ShoppingCart, Star, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const Header = ({ showBack, onBack, title }: HeaderProps) => {
  const navigate = useNavigate();

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
            className="flex items-start gap-2 transition-transform duration-200 hover:scale-105"
          >
            <div>
              <h1 className="text-xl font-bold text-primary font-playfair">
                {title || "Sonna's"}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1 font-dancing">
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
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative touch-target transition-transform duration-200 hover:scale-105"
            onClick={handleCartClick}
          >
            <ShoppingCart className="w-5 h-5" />
            {/* Cart badge removed until cart functionality is implemented */}
          </Button>
        </div>
      </div>
    </header>
  );
};
