
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/data/menuData";

interface NutritionalInfoProps {
  item: MenuItem;
  compact?: boolean;
}

const allergenIcons = {
  nuts: "🥜",
  mushrooms: "🍄", 
  garlic: "🧄",
  onions: "🧅",
  dairy: "🥛",
  gluten: "🌾"
};

const spiceIcons = {
  0: "",
  1: "🌶️",
  2: "🌶️🌶️"
};

export const NutritionalInfo = ({ item, compact = false }: NutritionalInfoProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-foreground">{item.calories} cal</span>
        {item.spiceLevel > 0 && (
          <span className="text-destructive">{spiceIcons[item.spiceLevel]}</span>
        )}
        {item.allergens.slice(0, 2).map(allergen => (
          <span key={allergen} className="opacity-70">
            {allergenIcons[allergen]}
          </span>
        ))}
        {item.allergens.length > 2 && (
          <span className="text-muted-foreground">+{item.allergens.length - 2}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{item.calories} calories</span>
        <span className="text-sm text-muted-foreground">⏱️ {item.prepTime}</span>
      </div>
      
      {item.spiceLevel > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Spice Level:</span>
          <span className="text-destructive">{spiceIcons[item.spiceLevel]}</span>
        </div>
      )}
      
      {item.allergens.length > 0 && (
        <div className="space-y-1">
          <span className="text-sm font-medium">Contains:</span>
          <div className="flex flex-wrap gap-1">
            {item.allergens.map(allergen => (
              <Badge key={allergen} variant="outline" className="text-xs">
                {allergenIcons[allergen]} {allergen}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <span className="text-sm font-medium">Ingredients:</span>
        <p className="text-xs text-muted-foreground">
          {item.ingredients.join(', ')}
        </p>
      </div>
    </div>
  );
};
