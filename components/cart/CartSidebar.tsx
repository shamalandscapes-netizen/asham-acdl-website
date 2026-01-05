'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  // 1. Fetch Cart Data when Sidebar opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
      // Disable body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load cart', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Remove Item Logic
  const removeItem = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/cart?id=${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        router.refresh(); // Refresh page data if needed
      }
    } catch (error) {
      console.error('Error removing item', error);
    } finally {
      setRemovingId(null);
    }
  };

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <>
      {/* OVERLAY (Click to close) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR PANEL */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#06392F] flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart 
            <span className="bg-[#C75B39] text-white text-xs px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col h-[calc(100vh-180px)] overflow-y-auto p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="mb-2 animate-spin" size={32} />
              <p>Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gray-50">
                <ShoppingBag className="text-gray-300" size={32} />
              </div>
              <h3 className="mb-1 font-bold text-gray-700">Your cart is empty</h3>
              <p className="mb-6 text-sm text-gray-500">Looks like you haven't added anything yet.</p>
              <button 
                onClick={onClose}
                className="text-[#06392F] font-bold text-sm hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 transition-colors bg-white border border-gray-100 shadow-sm rounded-xl hover:border-gray-200">
                  {/* Image */}
                  <div className="flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-50 shrink-0">
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="object-cover max-w-full max-h-full"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{item.product.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded">
                        Qty: {item.quantity}
                      </div>
                      <div className="font-bold text-[#C75B39] text-sm">
                        KES {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    disabled={removingId === item.product.id}
                    className="h-full px-2 text-gray-300 transition-colors hover:text-red-500"
                  >
                    {removingId === item.product.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-xl font-bold text-[#06392F]">
                KES {subtotal.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-center px-4 py-3 font-bold text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Cart
              </Link>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#06392F] text-white rounded-lg font-bold hover:bg-[#0A4D40] transition-colors"
              >
                Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}