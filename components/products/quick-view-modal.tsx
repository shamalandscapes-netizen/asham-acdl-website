'use client';

import { useUIStore } from '@/store/ui-store';
import { useCartStore } from '@/store/cart-store';
import { X, ShoppingBag, Check, Shield } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function QuickViewModal() {
  const { isQuickViewOpen, selectedProduct, closeQuickView } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);

  if (!isQuickViewOpen || !selectedProduct) return null;

  const handleAddToCart = () => {
    addItem(selectedProduct);
    toast.success(`${selectedProduct.name} added to manifest`);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-[#06392F]/40 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={closeQuickView} 
      />
      
      {/* Content Container */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={closeQuickView}
          title="Close Preview"
          aria-label="Close Preview"
          className="absolute z-20 p-2 transition-all border border-gray-100 rounded-full shadow-sm top-6 right-6 bg-white/80 backdrop-blur-md hover:bg-white hover:scale-110"
        >
          <X className="w-5 h-5 text-[#06392F]" />
        </button>

        {/* Product Visual Area */}
        <div className="relative w-full lg:w-[55%] h-80 lg:h-auto bg-[#F9F9F9]">
          {selectedProduct.image_url ? (
            <Image 
              src={selectedProduct.image_url} 
              alt={selectedProduct.name}
              fill
              className="object-contain p-12"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[#06392F]/20 font-black uppercase tracking-widest">No Image Available</div>
          )}
        </div>

        {/* Product Details Area */}
        <div className="w-full lg:w-[45%] p-8 lg:p-12 overflow-y-auto flex flex-col bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#06392F]/5 text-[#06392F] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#06392F]/10">
                {selectedProduct.category || 'Structural Material'}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                <Shield className="w-3 h-3" /> NCA Certified
              </span>
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tighter text-[#06392F] mb-2 leading-[0.9]">
              {selectedProduct.name}
            </h2>
            
            <p className="text-3xl font-light text-[#C75B39] mb-8">
              {formatCurrency(selectedProduct.price)}
            </p>
            
            <div className="space-y-6">
              <div className="font-medium leading-relaxed prose-sm prose text-gray-600">
                {selectedProduct.description || "High-durability structural material sourced for Asham Design Construction projects. Meets all regional safety standards for Kenya and Uganda."}
              </div>

              <div className="grid grid-cols-1 gap-3 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <Check className="w-4 h-4 text-[#06392F]" /> Logistics-ready for site delivery
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <Check className="w-4 h-4 text-[#06392F]" /> Bulk pricing available
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            title={`Add ${selectedProduct.name} to Cart`}
            className="mt-8 w-full py-5 bg-[#06392F] text-white font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-4 hover:bg-[#042a22] transition-all shadow-xl active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Manifest
          </button>
        </div>
      </div>
    </div>
  );
}