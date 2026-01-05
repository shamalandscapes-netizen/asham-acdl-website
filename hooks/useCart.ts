'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast'; // Assuming you have a toast notification library installed

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  totalItems: number;
}

const STORAGE_KEY = 'asham-cart';

export const useCart = () => {
  // Initialize state from localStorage or an empty array
  const [cartState, setCartState] = useState<CartState>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(STORAGE_KEY);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          // Calculate initial totals
          const total = parsedCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
          const totalItems = parsedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
          return {
            items: parsedCart,
            total,
            totalItems,
          };
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
    return { items: [], total: 0, totalItems: 0 };
  });

  // Effect to synchronize state with localStorage whenever the cart items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState.items));
  }, [cartState.items]);


  // Helper function to calculate totals
  const recalculateTotals = useCallback((items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartState({ items, total, totalItems });
  }, []);


  // --- Cart Actions ---

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartState(prevState => {
      const existingItemIndex = prevState.items.findIndex(cartItem => cartItem.id === item.id);
      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        newItems = prevState.items.map((cartItem, index) => 
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Item is new, add it
        newItems = [...prevState.items, { ...item, quantity }];
      }
      
      recalculateTotals(newItems);
      toast.success(`${item.name} added to cart!`);
      return { ...prevState, items: newItems }; // Temporarily return, recalculateTotals will update officially
    });
  }, [recalculateTotals]);


  const removeItem = useCallback((id: string) => {
    setCartState(prevState => {
      const newItems = prevState.items.filter(item => item.id !== id);
      recalculateTotals(newItems);
      toast.success(`Item removed from cart.`);
      return { ...prevState, items: newItems };
    });
  }, [recalculateTotals]);


  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is zero or less, remove the item
      removeItem(id);
      return;
    }

    setCartState(prevState => {
      const newItems = prevState.items.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      );
      recalculateTotals(newItems);
      return { ...prevState, items: newItems };
    });
  }, [recalculateTotals, removeItem]);


  const clearCart = useCallback(() => {
    setCartState({ items: [], total: 0, totalItems: 0 });
    toast.success('Shopping cart cleared!');
  }, []);


  return {
    cart: cartState.items,
    total: cartState.total,
    totalItems: cartState.totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};