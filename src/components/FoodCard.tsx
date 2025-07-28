import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Star, Info, ChefHat, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { NutritionalInfo } from "@/components/NutritionalInfo";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { LazyImage } from "@/components/mobile/LazyImage";
import { HapticButton } from "@/components/mobile/HapticButton";
import { ParticleEffect } from "@/components/mobile/ParticleEffect";
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
  const [showDetails, setShowDetails] = useState(false);
  const [showCustomizations, setShowCustomizations] = useState(false);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [showParticles, setShowParticles] = useState(false);

  const { state: cart, addItem, updateQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const cartItem = cart.items.find(
    (cartItem) =>
      cartItem.id === item.id &&
      JSON.stringify(cartItem.customizations) === JSON.stringify(selectedCustomizations)
  );
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(item, selectedCustomizations);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  };

  const handleIncrement = () => {
    if (quantity === 0) {
      addItem(item, selectedCustomizations);
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const handleCustomizationToggle = (customization: string) => {
    setSelectedCustomizations((prev) => {
      if (prev.includes(customization)) {
        return prev.filter((c) => c !== customization);
      } else {
        return [...prev, customization];
      }
    });
  };

  return (
    <div className="food-card relative overflow-hidden mb-0 glass-card rounded-xl hover:shadow-xl transition-all duration-500 group">
      {/* Particle effect */}
      <ParticleEffect trigger={showParticles} className="z-20" />

      {/* Wishlist Button */}
      <HapticButton
      variant="ghost"
      size="icon"
      className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 hover:bg-white"
      onClick={handleWishlistToggle}
      hapticType="selection"
      >
      <Heart
        className={`w-4 h-4 ${
        isInWishlist(item.id)
          ? "fill-red-500 text-red-500"
          : "text-muted-foreground"
        }`}
      />
      </HapticButton>

      {/* IMAGE SECTION */}
      <div className="relative h-48 bg-muted rounded-t-xl overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
      {item.image ? (
        <LazyImage
        src={item.image}
        alt={item.name}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        priority={showRecommendedBadge}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl rounded-t-xl bg-muted">
        🍽️
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 text-white space-y-1">
        <div className="flex gap-2">
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
        <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-success bg-white rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-success rounded-full" />
        </div>
        <h3 className="font-bold text-lg">{item.name}</h3>
        </div>
        <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
      </div>
      </div>

      {/* BELOW IMAGE SECTION */}
      <div className="p-4 space-y-3">
      {/* Nutritional Info */}
      <NutritionalInfo item={item} compact />

      {/* Pricing */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
        {item.halfKgPrice && item.fullKgPrice ? (
          <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-primary font-poppins">
            ₹{item.halfKgPrice}
            </span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full font-poppins">
            ½kg
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-poppins">
            ₹{item.fullKgPrice}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-poppins">
            1kg • Save ₹
            {(item.halfKgPrice * 2) - item.fullKgPrice}
            </span>
          </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-primary font-poppins">
            ₹{item.price}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-poppins">
            ₹{item.originalPrice}
            </span>
          )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.isBestSeller && (
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-poppins">
            🔥 Bestseller
          </span>
          )}
          {item.prepTime && (
          <span className="text-xs text-muted-foreground font-poppins">
            ⏱️ {item.prepTime}
          </span>
          )}
        </div>
        </div>

        {/* Add to Cart */}
        {quantity === 0 ? (
        <HapticButton
          onClick={handleAddToCart}
          className="quick-add bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold font-poppins"
          hapticType="medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add
        </HapticButton>
        ) : (
        <div className="flex items-center gap-4 bg-muted/50 rounded-full p-2">
          <HapticButton
          onClick={handleDecrement}
          size="sm"
          variant="ghost"
          className="w-10 h-10 p-0 rounded-full touch-target"
          hapticType="light"
          >
          <Minus className="w-4 h-4" />
          </HapticButton>
          <span className="font-bold min-w-[3rem] text-center text-lg font-poppins">
          {quantity}
          </span>
          <HapticButton
          onClick={handleIncrement}
          size="sm"
          className="w-10 h-10 p-0 rounded-full bg-primary text-primary-foreground touch-target"
          hapticType="light"
          >
          <Plus className="w-4 h-4" />
          </HapticButton>
        </div>
        )}
      </div>

      {/* Customizations Dropdown */}
      {item.customizations.length > 0 && (
        <div className="border-t pt-3">
        <button
          onClick={() => setShowCustomizations(!showCustomizations)}
          className="flex items-center justify-between w-full text-sm font-medium font-poppins"
        >
          Customize
          {showCustomizations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCustomizations && (
          <div className="space-y-1">
          {item.customizations.map((customization, idx) => (
            <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCustomizations.includes(customization)}
              onChange={() => handleCustomizationToggle(customization)}
              className="rounded"
            />
            <span className="font-poppins">{customization}</span>
            </label>
          ))}
          </div>
        )}
        </div>
      )}

      {/* Expandable details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full text-sm text-muted-foreground font-poppins">
          <Info className="w-4 h-4 mr-2" />
          {showDetails ? "Hide" : "Show"} Details
        </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
        <NutritionalInfo item={item} />
        </CollapsibleContent>
      </Collapsible>
      </div>
    </div>
  );
};
