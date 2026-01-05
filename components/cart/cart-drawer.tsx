'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'; 
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils'; 

export function CartDrawer() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalPrice 
  } = useCartStore();
  
  const { isCartOpen, closeCart } = useUIStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm",
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={closeCart}
      />

      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({items.length})
          </h2>
          <button 
            type="button"
            onClick={closeCart}
            aria-label="Close cart" // ✅ Fix: Added label for screen readers
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Cart Items Area */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
              <div className="p-6 bg-gray-100 rounded-full">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                <p className="mt-1 text-sm text-gray-500">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                type="button"
                onClick={closeCart}
                className="font-medium text-blue-600 hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Product Image */}
                <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 border rounded-md">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`} // ✅ Fix: Specific label
                        className="ml-2 text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      KES {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity" // ✅ Fix
                        className="p-1 transition hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-xs font-medium text-center">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity" // ✅ Fix
                        className="p-1 transition hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="ml-auto text-sm font-semibold">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 space-y-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Subtotal</span>
              <span className="text-xl font-bold">KES {totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-center text-gray-500">
              Shipping & taxes calculated at checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 font-semibold text-center text-white transition bg-black rounded-lg shadow-lg hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}