'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Package,
  Plus,
  Tag,
  ArrowUpRight,
  Eye,
  Copy,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';

import { Product } from '@/types/products';
import { useCartStore } from '@/store/cart-store';
import { useUIStore } from '@/store/ui-store';
import { useCompareStore } from '@/store/compare-store';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface ExtendedProduct extends Product {
  stock: number;
  original_price?: number;
  slug: string;
}

/* ----------------------------- Utils ----------------------------- */

const STORAGE_KEY = 'asham_recent_viewed';

const trackRecentlyViewed = (product: ExtendedProduct) => {
  if (typeof window === 'undefined') return;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const items: any[] = saved ? JSON.parse(saved) : [];

    const updated = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        featured_image_url: product.image_url,
        category: product.category,
        slug: product.slug,
      },
      ...items.filter(i => i.id !== product.id),
    ].slice(0, 4);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* silent fail */
  }
};

/* --------------------------- Component ---------------------------- */

export function ProductCard({ product }: { product: ExtendedProduct }) {
  const { addItem } = useCartStore();
  const { openCart, openQuickView } = useUIStore();
  const { addToCompare, items: compareItems } = useCompareStore();

  const isOutOfStock = product.stock <= 0;
  const hasDiscount =
    product.original_price && product.original_price > product.price;

  const isComparing = compareItems.some(i => i.id === product.id);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.original_price! - product.price) /
          product.original_price!) *
          100
      )
    : 0;

  /* ------------------------- Handlers -------------------------- */

  const handleProductClick = useCallback(() => {
    trackRecentlyViewed(product);
  }, [product]);

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      trackRecentlyViewed(product);
      openQuickView(product);
    },
    [openQuickView, product]
  );

  const handleCompare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (compareItems.length >= 4 && !isComparing) {
        toast.error('You can compare up to 4 items.');
        return;
      }

      addToCompare(product);

      if (!isComparing) {
        toast.success(`${product.name} added to comparison`);
      }
    },
    [addToCompare, compareItems.length, isComparing, product]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock) {
        toast.error('Out of stock');
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
    },
    [addItem, openCart, product, isOutOfStock]
  );

  /* --------------------------- Render ---------------------------- */

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={handleProductClick}
      aria-disabled={isOutOfStock}
      className={cn(
        'group relative block rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-500',
        'hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,57,47,0.15)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C75B39]',
        isOutOfStock && 'opacity-70'
      )}
    >
      {/* IMAGE */}
      <div className="relative m-2 aspect-square overflow-hidden rounded-[2rem] bg-gray-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority={false}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform transition-transition-duration-[1200ms] ease-out',
              'group-hover:scale-110',
              isOutOfStock && 'grayscale'
            )}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-200">
            <Package size={60} strokeWidth={1} />
          </div>
        )}

        {/* BADGES */}
        <div className="absolute z-20 flex flex-col gap-2 left-4 top-4">
          {hasDiscount && !isOutOfStock && (
            <span className="flex items-center gap-1 rounded-full bg-[#C75B39] px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
              <Tag size={10} /> {discountPercentage}% OFF
            </span>
          )}

          {isOutOfStock && (
            <span className="rounded-full bg-gray-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-tight text-white">
              Out of stock
            </span>
          )}
        </div>

        {/* ACTION ICONS */}
        <div className="absolute z-20 flex flex-col gap-2 transition-all duration-300 translate-x-6 opacity-0 right-4 top-4 group-hover:opacity-100 group-hover:translate-x-0">
          <IconButton
            label="Quick view"
            onClick={handleQuickView}
          >
            <Eye size={16} />
          </IconButton>

          <IconButton
            label="Compare"
            active={isComparing}
            onClick={handleCompare}
          >
            <Copy size={16} />
          </IconButton>
        </div>

        {/* QUICK ADD (DESKTOP) */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 z-20 hidden rounded-2xl bg-[#C75B39] p-4 text-white shadow-2xl transition-all hover:bg-[#06392F] md:flex opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
            aria-label="Add to cart"
          >
            <Plus size={22} />
          </button>
        )}

        {/* HOVER INDICATOR */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 pointer-events-none bg-black/5 group-hover:opacity-100">
          <div className="p-3 transition-transform duration-500 scale-50 rounded-full shadow-xl bg-white/90 backdrop-blur-sm group-hover:scale-100">
            <ArrowUpRight className="text-[#06392F]" size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <span className="text-[9px] font-black tracking-[0.3em] text-[#C75B39]/70 uppercase">
          {product.category}
        </span>

        <h3 className="mt-1 truncate text-xl font-black text-[#06392F] transition-colors group-hover:text-[#C75B39]">
          {product.name}
        </h3>

        <div className="flex items-end justify-between pt-4 mt-4 border-t border-gray-50">
          <div>
            {hasDiscount && (
              <span className="block text-xs font-bold text-gray-300 line-through">
                {formatCurrency(product.original_price!)}
              </span>
            )}
            <span className="text-2xl font-black tracking-tight text-[#06392F]">
              {formatCurrency(product.price)}
            </span>
          </div>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="rounded-xl bg-[#06392F] p-3 text-white transition active:scale-90 md:hidden"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

/* -------------------------- Sub UI -------------------------- */

function IconButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'rounded-full p-3 shadow-xl transition-colors',
        active
          ? 'bg-[#C75B39] text-white'
          : 'bg-white text-[#06392F] hover:bg-[#06392F] hover:text-white'
      )}
    >
      {children}
    </button>
  );
}
