'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
  Package,
} from 'lucide-react';

interface CartItemProps {
  item: {
    id: string; // cart row ID
    quantity: number;
    product: {
      id: string;
      slug: string;
      name: string;
      price: number;
      image_url?: string | null;
      category: string;
      stock: number;
    };
  };
  isUpdating: boolean;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  isUpdating,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;
  const isMaxStock =
    product.stock > 0 && quantity >= product.stock;

  return (
    <div className="flex flex-col gap-6 p-4 transition-all bg-white border border-gray-200 shadow-sm rounded-xl sm:flex-row hover:border-gray-300">
      {/* PRODUCT IMAGE */}
      <Link
        href={`/products/${product.slug}`}
        className="relative flex items-center justify-center w-full h-24 overflow-hidden bg-gray-100 rounded-lg shrink-0 sm:w-24 group"
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Package size={32} className="text-gray-300" />
        )}
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="flex-1 text-center sm:text-left">
        <Link
          href={`/products/${product.slug}`}
          className="block text-lg font-bold text-gray-800 hover:text-[#06392F] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <span className="block mb-1 text-xs tracking-wide text-gray-500 uppercase">
          {product.category}
        </span>

        <p className="text-sm font-medium text-gray-600">
          Unit Price:{' '}
          <span className="text-[#C75B39] font-bold">
            KES {product.price.toLocaleString()}
          </span>
        </p>
      </div>

      {/* QUANTITY CONTROLS */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 p-1 border border-gray-100 rounded-lg bg-gray-50">
          <button
            type="button"
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            aria-label="Decrease quantity"
            className="flex items-center justify-center w-8 h-8 bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>

          <span
            className="w-8 text-sm font-bold text-center text-gray-700"
            aria-live="polite"
          >
            {isUpdating ? (
              <Loader2
                size={14}
                className="mx-auto animate-spin text-[#06392F]"
              />
            ) : (
              quantity
            )}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(quantity + 1)}
            disabled={isUpdating || isMaxStock}
            aria-label="Increase quantity"
            className="flex items-center justify-center w-8 h-8 bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
        </div>

        {isMaxStock && (
          <span className="text-[10px] font-medium text-orange-600">
            Max stock reached
          </span>
        )}
      </div>

      {/* SUBTOTAL & REMOVE */}
      <div className="flex flex-row items-center justify-between w-full gap-4 pt-4 mt-2 border-t border-gray-100 sm:flex-col sm:items-end sm:w-auto sm:gap-1 sm:mt-0 sm:pt-0 sm:border-0">
        <div className="text-right">
          <span className="block text-xs text-gray-400 sm:hidden">
            Total
          </span>
          <span className="text-lg font-bold text-gray-900">
            KES {lineTotal.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={isUpdating}
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 transition-colors rounded hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={14} />
          Remove
        </button>
      </div>
    </div>
  );
}
