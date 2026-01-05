'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/products';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductPurchaseProps {
  product: Product;
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      is_digital: product.is_digital || false,
      quantity: quantity, 
    });
    
    toast.success(`Added ${quantity} ${product.name} to cart`);
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="space-y-8">
      {/* QUANTITY SELECTOR */}
      <div className="space-y-3">
        <label htmlFor="quantity" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          Select Quantity
        </label>
        <div className="flex items-center p-1 border border-gray-100 shadow-inner w-fit bg-gray-50 rounded-2xl">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 text-[#06392F] hover:bg-white hover:text-[#C75B39] rounded-xl transition-all hover:shadow-sm"
            type="button"
            aria-label="Decrease quantity"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <span className="w-14 text-lg font-black text-[#06392F] text-center">
            {quantity}
          </span>
          
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 text-[#06392F] hover:bg-white hover:text-[#C75B39] rounded-xl transition-all hover:shadow-sm"
            type="button"
            aria-label="Increase quantity"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleAddToCart}
          className={cn(
            "flex items-center justify-center gap-3 py-5 px-8 rounded-[1.5rem] font-bold text-lg transition-all",
            "bg-[#06392F] text-white hover:bg-[#0a4d40] shadow-xl hover:shadow-2xl active:scale-95"
          )}
        >
          <ShoppingCart className="w-6 h-6" />
          Add to Cart
        </button>
        
        <button
          onClick={handleBuyNow}
          className={cn(
            "flex items-center justify-center gap-3 py-5 px-8 rounded-[1.5rem] font-bold text-lg transition-all",
            "border-2 border-[#C75B39] text-[#C75B39] hover:bg-[#C75B39] hover:text-white active:scale-95"
          )}
        >
          <CreditCard className="w-6 h-6" />
          Buy It Now
        </button>
      </div>

      {/* Trust Badges placeholder */}
      <p className="text-[11px] text-gray-400 text-center font-medium">
        Secure transaction guaranteed via Asham ACDL SecurePay
      </p>
    </div>
  );
}