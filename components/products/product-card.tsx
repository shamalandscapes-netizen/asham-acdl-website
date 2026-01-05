'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, FileText, Package, Plus, AlertCircle, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Product } from '@/types/products';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

// ✅ Fix: Ensure the interface includes stock and original_price
interface ExtendedProduct extends Product {
  stock: number; 
  original_price?: number; 
}

export function ProductCard({ product }: { product: ExtendedProduct }) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const categorySlug = product.category?.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') || 'all';
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  // Discount Logic
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (isOutOfStock) return toast.error('Out of stock');

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      is_digital: product.is_digital || false,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart`);
    openCart(); 
  };

  return (
    <Link 
      href={`/products/${categorySlug}/${product.id}`}
      aria-label={`View details for ${product.name}`}
      className={cn(
        "group block overflow-hidden transition-all duration-500 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2",
        isOutOfStock && "opacity-75 grayscale-[0.5]"
      )}
    >
      <div className="relative w-full overflow-hidden bg-gray-50 aspect-square rounded-t-[2.5rem]">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-300 bg-gray-100">
            <Package size={48} />
          </div>
        )}

        {/* ✅ Fix: Added type, title, and aria-label for accessibility */}
        {!isOutOfStock && (
          <button 
            type="button"
            title={`Add ${product.name} to cart`}
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart} 
            className="absolute bottom-5 right-5 p-4 bg-[#C75B39] text-white rounded-2xl shadow-xl opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#06392F] hidden md:flex"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* BADGES */}
        <div className="absolute flex flex-col gap-2 top-5 left-5">
          {hasDiscount && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black text-white bg-red-600 rounded-full shadow-lg">
              <Tag className="w-3 h-3" /> {discountPercentage}% OFF
            </span>
          )}

          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase text-white bg-gray-500 rounded-full shadow-lg">
              <AlertCircle className="w-3 h-3" /> Out of Stock
            </span>
          ) : (
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full backdrop-blur-md border shadow-sm",
              product.is_digital ? "text-blue-800 bg-blue-100/90 border-blue-200" : "text-[#C75B39] bg-orange-50/90 border-orange-200"
            )}>
              {product.is_digital ? <FileText className="w-3 h-3" /> : <Package className="w-3 h-3" />}
              {product.is_digital ? 'Digital Plan' : 'Material'}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">{product.category}</p>
          <h3 className="text-lg font-bold text-[#06392F] line-clamp-1 group-hover:text-[#C75B39] transition-colors">{product.name}</h3>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
             <span className="text-xs font-bold text-gray-400">Price</span>
             <div className="flex items-center gap-2">
               <span className="text-xl font-black text-[#06392F]">{formatCurrency(product.price)}</span>
               {hasDiscount && (
                 <span className="text-xs font-bold text-gray-400 line-through">
                   {formatCurrency(product.original_price!)}
                 </span>
               )}
             </div>
          </div>

          {/* ✅ Fix: Added type, title, and aria-label for mobile button */}
          {!isOutOfStock && (
            <button 
              type="button"
              title={`Add ${product.name} to cart`}
              aria-label={`Add ${product.name} to cart`}
              onClick={handleAddToCart} 
              className="p-3.5 rounded-2xl bg-[#06392F]/5 text-[#06392F] hover:bg-[#C75B39] hover:text-white md:hidden"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}