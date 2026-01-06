import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  // Derived state (getters)
  getTotalPrice: () => number;
  getItemCount: () => number;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Derived State: Use functions to ensure we always have fresh values
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          // Increase quantity, but you could also add a 'max_stock' check here
          const updatedItems = items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
          set({ items: updatedItems });
        } else {
          // Add new item with default quantity of 1 if not specified
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        const items = get().items;
        
        // Remove item if quantity drops to 0
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.id !== itemId) });
          return;
        }

        set({
          items: items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'asham-cart-storage', // Specific naming prevents collisions
      storage: createJSONStorage(() => localStorage),
      // Optimization: Only persist the items, not derived states
      partialize: (state) => ({ items: state.items }),
    }
  )
);