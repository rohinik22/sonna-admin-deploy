
import { FoodCard } from "@/components/FoodCard";
import { menuData } from "@/data/menuData";
import { Header } from "@/components/Header";

interface MenuSectionProps {
  categoryId: string;
  onBack: () => void;
}

export const MenuSection = ({ categoryId, onBack }: MenuSectionProps) => {
  const category = menuData.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <>
      <Header 
        showBack 
        onBack={onBack} 
        title={`${category.emoji} ${category.name}`}
      />
      
      <section className="p-4 space-y-4">
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {category.emoji} {category.name}
          </h2>
          <p className="text-muted-foreground">
            {category.items.length} delicious options made fresh daily
          </p>
        </div>
        
        <div className="space-y-6">
          {category.items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
};
