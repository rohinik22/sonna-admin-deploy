
import { Header } from "@/components/Header";
import { FoodCard } from "@/components/FoodCard";
import { FloatingCart } from "@/components/FloatingCart";
import { BottomNav } from "@/components/BottomNav";
import { menuData } from "@/data/menuData";
import { useNavigate } from "react-router-dom";

const Cakes = () => {
  const navigate = useNavigate();
  
  // Find the cakes category from menuData
  const cakesCategory = menuData.find(category => 
    category.name.toLowerCase().includes('cake') || 
    category.name.toLowerCase().includes('dessert') ||
    category.id === 'cakes'
  );

  // Fallback if no cakes category exists
  if (!cakesCategory) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header 
          showBack 
          onBack={() => navigate('/')} 
          title="🎂 Birthday Cakes"
        />
        
        <div className="p-4 text-center py-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              🎂 Birthday Cakes Coming Soon!
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Sonna is preparing something special for you. Our delicious birthday cakes will be available soon!
            </p>
          </div>
        </div>
        
        <FloatingCart />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        showBack 
        onBack={() => navigate('/')} 
        title={`${cakesCategory.emoji} ${cakesCategory.name}`}
      />
      
      <section className="p-4 space-y-4">
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            🎂 Birthday Cakes
          </h2>
          <p className="text-muted-foreground">
            Perfect for celebrating life's special moments
          </p>
        </div>
        
        <div className="grid gap-6">
          {cakesCategory.items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Cakes;
