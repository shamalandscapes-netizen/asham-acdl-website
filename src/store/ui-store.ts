import { create } from 'zustand';

// Use a generic or specific Product type if you have one
type Product = any; 

interface UIState {
  // --- Cart State ---
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // --- Quick View State ---
  isQuickViewOpen: boolean;
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // --- Search State ---
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void; // ✅ Added to match Navbar usage

  // --- Product Comparison State ---
  compareItems: Product[];
  isCompareModalOpen: boolean;
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string | number) => void;
  clearCompare: () => void;
  openCompareModal: () => void;
  closeCompareModal: () => void;

  // --- Global UI Helpers ---
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Cart
  isCartOpen: false,
  openCart: () => {
    set({ isCartOpen: true, isSearchOpen: false, isQuickViewOpen: false, isCompareModalOpen: false });
    toggleBodyScroll(true);
  },
  closeCart: () => {
    set({ isCartOpen: false });
    toggleBodyScroll(false);
  },
  toggleCart: () => set((state) => {
    const nextState = !state.isCartOpen;
    toggleBodyScroll(nextState);
    // If opening, ensure search is closed
    return { isCartOpen: nextState, isSearchOpen: false, isQuickViewOpen: false, isCompareModalOpen: false };
  }),

  // Quick View
  isQuickViewOpen: false,
  selectedProduct: null,
  openQuickView: (product) => {
    set({ isQuickViewOpen: true, selectedProduct: product, isCartOpen: false, isCompareModalOpen: false, isSearchOpen: false });
    toggleBodyScroll(true);
  },
  closeQuickView: () => {
    set({ isQuickViewOpen: false, selectedProduct: null });
    toggleBodyScroll(false);
  },

  // Search
  isSearchOpen: false,
  openSearch: () => {
    set({ isSearchOpen: true, isCartOpen: false, isCompareModalOpen: false, isQuickViewOpen: false });
    toggleBodyScroll(true);
  },
  closeSearch: () => {
    set({ isSearchOpen: false });
    toggleBodyScroll(false);
  },
  // ✅ Added toggleSearch logic
  toggleSearch: () => set((state) => {
    const nextState = !state.isSearchOpen;
    toggleBodyScroll(nextState);
    return { isSearchOpen: nextState, isCartOpen: false, isQuickViewOpen: false, isCompareModalOpen: false };
  }),

  // Comparison Logic
  compareItems: [],
  isCompareModalOpen: false,
  addToCompare: (product) => set((state) => {
    if (state.compareItems.find(i => i.id === product.id)) return state;
    if (state.compareItems.length >= 3) return state; 
    return { compareItems: [...state.compareItems, product] };
  }),
  removeFromCompare: (id) => set((state) => ({
    compareItems: state.compareItems.filter(i => i.id !== id)
  })),
  clearCompare: () => set({ compareItems: [] }),
  openCompareModal: () => {
    set({ isCompareModalOpen: true, isCartOpen: false, isSearchOpen: false, isQuickViewOpen: false });
    toggleBodyScroll(true);
  },
  closeCompareModal: () => {
    set({ isCompareModalOpen: false });
    toggleBodyScroll(false);
  },

  // Utility to clear the screen
  closeAll: () => {
    set({ 
      isCartOpen: false, 
      isQuickViewOpen: false, 
      isSearchOpen: false, 
      isCompareModalOpen: false,
      selectedProduct: null 
    });
    toggleBodyScroll(false);
  }
}));

/**
 * Prevents the background from scrolling when an overlay is active.
 */
function toggleBodyScroll(isOpen: boolean) {
  if (typeof window === 'undefined') return;
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}