
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { Input } from "@/components/ui/input";
import { FoodCard } from "@/components/FoodCard";
import { menuData } from "@/data/menuData";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Flatten all menu items for search
  const allItems = menuData.flatMap(category => 
    category.items.map(item => ({ ...item, categoryName: category.name }))
  );
  
  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Search" />
      
      <div className="p-4 space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for food, drinks, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        {searchQuery ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} results for "{searchQuery}"
            </p>
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search Sonna's Menu</h2>
            <p className="text-muted-foreground">
              Find your favorite dishes, drinks, and treats
            </p>
          </div>
        )}
      </div>
      
      <FloatingCart />
      <BottomNav />
    </div>
  );
};

export default Search;
