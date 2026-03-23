import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Reusing the CartItem interface defined in useCart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  recalculateTotals: () => void;
}

// Helper function to recalculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalPrice, totalItems };
};

/**
 * Zustand Store for Cart Management (Persistent via localStorage).
 * This is the canonical source of truth for the cart state across the application.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      totalItems: 0,

      recalculateTotals: () => {
        const { items } = get();
        const { totalPrice, totalItems } = calculateTotals(items);
        set({ totalPrice, totalItems });
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);
          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Item exists, increase quantity
            newItems = state.items.map((cartItem, index) => 
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            );
          } else {
            // Item is new, add it
            newItems = [...state.items, { ...item, quantity }];
          }

          const { totalPrice, totalItems } = calculateTotals(newItems);
          toast.success(`${item.name} added to cart!`);
          return { items: newItems, totalPrice, totalItems };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== id);
          const { totalPrice, totalItems } = calculateTotals(newItems);
          toast.success(`Item removed from cart.`);
          return { items: newItems, totalPrice, totalItems };
        });
      },

      updateQuantity: (id, newQuantity) => {
        if (newQuantity <= 0) {
          // If quantity is zero or less, remove the item
          get().removeItem(id);
          return;
        }

        set((state) => {
          const newItems = state.items.map(item =>
            item.id === id
              ? { ...item, quantity: newQuantity }
              : item
          );
          const { totalPrice, totalItems } = calculateTotals(newItems);
          return { items: newItems, totalPrice, totalItems };
        });
      },

      clearCart: () => {
        set({ items: [], totalPrice: 0, totalItems: 0 });
        toast.success('Shopping cart cleared!');
      },
    }),
    {
      name: 'asham-cart-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // use standard localStorage
      // only store the items array, totals are calculated on load/change
      partialize: (state) => ({ items: state.items }), 
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration (loading from storage)
        if (state) {
          state.recalculateTotals();
        }
      },
    }
  )
);

// Optional: Custom hook for easy component consumption
export const useClientCart = () => {
  const { items, totalPrice, totalItems, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  return { items, totalPrice, totalItems, addItem, removeItem, updateQuantity, clearCart };
};