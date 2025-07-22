
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, Info, ChefHat } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { NutritionalInfo } from "@/components/NutritionalInfo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FoodCardProps {
  item: MenuItem;
  showRecommendedBadge?: boolean;
}

export const FoodCard = ({ item, showRecommendedBadge }: FoodCardProps) => {
  const [quantity, setQuantity] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    if (quantity === 0) setQuantity(1);
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(0, prev - 1));

  return (
    <div className="food-card relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {showRecommendedBadge && (
          <Badge className="bg-primary text-primary-foreground">
            <ChefHat className="w-3 h-3 mr-1" />
            Sonna's Pick
          </Badge>
        )}
        {item.isPopular && (
          <Badge className="bg-accent text-accent-foreground">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        )}
        {item.isSignature && (
          <Badge className="bg-success text-success-foreground">
            ✨ Signature
          </Badge>
        )}
      </div>

      {/* Food Image */}
      <div className="relative h-40 bg-muted rounded-xl mb-4 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">
            🍽️
          </div>
        )}
        
        {/* 100% Veg Indicator */}
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 border-2 border-success bg-white rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-success rounded-full" />
          </div>
        </div>
      </div>

      {/* Food Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Nutritional transparency - compact view */}
        <NutritionalInfo item={item} compact />

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-primary">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          
          {/* Add to Cart */}
          {quantity === 0 ? (
            <Button 
              onClick={handleAddToCart}
              className="quick-add bg-primary text-primary-foreground hover:bg-primary/90 px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1">
              <Button 
                onClick={handleDecrement}
                size="sm" 
                variant="ghost"
                className="w-8 h-8 p-0 rounded-full"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="font-bold min-w-[2rem] text-center">{quantity}</span>
              <Button 
                onClick={handleIncrement}
                size="sm"
                className="w-8 h-8 p-0 rounded-full bg-primary text-primary-foreground"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Expandable details */}
        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full text-sm text-muted-foreground">
              <Info className="w-4 h-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <NutritionalInfo item={item} />
            
            {/* Customizations */}
            {item.customizations.length > 0 && (
              <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium mb-2">Customize your order:</p>
                <div className="space-y-1">
                  {item.customizations.map((customization, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span>{customization}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
