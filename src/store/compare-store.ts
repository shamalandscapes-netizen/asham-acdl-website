import { create } from 'zustand';
import { Product } from '@/types/products';

interface CompareStore {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  items: [],
  addToCompare: (product) => set((state) => {
    // Prevent duplicates
    const exists = state.items.find((item) => item.id === product.id);
    if (exists) {
      return { items: state.items.filter((item) => item.id !== product.id) };
    }
    // Limit to 4 items
    if (state.items.length >= 4) return state;
    return { items: [...state.items, product] };
  }),
  removeFromCompare: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId)
  })),
  clearCompare: () => set({ items: [] }),
}));