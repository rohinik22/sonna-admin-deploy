
import { menuData } from "@/data/menuData";
import { Button } from "@/components/ui/button";

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid = ({ onSelectCategory }: CategoryGridProps) => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold text-foreground mb-6 text-center">
        Choose Your Craving
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {menuData.map((category) => (
          <Button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            variant="outline"
            className="h-24 flex-col gap-2 text-base font-medium hover:shadow-card transition-all duration-300"
          >
            <span className="text-3xl">{category.emoji}</span>
            <span>{category.name}</span>
            <span className="text-xs text-muted-foreground">
              {category.items.length} items
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
};
