'use client';

import { useUIStore } from '@/store/ui-store';
import { X, Check, Minus, ShoppingCart, Info } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

export function CompareModal() {
  const { isCompareModalOpen, closeCompareModal, compareItems, removeFromCompare } = useUIStore();

  if (!isCompareModalOpen) return null;

  // Extract unique technical keys
  const techKeys = Array.from(
    new Set(
      compareItems.flatMap((item) => Object.keys(item.metadata || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#06392F]/80 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={closeCompareModal} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-gray-100 md:p-8 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#06392F] flex items-center justify-center text-white shadow-lg shadow-[#06392F]/20">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter leading-none mb-1">Specification Matrix</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comparing {compareItems.length} Professional Materials</p>
            </div>
          </div>
          <button 
            onClick={closeCompareModal}
            className="p-4 transition-all rounded-2xl bg-gray-50 text-[#06392F] hover:bg-red-50 hover:text-red-600 group"
          >
            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Scrollable Comparison Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="sticky top-0 z-10 p-8 w-64 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50/80 backdrop-blur-sm">Attribute</th>
                {compareItems.map((item) => (
                  <th key={item.id} className="sticky top-0 z-10 p-8 min-w-[300px] border-l border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="relative w-full aspect-video mb-6 overflow-hidden bg-gray-100 rounded-[1.5rem] shadow-md group">
                      <Image 
                        src={item.image_url || item.featured_image_url || '/placeholder.png'} 
                        alt={item.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-black text-[#06392F] uppercase text-sm mb-1 leading-tight line-clamp-2 min-h-[2.5rem]">{item.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                        <p className="text-[#C75B39] font-black text-xl tracking-tighter">{formatCurrency(item.price)}</p>
                        <button 
                          onClick={() => removeFromCompare(item.id)}
                          className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors py-1 border-b border-transparent hover:border-red-500"
                        >
                          Dismiss
                        </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Industry Category */}
              <tr className="transition-colors hover:bg-gray-50/30">
                <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Category</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-6 border-l border-gray-100">
                    <span className="inline-block px-3 py-1 bg-[#06392F]/5 text-[#06392F] rounded-lg text-[10px] font-black uppercase">
                        {item.category}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Technical Spec Rows */}
              {techKeys.map((key) => (
                <tr key={key} className="transition-colors hover:bg-gray-50/80 group">
                  <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50/30">
                    {key.replace('_', ' ')}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 text-sm font-bold text-[#06392F] border-l border-gray-100">
                      {item.metadata?.[key] ? (
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#C75B39]/30" />
                           {item.metadata[key]}
                        </div>
                      ) : (
                        <Minus className="w-4 h-4 text-gray-200" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Status Row */}
              <tr className="transition-colors hover:bg-gray-50/30">
                <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Logistics Status</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-6 border-l border-gray-100">
                    {item.stock > 0 ? (
                      <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <Check className="w-3 h-3 stroke-[4]" /> Ready to Ship
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 w-fit px-3 py-1 rounded-full">
                        <X className="w-3 h-3 stroke-[4]" /> Out of Stock
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center justify-between gap-4 p-8 border-t border-gray-100 sm:flex-row bg-gray-50/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            * Technical data provided by Asham Verified Suppliers
          </p>
          <div className="flex items-center w-full gap-4 sm:w-auto">
            <button 
              onClick={closeCompareModal}
              className="flex-1 sm:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#06392F] hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-200"
            >
              Exit View
            </button>
            <button 
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-[#06392F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all shadow-[0_10px_20px_rgba(6,57,47,0.2)] active:scale-95"
            >
              <ShoppingCart size={16} /> Procure Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}