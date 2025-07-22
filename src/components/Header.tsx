
import { ShoppingCart, Star, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const Header = ({ showBack, onBack, title }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Left side */}
        <div className="flex items-center gap-3 flex-1">
          {showBack ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : null}
          
          <div>
            <h1 className="text-xl font-bold gradient-warm bg-clip-text text-transparent">
              {title || "Sonna's"}
            </h1>
            <p className="text-xs text-muted-foreground">Made with Love ❤️</p>
          </div>
        </div>
        
        {/* Loyalty Points */}
        <div className="flex items-center gap-2 mx-4">
          <div className="loyalty-shimmer px-3 py-1 rounded-full">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span className="text-xs font-medium">1,250 pts</span>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative touch-target">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative touch-target">
            <ShoppingCart className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full p-0 flex items-center justify-center"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};
