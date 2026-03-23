'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from 'lucide-react';

import CartItem from '@/components/cart/CartItem';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartRow {
  id: string; // cart row id
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_url?: string | null;
    category: string;
    stock: number;
  };
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();

  /* ----------------------------- Effects ----------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    fetchCart();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  /* ----------------------------- API Calls ---------------------------- */

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = useCallback(
    async (cartRowId: string, quantity: number) => {
      if (quantity <= 0) return;

      setUpdatingId(cartRowId);
      try {
        const res = await fetch('/api/cart', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cartRowId, quantity }),
        });

        if (!res.ok) throw new Error('Failed to update cart');

        setItems((prev) =>
          prev.map((item) =>
            item.id === cartRowId
              ? { ...item, quantity }
              : item
          )
        );

        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setUpdatingId(null);
      }
    },
    [router]
  );

  const removeItem = useCallback(
    async (cartRowId: string) => {
      setUpdatingId(cartRowId);
      try {
        const res = await fetch(`/api/cart?id=${cartRowId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to remove item');

        setItems((prev) =>
          prev.filter((item) => item.id !== cartRowId)
        );

        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setUpdatingId(null);
      }
    },
    [router]
  );

  /* ----------------------------- Derived ------------------------------ */

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  /* ----------------------------- Render ------------------------------- */

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="flex items-center gap-2 text-lg font-black text-[#06392F]">
            <ShoppingBag size={20} />
            Cart
            <span className="ml-1 rounded-full bg-[#C75B39] px-2 py-0.5 text-xs font-bold text-white">
              {items.length}
            </span>
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </header>

        {/* BODY */}
        <div className="flex-1 p-5 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="mb-2 animate-spin" size={32} />
              Loading cart…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={40} className="mb-4 text-gray-300" />
              <p className="font-bold text-gray-700">
                Your cart is empty
              </p>
              <button
                onClick={onClose}
                className="mt-4 text-sm font-bold text-[#06392F] hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isUpdating={updatingId === item.id}
                  onUpdateQuantity={(qty) =>
                    updateQuantity(item.id, qty)
                  }
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <footer className="p-5 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Subtotal
              </span>
              <span className="text-xl font-black text-[#06392F]">
                KES {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center py-3 text-sm font-bold border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#06392F] py-3 text-sm font-bold text-white hover:bg-[#0A4D40]"
              >
                Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
