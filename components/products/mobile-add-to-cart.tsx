'use client';

import { ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface Props {
  product: Product;
  price: string;
}

export function MobileAddToCart({ product, price }: Props) {
  const { addItem } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-xl md:hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase">
            Price
          </p>
          <p className="text-lg font-black text-[#06392F]">{price}</p>
        </div>

        <Button
          onClick={() =>
            addItem(
              {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.image_url,
              },
              1
            )
          }
          className="flex items-center gap-2 bg-[#06392F] text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
