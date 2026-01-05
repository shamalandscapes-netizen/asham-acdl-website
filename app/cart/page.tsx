'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Loader2, 
  ArrowLeft 
} from 'lucide-react';

interface CartItem {
  id: string; // Cart Item ID
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // To track which item is loading
  const router = useRouter();

  // 1. Fetch Cart Items on Load
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        // The API returns { items: [] } or just the array depending on how we set it up. 
        // Based on my previous code, it returns the array directly.
        setCartItems(Array.isArray(data) ? data : []); 
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Quantity (Increase/Decrease)
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(productId);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (res.ok) {
        // Optimistic UI Update (Update local state instantly)
        setCartItems((prev) => 
          prev.map((item) => 
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(null);
    }
  };

  // 3. Remove Item
  const removeItem = async (productId: string) => {
    if (!confirm('Remove this item from your cart?')) return;
    setUpdating(productId);

    try {
      const res = await fetch(`/api/cart?id=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  // 4. Calculate Totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.16; // Assuming 16% VAT (Optional, you can set to 0)
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#06392F] mb-4" size={32} />
        <p className="text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold text-[#06392F] mb-8 flex items-center gap-3">
          <ShoppingBag className="text-[#C75B39]" /> Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50">
              <ShoppingBag className="text-gray-300" size={32} />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="max-w-md mx-auto mb-8 text-gray-500">
              Looks like you haven't added any construction materials or plans yet.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-[#06392F] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          // --- CART CONTENT ---
          <div className="flex flex-col gap-8 lg:flex-row">
            
            {/* ITEMS LIST (Left Side) */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col items-center gap-6 p-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:flex-row"
                >
                  {/* Image */}
                  <div className="w-full h-24 overflow-hidden bg-gray-100 rounded-lg sm:w-24 shrink-0">
                    <img 
                      src={item.product.image_url || '/placeholder.png'} 
                      alt={item.product.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-800">{item.product.name}</h3>
                    <p className="mb-2 text-sm text-gray-500 capitalize">{item.product.category}</p>
                    <div className="font-bold text-[#C75B39]">
                      KES {item.product.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-center gap-3">
                    
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3 p-1 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating === item.product.id}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F] disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 font-bold text-center text-gray-700">
                        {updating === item.product.id ? <Loader2 className="mx-auto animate-spin" size={14} /> : item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={updating === item.product.id}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove Link */}
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <Link href="/products" className="inline-flex items-center gap-2 text-[#06392F] font-bold hover:underline mt-4">
                <ArrowLeft size={18} /> Continue Shopping
              </Link>
            </div>

            {/* SUMMARY CARD (Right Side) */}
            <div className="lg:w-96 shrink-0">
              <div className="sticky p-6 bg-white border border-gray-200 shadow-sm rounded-xl top-24">
                <h3 className="mb-6 text-xl font-bold text-gray-800">Order Summary</h3>
                
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (16% VAT)</span>
                    <span>KES {tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg text-[#06392F]">
                    <span>Total</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full bg-[#06392F] text-white py-3.5 rounded-lg font-bold hover:bg-[#0A4D40] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <p className="mt-4 text-xs text-center text-gray-400">
                  Secure checkout powered by M-Pesa
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}