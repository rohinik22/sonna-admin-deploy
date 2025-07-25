
/*
 * 🛒 Cart Context - State management with a touch of sweetness
 * Commerce logic orchestrated by Mr. Sweet
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuItem } from '@/data/menuData';

export interface CartItem extends MenuItem {
  quantity: number;
  customizations: string[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee: number;
  gst: number;
  grandTotal: number;
  appliedCoupons: string[];
  discount: number;
  lastSync: number;
  estimatedDeliveryTime: number;
  loyaltyPointsEarned: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: MenuItem; customizations?: string[] } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  deliveryFee: 0,
  gst: 0,
  grandTotal: 0,
  appliedCoupons: [],
  discount: 0,
  lastSync: Date.now(),
  estimatedDeliveryTime: 30,
  loyaltyPointsEarned: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, customizations = [] } = action.payload;
      const existingItemIndex = state.items.findIndex(
        cartItem => cartItem.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        const newCartItem: CartItem = {
          ...item,
          quantity: 1,
          customizations,
        };
        updatedItems = [...state.items, newCartItem];
      }

      return calculateTotals({ ...state, items: updatedItems });
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: updatedItems });
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== id);
        return calculateTotals({ ...state, items: updatedItems });
      }

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      return calculateTotals({ ...state, items: updatedItems });
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Smart delivery fee calculation
  let deliveryFee = 0;
  if (total < 500) {
    deliveryFee = 50;
  } else if (total < 1000 && itemCount > 5) {
    deliveryFee = 25; // Reduced fee for bulk orders
  }
  
  // Dynamic discount calculation
  let discount = state.discount;
  if (total > 1000 && state.appliedCoupons.length === 0) {
    discount = total * 0.05; // 5% auto-discount for orders over ₹1000
  }
  
  const gst = (total - discount) * 0.18; // 18% GST on discounted amount
  const grandTotal = total - discount + deliveryFee + gst;
  
  // Loyalty points calculation (1 point per ₹10 spent)
  const loyaltyPointsEarned = Math.floor(total / 10);
  
  // Estimated delivery time based on order complexity
  let estimatedDeliveryTime = 30; // Base time
  if (itemCount > 3) estimatedDeliveryTime += 10;
  if (state.items.some(item => item.name.includes('Cake'))) estimatedDeliveryTime += 15;
  
  return {
    ...state,
    total,
    itemCount,
    deliveryFee,
    gst,
    grandTotal,
    discount,
    loyaltyPointsEarned,
    estimatedDeliveryTime,
    lastSync: Date.now(),
  };
};

interface CartContextType {
  state: CartState;
  addItem: (item: MenuItem, customizations?: string[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => boolean;
  removeCoupon: (couponCode: string) => void;
  getRecommendations: () => MenuItem[];
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sonnas-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sonnas-cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: MenuItem, customizations?: string[]) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, customizations } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Smart coupon system
  const applyCoupon = (couponCode: string): boolean => {
    const validCoupons: Record<string, number> = {
      'SWEET10': 0.1,
      'FIRST20': 0.2,
      'LOYALTY15': 0.15,
      'WEEKEND25': 0.25,
    };
    
    if (validCoupons[couponCode] && !state.appliedCoupons.includes(couponCode)) {
      const discountPercent = validCoupons[couponCode];
      const newDiscount = state.total * discountPercent;
      
      dispatch({
        type: 'LOAD_CART',
        payload: {
          ...state,
          appliedCoupons: [...state.appliedCoupons, couponCode],
          discount: state.discount + newDiscount,
        }
      });
      return true;
    }
    return false;
  };

  const removeCoupon = (couponCode: string) => {
    // Recalculate discount without this coupon
    const newCoupons = state.appliedCoupons.filter(code => code !== couponCode);
    dispatch({
      type: 'LOAD_CART',
      payload: {
        ...state,
        appliedCoupons: newCoupons,
        discount: 0, // Recalculate in next render
      }
    });
  };

  // Smart recommendations based on cart contents
  const getRecommendations = (): MenuItem[] => {
    // This would typically fetch from an API
    // For now, return mock recommendations based on cart items
    return [];
  };

  // Sync cart with server (for future multi-device support)
  const syncCart = async (): Promise<void> => {
    try {
      // Future implementation: sync with backend
      console.log('🔄 Cart synced');
    } catch (error) {
      console.error('Cart sync failed:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      applyCoupon,
      removeCoupon,
      getRecommendations,
      syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
