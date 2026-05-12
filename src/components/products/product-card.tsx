'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Package,
  Plus,
  Tag,
  ArrowUpRight,
  Eye,
  Copy,
  Ruler,
  Weight,
  CheckCircle2,
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
  unit?: string;
  specs?: string[];
}

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
      ...items.filter((i) => i.id !== product.id),
    ].slice(0, 4);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* silent fail */
  }
};

export function ProductCard({ product }: { product: ExtendedProduct }) {
  const { addItem } = useCartStore();
  const { openCart, openQuickView } = useUIStore();
  const { addToCompare, items: compareItems } = useCompareStore();

  const isOutOfStock = product.stock <= 0;
  const hasDiscount =
    product.original_price && product.original_price > product.price;
  const isComparing = compareItems.some((i) => i.id === product.id);

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.original_price! - product.price) / product.original_price!) *
          100
      )
    : 0;

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

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={handleProductClick}
      aria-disabled={isOutOfStock}
      className={cn(
        'group relative block bg-white rounded-2xl border border-[#06392F]/5 overflow-hidden',
        'transition-all duration-500 hover:shadow-[0_12px_40px_-12px_rgba(6,57,47,0.2)]',
        'hover:border-[#06392F]/10',
        isOutOfStock && 'opacity-60'
      )}
    >
      {/* IMAGE AREA */}
      <div className="relative aspect-square bg-[#F8F6F3] overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            priority={false}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform duration-700 ease-out',
              'group-hover:scale-105',
              isOutOfStock && 'grayscale'
            )}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[#06392F]/10">
            <Package size={48} strokeWidth={1} />
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Discount badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C75B39] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Tag size={10} />
              {discountPercentage}% Off
            </span>
          </div>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Unavailable
            </span>
          </div>
        )}

        {/* Action buttons - appear on hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ActionButton label="Quick view" onClick={handleQuickView}>
            <Eye size={14} />
          </ActionButton>
          <ActionButton
            label="Compare"
            active={isComparing}
            onClick={handleCompare}
          >
            <Copy size={14} />
          </ActionButton>
        </div>

        {/* Quick add - bottom right */}
        {!isOutOfStock && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-[#06392F] text-xs font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-[#06392F] hover:text-white"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        )}

        {/* Stock indicator */}
        {!isOutOfStock && product.stock <= 10 && (
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-medium text-[#C75B39] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* Category + availability */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C75B39]/70">
            {product.category}
          </span>
          {!isOutOfStock && (
            <span className="flex items-center gap-1 text-[10px] text-[#06392F]/30">
              <CheckCircle2 size={10} />
              In Stock
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-semibold text-[#06392F] leading-snug group-hover:text-[#C75B39] transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Specs row */}
        {(product.unit || product.specs) && (
          <div className="flex items-center gap-3 mt-3">
            {product.unit && (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#06392F]/40 bg-[#F8F6F3] px-2 py-1 rounded-md">
                <Ruler size={10} />
                {product.unit}
              </span>
            )}
            {product.specs?.[0] && (
              <span className="inline-flex items-center gap-1 text-[10px] text-[#06392F]/40 bg-[#F8F6F3] px-2 py-1 rounded-md">
                <Weight size={10} />
                {product.specs[0]}
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#06392F]/5">
          <div>
            {hasDiscount && (
              <span className="block text-xs text-[#06392F]/20 line-through mb-0.5">
                {formatCurrency(product.original_price!)}
              </span>
            )}
            <span className="text-xl font-light text-[#06392F] tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Mobile cart button */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[#06392F] text-white active:scale-90 transition-transform"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

/* Sub-component */
function ActionButton({
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
        'w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200',
        active
          ? 'bg-[#C75B39] text-white'
          : 'bg-white/90 backdrop-blur-sm text-[#06392F] hover:bg-[#06392F] hover:text-white'
      )}
    >
      {children}
    </button>
  );
}