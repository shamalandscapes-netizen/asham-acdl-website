'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, Loader2, Package } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string; // The specific row ID in the cart table
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image_url: string;
      category: string;
      stock: number;
    };
  };
  isUpdating: boolean; // Check if a network request is happening for this item
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({ 
  item, 
  isUpdating, 
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) {
  
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col items-center gap-6 p-4 transition-all bg-white border border-gray-200 shadow-sm rounded-xl sm:flex-row hover:border-gray-300">
      
      {/* 1. PRODUCT IMAGE */}
      <Link 
        href={`/products/${product.category}/${product.id}`} 
        className="flex items-center justify-center w-full h-24 overflow-hidden bg-gray-100 rounded-lg shrink-0 sm:w-24 group"
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        ) : (
          <Package className="text-gray-300" size={32} />
        )}
      </Link>

      {/* 2. PRODUCT DETAILS */}
      <div className="flex-1 w-full text-center sm:text-left">
        <div className="flex flex-col">
          <Link 
            href={`/products/${product.category}/${product.id}`}
            className="font-bold text-gray-800 text-lg hover:text-[#06392F] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <span className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
            {product.category}
          </span>
          <div className="text-sm font-medium text-gray-600">
            Unit Price: <span className="text-[#C75B39]">KES {product.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 3. QUANTITY CONTROLS */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 p-1 border border-gray-100 rounded-lg bg-gray-50">
          <button 
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          
          <span className="w-8 text-sm font-bold text-center text-gray-700">
            {isUpdating ? (
              <Loader2 className="animate-spin mx-auto text-[#06392F]" size={14} />
            ) : (
              quantity
            )}
          </span>
          
          <button 
            onClick={() => onUpdateQuantity(quantity + 1)}
            disabled={isUpdating || (product.stock > 0 && quantity >= product.stock)}
            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#06392F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {product.stock > 0 && quantity >= product.stock && (
          <span className="text-[10px] text-orange-600 font-medium">Max stock reached</span>
        )}
      </div>

      {/* 4. SUBTOTAL & REMOVE */}
      <div className="flex flex-row items-center justify-between w-full gap-4 pt-4 mt-2 border-t border-gray-100 sm:flex-col sm:items-end sm:w-auto sm:gap-1 sm:mt-0 sm:pt-0 sm:border-0">
        <div className="text-right">
          <span className="block text-xs text-gray-400 sm:hidden">Total</span>
          <span className="text-lg font-bold text-gray-900">
            KES {lineTotal.toLocaleString()}
          </span>
        </div>
        
        <button 
          onClick={onRemove}
          disabled={isUpdating}
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 transition-colors rounded hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={14} />
          <span className="sm:inline">Remove</span>
        </button>
      </div>

    </div>
  );
}