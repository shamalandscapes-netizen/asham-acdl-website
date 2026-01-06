'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, FileText, Package, Plus, Tag, ArrowUpRight, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Product } from '@/types/products';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface ExtendedProduct extends Product {
  stock: number; 
  original_price?: number;
  slug: string;
}

/**
 * EXPERT HELPER: Track recently viewed products in LocalStorage
 */
const trackRecentlyViewed = (product: ExtendedProduct) => {
  if (typeof window === 'undefined') return;
  
  const STORAGE_KEY = 'asham_recent_viewed';
  const saved = localStorage.getItem(STORAGE_KEY);
  let items = saved ? JSON.parse(saved) : [];
  
  // Remove duplicate if it exists to bring it to the front
  items = items.filter((i: any) => i.id !== product.id);
  
  // Add current product to the start of the array
  items.unshift({
    id: product.id,
    name: product.name,
    price: product.price,
    featured_image_url: product.image_url, // Matching the search overlay key
    category: product.category,
    slug: product.slug
  });
  
  // Limit to 4 most recent items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 4)));
};

export function ProductCard({ product }: { product: ExtendedProduct }) {
  const { addItem } = useCartStore();
  const { openCart, openQuickView } = useUIStore(); // Added openQuickView from store

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100) 
    : 0;

  // Track when clicking to the product page
  const handleProductClick = () => {
    trackRecentlyViewed(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackRecentlyViewed(product);
    openQuickView(product);
  };

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
      href={`/products/${product.slug}?id=${product.id}`}
      onClick={handleProductClick} // Trigger on click
      className={cn(
        "group relative block bg-white border border-gray-100 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(6,57,47,0.15)] hover:-translate-y-2",
        isOutOfStock && "grayscale"
      )}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square overflow-hidden m-2 bg-gray-50 rounded-[2rem]">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-200">
            <Package size={60} strokeWidth={1} />
          </div>
        )}

        {/* TOP BADGES */}
        <div className="absolute flex flex-col gap-2 top-4 left-4">
          {hasDiscount && !isOutOfStock && (
            <div className="bg-[#C75B39] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              <Tag size={10} /> {discountPercentage}% OFF
            </div>
          )}
          <div className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md border",
            product.is_digital 
              ? "bg-blue-500/10 text-blue-600 border-blue-200" 
              : "bg-[#06392F]/5 text-[#06392F] border-[#06392F]/10"
          )}>
            {product.is_digital ? "Design Plan" : "Material"}
          </div>
        </div>

        {/* QUICK VIEW BUTTON */}
        {!isOutOfStock && (
          <button 
            type="button"
            onClick={handleQuickView}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#06392F] p-3 rounded-full shadow-xl opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hover:bg-[#06392F] hover:text-white z-10 hidden md:flex"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* QUICK ADD BUTTON (Desktop) */}
        {!isOutOfStock && (
          <button 
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-[#C75B39] text-white p-4 rounded-2xl shadow-2xl opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#06392F] z-10 hidden md:flex"
            title="Add to cart"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* VIEW DETAILS OVERLAY */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/5 group-hover:opacity-100">
             <div className="p-3 transition-transform duration-500 scale-50 rounded-full shadow-xl bg-white/90 backdrop-blur-sm group-hover:scale-100">
                <ArrowUpRight size={20} className="text-[#06392F]" />
             </div>
        </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="p-6">
        <div className="mb-4">
          <span className="text-[9px] font-black tracking-[0.3em] text-[#C75B39] uppercase opacity-70">
            {product.category}
          </span>
          <h3 className="text-xl font-black text-[#06392F] leading-tight mt-1 truncate group-hover:text-[#C75B39] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs font-bold text-gray-300 line-through">
                {formatCurrency(product.original_price!)}
              </span>
            )}
            <span className="text-2xl font-black text-[#06392F] tracking-tighter">
              {formatCurrency(product.price)}
            </span>
          </div>

          {!isOutOfStock && (
            <button 
              type="button"
              onClick={handleAddToCart}
              className="md:hidden bg-[#06392F] text-white p-3 rounded-xl active:scale-90 transition-transform"
              title="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}

          {isOutOfStock && (
            <span className="text-[10px] font-black text-gray-400 uppercase italic">
              Restocking Soon
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}