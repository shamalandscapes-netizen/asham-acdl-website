'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

export function ProductPurchase({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="p-3 border rounded-xl"
        >
          <Minus size={14} />
        </button>

        <span className="w-8 text-lg font-black text-center">{qty}</span>

        <button
          onClick={() => setQty(qty + 1)}
          className="p-3 border rounded-xl"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Add to Cart */}
      <Button
        onClick={() =>
          addItem(
            {
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.image_url,
            },
            qty
          )
        }
        className="w-full py-5 bg-[#06392F] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
      >
        Add to Cart
      </Button>
    </div>
  );
}
