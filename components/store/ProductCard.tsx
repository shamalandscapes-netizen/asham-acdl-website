'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Globe, FileText, Plus, Flame, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  stock_quantity?: number;
  sales_count?: number; 
  is_digital?: boolean | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const categorySlug = (product.category || 'general')
    .toLowerCase()
    .trim()
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const currentStock = product.stock ?? product.stock_quantity ?? 0;
  const isOutOfStock = currentStock <= 0 && !product.is_digital;
  const isLowStock = currentStock > 0 && currentStock < 10 && !product.is_digital;
  const isTopSale = (product.sales_count || 0) > 50;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('Item is currently out of stock');
      return;
    }

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
      aria-label={`View details for ${product.name}`} // ✅ Accessibility fix for Link
      className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#C75B39]/30 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative flex items-center justify-center h-64 overflow-hidden border-b bg-gray-50 border-gray-50">
        
        {/* Badges Overlay */}
        <div className="absolute z-10 flex flex-col gap-2 top-4 left-4">
          {isTopSale && (
            <div className="bg-gradient-to-r from-[#C75B39] to-[#E88D67] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1 animate-pulse">
              <Flame size={12} fill="currentColor" /> Top Sale
            </div>
          )}
          
          {isOutOfStock ? (
            <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
              Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle size={10} /> Limited Stock
            </div>
          ) : product.is_digital ? (
            <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
              <Globe size={10} /> Digital Plan
            </div>
          ) : null}
        </div>

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            type="button" // ✅ Explicit button type
            title={`Add ${product.name} to cart`} // ✅ Added title for mouse hover
            aria-label={`Add ${product.name} to cart`} // ✅ Added aria-label for screen readers
            className="absolute z-20 bottom-4 right-4 p-3 bg-[#C75B39] text-white rounded-xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#06392F]"
          >
            <Plus size={20} />
          </button>
        )}

        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-200">
            {product.is_digital ? <FileText size={48} /> : <ShoppingBag size={48} />}
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">No Preview</span>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#C75B39] uppercase">
          {product.category}
        </div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-3 leading-tight group-hover:text-[#06392F] transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between pt-5 mt-auto border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
            <span className="text-xl font-black tracking-tight text-gray-900">
              KES {product.price.toLocaleString()}
            </span>
          </div>
          
          <div 
            aria-hidden="true" // ✅ Arrow is purely decorative, Link already has label
            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#06392F] group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-500 shadow-sm"
          >
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}