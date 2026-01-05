import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  totalPrice: number;
  
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
      totalPrice: 0,

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          // If item exists, just increase quantity
          const updatedItems = currentItems.map((i) =>
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
          set({
            items: updatedItems,
            totalPrice: calculateTotal(updatedItems),
          });
        } else {
          // Add new item with quantity 1
          const newItem = { ...item, quantity: 1 };
          const updatedItems = [...currentItems, newItem];
          set({
            items: updatedItems,
            totalPrice: calculateTotal(updatedItems),
          });
        }
      },

      removeItem: (itemId) => {
        const updatedItems = get().items.filter((i) => i.id !== itemId);
        set({
          items: updatedItems,
          totalPrice: calculateTotal(updatedItems),
        });
      },

      updateQuantity: (itemId, quantity) => {
        const currentItems = get().items;
        
        // If quantity is less than 1, remove the item
        if (quantity < 1) {
          const updatedItems = currentItems.filter((i) => i.id !== itemId);
          set({
            items: updatedItems,
            totalPrice: calculateTotal(updatedItems),
          });
          return;
        }

        const updatedItems = currentItems.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );

        set({
          items: updatedItems,
          totalPrice: calculateTotal(updatedItems),
        });
      },

      clearCart: () => set({ items: [], totalPrice: 0 }),
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper to calculate total price
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}