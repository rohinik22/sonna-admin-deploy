
// Sonna's Complete Menu - Tempting experiences crafted with love
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  halfKgPrice?: number; // For cakes
  fullKgPrice?: number; // For cakes
  image?: string;
  calories: number;
  prepTime: string;
  isPopular?: boolean;
  isSignature?: boolean;
  isBestSeller?: boolean;
  spiceLevel: 0 | 1 | 2; // 0 = no spice, 1 = mild, 2 = hot
  allergens: ('nuts' | 'mushrooms' | 'garlic' | 'onions' | 'dairy' | 'gluten')[];
  ingredients: string[];
  customizations: string[];
  dietaryInfo?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "cakes",
    name: "Artisan Cakes",
    emoji: "🎂",
    description: "Handcrafted masterpieces that melt hearts and create memories",
    items: [
      {
        id: "sonnas-chocolate-cake",
        name: "Sonna's Signature Chocolate Cake",
        description: "Our crown jewel - rich, decadent chocolate layers that have made us famous. Every bite tells a story of passion and perfection.",
        halfKgPrice: 675,
        fullKgPrice: 1250,
        price: 675,
        calories: 450,
        prepTime: "2-3 hours",
        isSignature: true,
        isBestSeller: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Premium cocoa', 'Fresh cream', 'Belgian chocolate', 'Farm eggs'],
        customizations: ['Custom Message +₹75', 'Extra Chocolate Shavings +₹100', '1kg Size +₹575'],
        dietaryInfo: ['Made fresh daily', 'Premium ingredients']
      },
      {
        id: "dark-chocolate-orange",
        name: "Dark Chocolate & Orange Symphony",
        description: "A sophisticated dance of bitter-sweet dark chocolate with zesty orange notes. For those who appreciate complex flavors.",
        halfKgPrice: 750,
        fullKgPrice: 1350,
        price: 750,
        calories: 420,
        prepTime: "3-4 hours",
        isSignature: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Dark chocolate', 'Fresh orange zest', 'Orange essence', 'Cream cheese'],
        customizations: ['Candied Orange Peel +₹80', '1kg Size +₹600', 'Extra Dark Chocolate +₹120']
      },
      {
        id: "coffee-chocolate",
        name: "Coffee & Chocolate Indulgence",
        description: "Perfect harmony of rich espresso and velvety chocolate. A caffeine lover's dream dessert.",
        halfKgPrice: 750,
        fullKgPrice: 1350,
        price: 750,
        calories: 440,
        prepTime: "3-4 hours",
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Fresh espresso', 'Dark chocolate', 'Coffee beans', 'Mascarpone'],
        customizations: ['Double Espresso Shot +₹50', 'Coffee Bean Garnish +₹60', '1kg Size +₹600']
      },
      {
        id: "almond-brittle",
        name: "Almond Brittle Delight",
        description: "Crunchy caramelized almonds meet soft sponge in this textural masterpiece. A bestseller that keeps customers coming back.",
        halfKgPrice: 750,
        fullKgPrice: 1350,
        price: 750,
        calories: 480,
        prepTime: "3-4 hours",
        isBestSeller: true,
        spiceLevel: 0,
        allergens: ['nuts', 'dairy', 'gluten'],
        ingredients: ['Roasted almonds', 'Caramel brittle', 'Vanilla sponge', 'Butter cream'],
        customizations: ['Extra Almond Brittle +₹100', 'Salted Caramel Drizzle +₹80', '1kg Size +₹600']
      },
      {
        id: "strawberry-chocolate",
        name: "Strawberry & Chocolate Romance",
        description: "Fresh strawberries nestled in rich chocolate - a love story on a plate. Our most romantic creation.",
        halfKgPrice: 750,
        fullKgPrice: 1350,
        price: 750,
        calories: 410,
        prepTime: "3-4 hours",
        isBestSeller: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Fresh strawberries', 'Dark chocolate', 'Strawberry compote', 'Whipped cream'],
        customizations: ['Extra Strawberries +₹100', 'White Chocolate Drizzle +₹70', '1kg Size +₹600']
      },
      {
        id: "fresh-farm-mango",
        name: "Fresh Farm Mango Celebration",
        description: "Tropical paradise in cake form. Made with the finest Alphonso mangoes, this seasonal beauty captures summer in every bite.",
        halfKgPrice: 750,
        fullKgPrice: 1350,
        price: 750,
        calories: 390,
        prepTime: "3-4 hours",
        isBestSeller: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Alphonso mango pulp', 'Fresh mango chunks', 'Mango mousse', 'Vanilla sponge'],
        customizations: ['Extra Mango Chunks +₹90', 'Mango Glaze +₹80', '1kg Size +₹600'],
        dietaryInfo: ['Seasonal availability', 'Farm fresh mangoes']
      },
      {
        id: "rich-mawa-cake",
        name: "Rich Mawa Cake (750g)",
        description: "Traditional Indian richness meets modern technique. Dense, moist, and aromatic with the warmth of cardamom.",
        price: 850,
        calories: 520,
        prepTime: "4-5 hours",
        isSignature: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten', 'nuts'],
        ingredients: ['Fresh mawa', 'Cardamom', 'Cashews', 'Almonds', 'Ghee'],
        customizations: ['Extra Dry Fruits +₹120', 'Silver Leaf Garnish +₹200', 'Rose Essence +₹50']
      }
    ]
  },
  {
    id: "small-bites",
    name: "Small Bites",
    emoji: "🥪",
    description: "Perfect starters and snacks to awaken your taste buds",
    items: [
      {
        id: "korean-bun",
        name: "Korean Bun",
        description: "Soft, pillowy bun bursting with melted cheese and aromatic garlic butter. Korea meets comfort food.",
        price: 160,
        calories: 280,
        prepTime: "8-10 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'garlic', 'gluten'],
        ingredients: ['Mozzarella cheese', 'Garlic butter', 'Soft brioche bun', 'Herbs'],
        customizations: ['Extra Cheese +₹30', 'Herb Sprinkle +₹20']
      },
      {
        id: "chilli-korean-bun",
        name: "Chilli Korean Bun",
        description: "Spiced-up version of our classic - melted cheese with a fiery kick. For those who like it hot!",
        price: 170,
        calories: 295,
        prepTime: "8-10 min",
        spiceLevel: 2,
        allergens: ['dairy', 'garlic', 'gluten'],
        ingredients: ['Mozzarella cheese', 'Green chilies', 'Garlic butter', 'Chili flakes'],
        customizations: ['Extra Spice +₹0', 'Extra Cheese +₹30', 'Mild Spice -₹0']
      },
      {
        id: "potato-wedges",
        name: "Golden Potato Wedges",
        description: "Crispy on the outside, fluffy inside. These aren't just wedges - they're happiness triangles.",
        price: 120,
        calories: 320,
        prepTime: "12-15 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh potatoes', 'Olive oil', 'Sea salt', 'Rosemary'],
        customizations: ['Cheese Sauce +₹40', 'Spicy Mayo +₹25', 'Herb Seasoning +₹15']
      },
      {
        id: "chilli-garlic-wedges",
        name: "Chilli Garlic Wedges",
        description: "Our famous wedges with a bold chilli-garlic twist. Addictively spicy and aromatic.",
        price: 150,
        calories: 340,
        prepTime: "12-15 min",
        spiceLevel: 1,
        allergens: ['garlic'],
        ingredients: ['Fresh potatoes', 'Chili powder', 'Garlic', 'Mixed herbs'],
        customizations: ['Extra Spice +₹0', 'Garlic Mayo +₹30', 'Cheese Topping +₹40']
      },
      {
        id: "cauliflower-florets",
        name: "Crispy Cauliflower Florets",
        description: "Golden, crunchy florets that make vegetables irresistible. Served with our signature house dip.",
        price: 260,
        calories: 240,
        prepTime: "15-18 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['garlic'],
        ingredients: ['Fresh cauliflower', 'Chickpea batter', 'Spices', 'House special dip'],
        customizations: ['Extra Dip +₹30', 'Spicy Coating +₹20', 'Mint Chutney +₹25']
      },
      {
        id: "french-fries-salted",
        name: "Classic French Fries",
        description: "Perfectly salted, golden fries. Sometimes simple is simply perfect.",
        price: 100,
        calories: 280,
        prepTime: "10-12 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh potatoes', 'Sea salt', 'Vegetable oil'],
        customizations: ['Cheese Sauce +₹50', 'Mayo +₹20']
      },
      {
        id: "peri-peri-fries",
        name: "Peri-Peri Fries",
        description: "Fries with a fiery African twist. Each bite packs a flavorful punch with exotic spices.",
        price: 120,
        calories: 290,
        prepTime: "10-12 min",
        spiceLevel: 2,
        allergens: [],
        ingredients: ['Fresh potatoes', 'Peri-peri seasoning', 'African spices'],
        customizations: ['Extra Peri-Peri +₹15', 'Cooling Mayo +₹25']
      }
    ]
  },
  {
    id: "soups-appetizers",
    name: "Soups & Appetizers",
    emoji: "🍲",
    description: "Soul-warming soups and delightful appetizers to start your culinary journey",
    items: [
      {
        id: "bellpepper-soup",
        name: "Roasted Bell Pepper Soup",
        description: "Velvety smooth soup with roasted bell peppers, creating a symphony of smoky sweetness.",
        price: 180,
        calories: 120,
        prepTime: "15 min",
        spiceLevel: 0,
        allergens: ['dairy'],
        ingredients: ['Roasted bell peppers', 'Cream', 'Herbs', 'Vegetable stock'],
        customizations: ['Extra Cream +₹20', 'Herb Garnish +₹15', 'Croutons +₹25']
      },
      {
        id: "cream-mushroom-soup",
        name: "Cream of Mushroom Soup",
        description: "Rich, earthy mushroom soup that's like a warm hug in a bowl. Comfort food at its finest.",
        price: 180,
        calories: 140,
        prepTime: "15 min",
        spiceLevel: 0,
        allergens: ['mushrooms', 'dairy'],
        ingredients: ['Fresh mushrooms', 'Heavy cream', 'Butter', 'Thyme'],
        customizations: ['Extra Mushrooms +₹30', 'Truffle Oil +₹50', 'Bread Bowl +₹40']
      },
      {
        id: "spice-stuffed-mushroom",
        name: "Spice Stuffed Mushrooms",
        description: "Plump mushrooms stuffed with aromatic spices and herbs. Each bite explodes with flavor.",
        price: 260,
        calories: 180,
        prepTime: "20 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['mushrooms', 'dairy'],
        ingredients: ['Button mushrooms', 'Spiced stuffing', 'Cheese', 'Herbs'],
        customizations: ['Extra Cheese +₹40', 'Spicy Stuffing +₹20', 'Herb Crust +₹30']
      },
      {
        id: "kaju-kurkure",
        name: "Kaju Kurkure",
        description: "Crispy cashew delights with a satisfying crunch. Premium nuts meet perfect seasoning.",
        price: 190,
        calories: 220,
        prepTime: "12 min",
        spiceLevel: 0,
        allergens: ['nuts'],
        ingredients: ['Premium cashews', 'Spices', 'Chickpea flour', 'Herbs'],
        customizations: ['Extra Crunch +₹25', 'Spicy Coating +₹20']
      }
    ]
  },
  {
    id: "cold-drinks",
    name: "Cold Beverages",
    emoji: "🧊",
    description: "Refreshing drinks to cool your soul and energize your spirit",
    items: [
      {
        id: "iced-tea-peach",
        name: "Peach Iced Tea",
        description: "Refreshing tea infused with sweet peach essence. Summer in a glass.",
        price: 120,
        calories: 80,
        prepTime: "5 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Black tea', 'Peach essence', 'Ice', 'Mint'],
        customizations: ['Extra Peach +₹20', 'Mint Garnish +₹10', 'Less Sweet -₹0']
      },
      {
        id: "cucumber-lemonade",
        name: "Cucumber Lemonade",
        description: "Cool cucumber meets zesty lemon in this incredibly refreshing drink. Detox never tasted so good.",
        price: 130,
        calories: 60,
        prepTime: "5 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh cucumber', 'Lemon juice', 'Mint', 'Soda'],
        customizations: ['Extra Cucumber +₹15', 'Mint Ice Cubes +₹20']
      },
      {
        id: "mojito",
        name: "Virgin Mojito",
        description: "Classic mojito without the alcohol but with all the refreshing minty goodness.",
        price: 140,
        calories: 70,
        prepTime: "5 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh mint', 'Lime juice', 'Soda water', 'Sugar'],
        customizations: ['Extra Mint +₹15', 'Fruit Flavors +₹25']
      },
      {
        id: "cold-coffee",
        name: "Classic Cold Coffee",
        description: "Rich coffee blended with ice and a touch of sweetness. Perfect pick-me-up for any time.",
        price: 120,
        calories: 110,
        prepTime: "5 min",
        spiceLevel: 0,
        allergens: ['dairy'],
        ingredients: ['Fresh coffee', 'Milk', 'Ice cream', 'Sugar'],
        customizations: ['Extra Shot +₹30', 'Whipped Cream +₹25', 'Chocolate Syrup +₹20']
      },
      {
        id: "hazelnut-cold-coffee",
        name: "Hazelnut Cold Coffee",
        description: "Elevated cold coffee with rich hazelnut notes. Café-quality coffee experience.",
        price: 160,
        calories: 130,
        prepTime: "5 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'nuts'],
        ingredients: ['Fresh coffee', 'Hazelnut syrup', 'Milk', 'Ice'],
        customizations: ['Extra Hazelnut +₹25', 'Whipped Cream +₹30', 'Caramel Drizzle +₹25']
      }
    ]
  },
  {
    id: "hot-drinks",
    name: "Hot Beverages",
    emoji: "☕",
    description: "Warming drinks to comfort your heart and awaken your senses",
    items: [
      {
        id: "masala-chai",
        name: "Authentic Masala Chai",
        description: "Traditional Indian tea with aromatic spices. A cup of warmth and tradition.",
        price: 80,
        calories: 60,
        prepTime: "8 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['dairy'],
        ingredients: ['Black tea', 'Cardamom', 'Ginger', 'Cinnamon', 'Milk'],
        customizations: ['Extra Strong +₹10', 'Less Milk -₹0', 'Extra Ginger +₹15']
      },
      {
        id: "hot-coffee",
        name: "Fresh Hot Coffee",
        description: "Perfectly brewed coffee to kickstart your day. Simple, pure, and energizing.",
        price: 80,
        calories: 40,
        prepTime: "5 min",
        spiceLevel: 0,
        allergens: [],
        ingredients: ['Fresh coffee beans', 'Hot water'],
        customizations: ['Extra Strong +₹15', 'With Milk +₹20', 'Sugar-free -₹0']
      },
      {
        id: "hot-chocolate",
        name: "Rich Hot Chocolate",
        description: "Decadent hot chocolate that's like drinking a chocolate bar. Pure indulgence in a mug.",
        price: 190,
        calories: 250,
        prepTime: "8 min",
        spiceLevel: 0,
        allergens: ['dairy'],
        ingredients: ['Premium cocoa', 'Milk', 'Dark chocolate', 'Whipped cream'],
        customizations: ['Marshmallows +₹25', 'Extra Chocolate +₹30', 'Cinnamon +₹15']
      }
    ]
  },
  {
    id: "pizza",
    name: "Hand-Rolled Pizza",
    emoji: "🍕",
    description: "Thin crust pizzas made with love, topped with the finest ingredients",
    items: [
      {
        id: "margarita-pizza",
        name: "Classic Margarita",
        description: "Simple perfection - fresh mozzarella, tangy tomato sauce, and aromatic basil on thin crust.",
        price: 230,
        calories: 580,
        prepTime: "18-22 min",
        isPopular: true,
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Mozzarella', 'Tomato sauce', 'Fresh basil', 'Thin crust'],
        customizations: ['Extra Cheese +₹50', 'Olives +₹30', 'Jalapeños +₹25']
      },
      {
        id: "mexican-pizza",
        name: "Mexican Fiesta",
        description: "A colorful celebration of vegetables with bold Mexican spices. Every slice is a party!",
        price: 270,
        calories: 620,
        prepTime: "20-25 min",
        spiceLevel: 1,
        allergens: ['dairy', 'gluten', 'onions'],
        ingredients: ['Bell peppers', 'Onions', 'Corn', 'Mexican seasoning', 'Cheese'],
        customizations: ['Extra Veggies +₹40', 'Jalapeños +₹25', 'Spicy Sauce +₹20']
      },
      {
        id: "paneer-tikka-pizza",
        name: "Paneer Tikka Supreme",
        description: "Smoky paneer tikka meets Italian tradition. Best of both worlds on one delicious pizza.",
        price: 290,
        calories: 650,
        prepTime: "22-25 min",
        spiceLevel: 1,
        allergens: ['dairy', 'gluten', 'onions'],
        ingredients: ['Marinated paneer', 'Onions', 'Mint chutney', 'Tikka sauce'],
        customizations: ['Extra Paneer +₹60', 'Mint Chutney +₹20', 'Bell Peppers +₹30']
      }
    ]
  },
  {
    id: "pasta",
    name: "Italian Pasta",
    emoji: "🍝",
    description: "Authentic Italian pasta dishes made with premium ingredients and traditional techniques",
    items: [
      {
        id: "arrabiata-pasta",
        name: "Spicy Arrabiata",
        description: "Fiery red sauce pasta that awakens your taste buds. For those who love passion on their plate.",
        price: 230,
        calories: 480,
        prepTime: "15-18 min",
        isPopular: true,
        spiceLevel: 2,
        allergens: ['gluten', 'garlic'],
        ingredients: ['Penne pasta', 'Spicy tomato sauce', 'Red chilies', 'Garlic', 'Herbs'],
        customizations: ['Extra Spice +₹0', 'Parmesan +₹40', 'Garlic Bread +₹50']
      },
      {
        id: "alfredo-pasta",
        name: "Creamy Alfredo",
        description: "Silky smooth white sauce pasta that's pure comfort food. Rich, creamy, and utterly satisfying.",
        price: 230,
        calories: 520,
        prepTime: "15-18 min",
        spiceLevel: 0,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Penne pasta', 'Cream sauce', 'Butter', 'Parmesan', 'Black pepper'],
        customizations: ['Extra Cream +₹30', 'Garlic Bread +₹50', 'Herbs +₹15']
      },
      {
        id: "pesto-pasta",
        name: "Fresh Basil Pesto",
        description: "Vibrant green pesto made with fresh basil, pine nuts, and love. A taste of Italian gardens.",
        price: 280,
        calories: 460,
        prepTime: "18-20 min",
        spiceLevel: 0,
        allergens: ['nuts', 'dairy', 'gluten', 'garlic'],
        ingredients: ['Fresh basil', 'Pine nuts', 'Parmesan', 'Garlic', 'Olive oil'],
        customizations: ['Extra Pesto +₹40', 'Parmesan +₹40', 'Garlic Bread +₹50']
      },
      {
        id: "pink-sauce-pasta",
        name: "Pink Sauce Delight",
        description: "Perfect marriage of red and white sauces creating a beautiful pink symphony of flavors.",
        price: 260,
        calories: 500,
        prepTime: "16-20 min",
        spiceLevel: 0,
        allergens: ['dairy', 'gluten', 'garlic'],
        ingredients: ['Penne pasta', 'Tomato sauce', 'Cream', 'Herbs', 'Garlic'],
        customizations: ['Extra Cream +₹30', 'Vegetables +₹40', 'Garlic Bread +₹50']
      }
    ]
  },
  {
    id: "house-specials",
    name: "House Specials",
    emoji: "⭐",
    description: "Sonna's signature creations that have made us legendary",
    items: [
      {
        id: "amritsari-chole-kulcha",
        name: "Amritsari Chole + House Kulcha",
        description: "Authentic Punjabi flavors with perfectly spiced chole and our signature soft kulcha. A North Indian classic.",
        price: 240,
        calories: 580,
        prepTime: "20-25 min",
        isSignature: true,
        spiceLevel: 1,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Chickpeas', 'Onions', 'Tomatoes', 'House kulcha', 'Traditional spices'],
        customizations: ['Extra Kulcha +₹35', 'Pickled Onions +₹20', 'Extra Spice +₹0']
      },
      {
        id: "khao-suey",
        name: "Burmese Khao Suey",
        description: "Exotic Burmese noodle soup with coconut milk and aromatic spices. A bowl of Southeast Asian comfort.",
        price: 290,
        calories: 480,
        prepTime: "25-30 min",
        isSignature: true,
        spiceLevel: 1,
        allergens: ['gluten', 'nuts'],
        ingredients: ['Rice noodles', 'Coconut milk', 'Vegetables', 'Asian spices', 'Garnishes'],
        customizations: ['Extra Coconut Milk +₹30', 'Crispy Noodles +₹25', 'Vegetables +₹40']
      },
      {
        id: "paneer-butter-masala-combo",
        name: "Paneer Butter Masala + Rice/Kulcha",
        description: "Creamy, rich paneer in tomato-based gravy. The ultimate comfort food combination.",
        price: 295,
        calories: 620,
        prepTime: "22-25 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['dairy', 'gluten'],
        ingredients: ['Fresh paneer', 'Tomato gravy', 'Cream', 'Butter', 'Rice/Kulcha'],
        customizations: ['Extra Paneer +₹60', 'Kulcha instead of Rice +₹0', 'Extra Gravy +₹40']
      }
    ]
  },
  {
    id: "sandwiches",
    name: "Gourmet Sandwiches",
    emoji: "🥪",
    description: "Artfully crafted sandwiches on fresh bread or buttery croissants",
    items: [
      {
        id: "veg-sandwich",
        name: "Garden Fresh Veg Sandwich",
        description: "Crisp vegetables layered between fresh bread with our special spread. Healthy never tasted so good.",
        price: 150,
        calories: 280,
        prepTime: "10-12 min",
        spiceLevel: 0,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Fresh vegetables', 'Cucumber', 'Tomato', 'Lettuce', 'Special spread'],
        customizations: ['Croissant Bread +₹70', 'Extra Veggies +₹30', 'Cheese +₹40']
      },
      {
        id: "paneer-tikka-sandwich",
        name: "Paneer Tikka Sandwich",
        description: "Smoky paneer tikka with mint chutney and fresh vegetables. A flavor explosion in every bite.",
        price: 180,
        calories: 380,
        prepTime: "12-15 min",
        spiceLevel: 1,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Marinated paneer', 'Mint chutney', 'Onions', 'Bell peppers'],
        customizations: ['Croissant Bread +₹70', 'Extra Paneer +₹50', 'Spicy Mayo +₹25']
      },
      {
        id: "bombay-masala-sandwich",
        name: "Bombay Masala Sandwich",
        description: "Street-style Bombay sandwich with spiced potato filling and tangy chutneys. Mumbai on a plate!",
        price: 180,
        calories: 320,
        prepTime: "12-15 min",
        isPopular: true,
        spiceLevel: 1,
        allergens: ['gluten'],
        ingredients: ['Spiced potatoes', 'Green chutney', 'Tamarind chutney', 'Onions'],
        customizations: ['Croissant Bread +₹70', 'Extra Chutneys +₹20', 'Cheese +₹40']
      }
    ]
  },
  {
    id: "burgers",
    name: "Gourmet Burgers",
    emoji: "🍔",
    description: "Handcrafted burgers with fresh ingredients and bold flavors",
    items: [
      {
        id: "classic-veg-burger",
        name: "Classic Veg Burger",
        description: "Perfectly seasoned vegetable patty with fresh lettuce, tomato, and our signature sauce.",
        price: 160,
        calories: 380,
        prepTime: "15-18 min",
        spiceLevel: 0,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Veg patty', 'Lettuce', 'Tomato', 'Onion', 'Special sauce'],
        customizations: ['Cheese Slice +₹30', 'Extra Patty +₹50', 'Spicy Sauce +₹15']
      },
      {
        id: "mexican-burger",
        name: "Mexican Fiesta Burger",
        description: "Spiced patty with jalapeños, salsa, and Mexican herbs. A fiesta in every bite!",
        price: 170,
        calories: 420,
        prepTime: "15-18 min",
        spiceLevel: 1,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Mexican-spiced patty', 'Jalapeños', 'Salsa', 'Mexican herbs'],
        customizations: ['Extra Jalapeños +₹20', 'Cheese +₹30', 'Extra Spice +₹0']
      },
      {
        id: "paneer-tikka-burger",
        name: "Paneer Tikka Burger",
        description: "Grilled paneer tikka with mint mayo and crisp vegetables. Indian flavors meet international format.",
        price: 190,
        calories: 450,
        prepTime: "18-20 min",
        spiceLevel: 1,
        allergens: ['gluten', 'dairy'],
        ingredients: ['Grilled paneer tikka', 'Mint mayo', 'Onions', 'Bell peppers'],
        customizations: ['Extra Paneer +₹50', 'Cheese Slice +₹30', 'Spicy Mayo +₹20']
      }
    ]
  }
];

// Sonna's recommendations - personal touch with seasonal highlights
export const sonnaRecommends = [
  "sonnas-chocolate-cake",
  "fresh-farm-mango", 
  "korean-bun",
  "margarita-pizza",
  "arrabiata-pasta",
  "paneer-butter-masala-combo",
  "mojito",
  "masala-chai"
];

// Best sellers across all categories
export const bestSellers = [
  "sonnas-chocolate-cake",
  "almond-brittle",
  "strawberry-chocolate", 
  "fresh-farm-mango"
];

// Quick filters for better UX
export const dietaryFilters = {
  vegetarian: "All items are vegetarian",
  glutenFree: "gluten",
  dairyFree: "dairy", 
  nutFree: "nuts",
  spicyFood: "spiceLevel"
};

// Popular combos for upselling
export const popularCombos = [
  {
    name: "Perfect Lunch Combo",
    items: ["paneer-butter-masala-combo", "masala-chai"],
    discount: 30,
    description: "Complete meal with authentic flavors"
  },
  {
    name: "Coffee & Cake Pair",
    items: ["sonnas-chocolate-cake", "cold-coffee"],
    discount: 50,
    description: "Sweet indulgence with perfect coffee"
  },
  {
    name: "Snack Attack",
    items: ["korean-bun", "peri-peri-fries", "mojito"],
    discount: 40,
    description: "Perfect sharing combo for friends"
  }
];
