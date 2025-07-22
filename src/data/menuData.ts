
// Complete menu data with nutritional transparency - Steve Jobs would approve of this honesty
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  calories: number;
  prepTime: string;
  isPopular?: boolean;
  isSignature?: boolean;
  spiceLevel: 0 | 1 | 2; // 0 = no spice, 1 = mild, 2 = hot
  allergens: ('nuts' | 'mushrooms' | 'garlic' | 'onions' | 'dairy' | 'gluten')[];
  ingredients: string[];
  customizations: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "cakes",
    name: "Cakes",
    emoji: "🎂",
    items: [
      {
        id: "birthday-cake",
        name: "Birthday Cake Special",
        description: "Custom birthday cakes made with love by Sonna",
        price: 899,
        originalPrice: 999,
        calories: 450,
        prepTime: "2-3 hours",
        isSignature: true,
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Fresh cream', 'Vanilla sponge', 'Sugar', 'Butter'],
        customizations: ['Cake Pops +₹50', 'Extra Decoration +₹100', 'Name Writing +₹75']
      },
      {
        id: "anniversary-cake",
        name: "Anniversary Cake",
        description: "Elegant anniversary cakes for your special moments",
        price: 1299,
        calories: 520,
        prepTime: "3-4 hours",
        isSignature: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Chocolate ganache', 'Red velvet base', 'Cream cheese'],
        customizations: ['Heart Decoration +₹150', 'Photo Print +₹200', 'Special Message +₹50']
      }
    ]
  },
  {
    id: "small-bites",
    name: "Small Bites",
    emoji: "🍿",
    items: [
      {
        id: "korean-bun",
        name: "Korean Bun",
        description: "Cheese filled garlic bun",
        price: 160,
        calories: 280,
        prepTime: "8-10 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'garlic', 'gluten'],
        ingredients: ['Mozzarella cheese', 'Garlic butter', 'Soft bun'],
        customizations: ['Extra Cheese +₹30']
      },
      {
        id: "chilli-korean-bun",
        name: "Chilli Korean Bun",
        description: "Spicy cheese filled bun with chili",
        price: 170,
        calories: 295,
        prepTime: "8-10 min",
        spiceLevel: 1,
        allergens: ['dairy', 'garlic', 'gluten'],
        ingredients: ['Mozzarella cheese', 'Green chili', 'Garlic butter'],
        customizations: ['Extra Spice +₹0', 'Extra Cheese +₹30']
      },
      {
        id: "potato-wedges",
        name: "Potato Wedges",
        description: "Crispy golden potato wedges",
        price: 120,
        calories: 320,
        prepTime: "12-15 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh potatoes', 'Olive oil', 'Salt', 'Herbs'],
        customizations: ['Extra Cheese +₹40', 'Spicy Mayo +₹25']
      },
      {
        id: "cauliflower-florets",
        name: "Cauliflower Florets",
        description: "Crispy golden brown florets served with house dip",
        price: 260,
        calories: 240,
        prepTime: "15-18 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['garlic'],
        ingredients: ['Fresh cauliflower', 'Chickpea flour', 'Spices', 'House dip'],
        customizations: ['Extra Dip +₹30']
      }
    ]
  },
  {
    id: "pizza",
    name: "Pizza",
    emoji: "🍕",
    items: [
      {
        id: "margarita",
        name: "Margarita Pizza",
        description: "Classic margarita with fresh basil",
        price: 230,
        calories: 580,
        prepTime: "18-22 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Mozzarella', 'Tomato sauce', 'Fresh basil', 'Thin crust'],
        customizations: ['Extra Cheese +₹50', 'Olives +₹30', 'Jalapenos +₹25']
      },
      {
        id: "mexican-pizza",
        name: "Mexican Pizza",
        description: "Loaded vegetables with Mexican spices",
        price: 270,
        calories: 620,
        prepTime: "20-25 min",
        spiceLevel: 1,
        allergens: ['dairy', 'gluten', 'onions'],
        ingredients: ['Bell peppers', 'Onions', 'Corn', 'Mexican seasoning'],
        customizations: ['Extra Veggies +₹40']
      },
      {
        id: "paneer-tikka-pizza",
        name: "Paneer Tikka Pizza",
        description: "Marinated paneer tikka with aromatic spices",
        price: 290,
        calories: 650,
        prepTime: "22-25 min",
        spiceLevel: 1,
        allergens: ['dairy', 'gluten', 'onions'],
        ingredients: ['Paneer tikka', 'Onions', 'Mint chutney', 'Tikka sauce'],
        customizations: ['Extra Paneer +₹60', 'Mint Chutney +₹20']
      }
    ]
  },
  {
    id: "pasta",
    name: "Pasta",
    emoji: "🍝",
    items: [
      {
        id: "arrabiata",
        name: "Arrabiata Pasta",
        description: "Spicy red sauce pasta with herbs",
        price: 230,
        calories: 480,
        prepTime: "15-18 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['gluten', 'garlic'],
        ingredients: ['Penne pasta', 'Tomato sauce', 'Red chili', 'Garlic', 'Herbs'],
        customizations: ['Extra Spice +₹0', 'Parmesan +₹40']
      },
      {
        id: "alfredo",
        name: "Alfredo Pasta",
        description: "Creamy white sauce pasta",
        price: 230,
        calories: 520,
        prepTime: "15-18 min",
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Penne pasta', 'Cream sauce', 'Butter', 'Parmesan'],
        customizations: ['Extra Cream +₹30', 'Garlic Bread +₹50']
      },
      {
        id: "pesto",
        name: "Pesto Pasta",
        description: "Fresh basil pesto with garlic",
        price: 280,
        calories: 460,
        prepTime: "18-20 min",
        spiceLevel: 0,
        allergens: ['nuts', 'dairy', 'gluten', 'garlic'],
        ingredients: ['Fresh basil', 'Pine nuts', 'Parmesan', 'Garlic', 'Olive oil'],
        customizations: ['Parmesan Cheese +₹40', 'Garlic Bread +₹50']
      }
    ]
  }
];

// Sonna's recommendations - personal touch
export const sonnaRecommends = [
  "birthday-cake",
  "korean-bun", 
  "margarita",
  "arrabiata"
];
