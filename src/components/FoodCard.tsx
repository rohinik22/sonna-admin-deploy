import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star } from "lucide-react";
import { useState } from "react";

interface FoodCardProps {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  isVeg?: boolean;
  isPopular?: boolean;
  addOns?: string[];
}

export const FoodCard = ({
  name,
  description,
  price,
  originalPrice,
  image,
  rating = 4.5,
  isVeg = true,
  isPopular = false,
  addOns = []
}: FoodCardProps) => {
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
    }
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(0, prev - 1));

  return (
    <div className="food-card relative">
      {/* Popular Badge */}
      {isPopular && (
        <Badge className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground">
          ⭐ Popular
        </Badge>
      )}
      
      {/* Food Image */}
      <div className="relative h-32 bg-muted rounded-xl mb-3 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">
            🍽️
          </div>
        )}
        
        {/* Veg Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
            isVeg ? 'border-success bg-white' : 'border-destructive bg-white'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isVeg ? 'bg-success' : 'bg-destructive'
            }`} />
          </div>
        </div>
      </div>
      
      {/* Food Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground line-clamp-1">{name}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
        </div>
        
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">₹{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
            )}
          </div>
          
          {/* Add to Cart */}
          {quantity === 0 ? (
            <Button 
              onClick={handleAddToCart}
              size="sm" 
              className="quick-add bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDecrement}
                size="sm" 
                variant="outline"
                className="w-8 h-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="font-medium min-w-[1.5rem] text-center">{quantity}</span>
              <Button 
                onClick={handleIncrement}
                size="sm"
                className="w-8 h-8 p-0 bg-primary text-primary-foreground"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Add-ons available:</p>
            <div className="flex flex-wrap gap-1">
              {addOns.slice(0, 2).map((addon, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  + {addon}
                </Badge>
              ))}
              {addOns.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{addOns.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};