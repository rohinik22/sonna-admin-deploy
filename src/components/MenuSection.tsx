import { FoodCard } from "./FoodCard";
import birthdayCake from "@/assets/birthday-cake.jpg";

// Sample menu data based on Somas menu
const menuData = {
  cakes: [
    {
      name: "Birthday Cake Special",
      description: "Custom birthday cakes made with love by Sonna Aunty",
      price: 899,
      originalPrice: 999,
      image: birthdayCake,
      isPopular: true,
      addOns: ["Cake Pops", "Extra Decoration", "Name Writing"]
    },
    {
      name: "Anniversary Cake",
      description: "Elegant anniversary cakes for your special moments",
      price: 1299,
      addOns: ["Heart Decoration", "Photo Print", "Special Message"]
    },
    {
      name: "Custom Cupcakes (6 pcs)",
      description: "Assorted flavored cupcakes with beautiful frosting",
      price: 450,
      addOns: ["Extra Frosting", "Chocolate Chips"]
    }
  ],
  "small-bites": [
    {
      name: "Korean Bun",
      description: "Cheese filled garlic bun",
      price: 160,
      isPopular: true
    },
    {
      name: "Chilli Korean Bun",
      description: "Spicy cheese filled bun with chili",
      price: 170
    },
    {
      name: "Potato Wedges",
      description: "Crispy golden potato wedges",
      price: 120,
      addOns: ["Extra Cheese", "Spicy Mayo"]
    },
    {
      name: "Chilli Garlic Wedges",
      description: "Wedges tossed in garlic & chilli",
      price: 150
    },
    {
      name: "Cauliflower Florets",
      description: "Crispy golden brown florets served with an in house dip",
      price: 260,
      isPopular: true
    }
  ],
  pizza: [
    {
      name: "Margarita Pizza",
      description: "Classic margarita with fresh basil",
      price: 230,
      isPopular: true,
      addOns: ["Extra Cheese", "Olives", "Jalapenos"]
    },
    {
      name: "Mexican Pizza",
      description: "Loaded vegetables with Mexican spices",
      price: 270
    },
    {
      name: "Fantasy Pizza",
      description: "Onions, bellpeppers, paneer, coriander, oregano",
      price: 290
    },
    {
      name: "Paneer Tikka Pizza",
      description: "Marinated paneer tikka with aromatic spices",
      price: 290,
      addOns: ["Extra Paneer", "Mint Chutney"]
    }
  ],
  pasta: [
    {
      name: "Arrabiata Pasta",
      description: "Spicy red sauce pasta with herbs",
      price: 230,
      isPopular: true
    },
    {
      name: "Alfredo Pasta",
      description: "Creamy white sauce pasta",
      price: 230
    },
    {
      name: "Pink Sauce Pasta",
      description: "Perfect blend of red and white sauce",
      price: 260
    },
    {
      name: "Pesto Pasta",
      description: "Fresh basil pesto with garlic",
      price: 280,
      addOns: ["Parmesan Cheese", "Garlic Bread"]
    }
  ]
};

interface MenuSectionProps {
  categoryId: string;
}

export const MenuSection = ({ categoryId }: MenuSectionProps) => {
  const items = menuData[categoryId as keyof typeof menuData] || [];

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Coming soon to this section! 🍽️</p>
      </div>
    );
  }

  return (
    <section className="p-4 space-y-4">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <FoodCard
            key={index}
            name={item.name}
            description={item.description}
            price={item.price}
            originalPrice={item.originalPrice}
            image={item.image}
            isPopular={item.isPopular}
            addOns={item.addOns}
          />
        ))}
      </div>
    </section>
  );
};