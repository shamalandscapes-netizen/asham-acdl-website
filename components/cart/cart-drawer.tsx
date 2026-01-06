'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'; 
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { cn, formatCurrency } from '@/lib/utils'; 

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  
  const { isCartOpen, closeCart } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  // Derived state for the total
  const totalPrice = useMemo(() => getTotalPrice(), [items, getTotalPrice]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-40 transition-opacity duration-500 backdrop-blur-sm",
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-800" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C75B39] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {items.length}
                </span>
              )}
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase">Your Cart</h2>
          </div>
          <button 
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            title="Close cart"
            className="p-2 transition-all rounded-full outline-none hover:bg-gray-100 active:scale-95 focus:ring-2 focus:ring-gray-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
              <div className="p-8 rounded-full bg-gray-50">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black tracking-tight uppercase">Empty Manifest</p>
                <p className="text-sm text-gray-500">Add project materials to get started.</p>
              </div>
              <button 
                type="button"
                onClick={closeCart}
                className="px-8 py-3 bg-[#06392F] text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 transition-all border border-transparent rounded-2xl bg-gray-50 hover:border-gray-200 group">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden bg-white border shadow-sm rounded-xl">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-[10px] font-bold text-gray-400 uppercase">No Image</div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-tight tracking-tight text-gray-900 uppercase">{item.name}</h3>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          title="Remove item"
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#C75B39]">{formatCurrency(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-white border rounded-lg shadow-sm">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                          className="p-2 transition hover:text-[#C75B39] disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-xs font-black text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                          className="p-2 transition hover:text-[#C75B39]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 space-y-6 bg-white border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Subtotal</span>
              <span className="text-2xl font-black tracking-tighter text-gray-900">{formatCurrency(totalPrice)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="group flex items-center justify-center gap-3 w-full py-5 font-black uppercase tracking-[0.2em] text-sm text-white transition bg-[#06392F] rounded-2xl shadow-xl hover:bg-black"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}