'use client';

import { useUIStore } from '@/store/ui-store';
import { X, Check, Minus } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatters';

export function CompareModal() {
  const { isCompareModalOpen, closeCompareModal, compareItems, removeFromCompare } = useUIStore();

  if (!isCompareModalOpen) return null;

  // Extract all unique technical keys from the items to build the rows
  // This assumes technical specs are stored in a 'metadata' or 'specs' object
  const techKeys = Array.from(
    new Set(
      compareItems.flatMap((item) => Object.keys(item.metadata || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#06392F]/90 backdrop-blur-md" 
        onClick={closeCompareModal} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-[#06392F] uppercase tracking-tighter">Technical Comparison</h2>
            <p className="text-sm font-medium text-gray-500">Analyze material specifications side-by-side</p>
          </div>
          <button 
            onClick={closeCompareModal}
            className="p-3 transition-colors rounded-full hover:bg-gray-100"
            title="Close comparison modal"
            aria-label="Close comparison modal"
          >
            <X className="w-6 h-6 text-[#06392F]" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-8 min-w-[200px] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Specifications</th>
                {compareItems.map((item) => (
                  <th key={item.id} className="p-8 min-w-[280px] border-l border-gray-100">
                    <div className="relative w-24 h-24 mb-4 overflow-hidden bg-gray-100 shadow-sm rounded-2xl">
                      <Image 
                        src={item.image_url || item.featured_image_url || '/placeholder.png'} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-black text-[#06392F] uppercase text-sm mb-1 leading-tight">{item.name}</h3>
                    <p className="text-[#C75B39] font-black text-lg">{formatCurrency(item.price)}</p>
                    <button 
                      onClick={() => removeFromCompare(item.id)}
                      className="mt-4 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove Item
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Category Row */}
              <tr>
                <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Industry Category</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-6 border-l border-gray-100 text-sm font-bold text-[#06392F]">
                    {item.category}
                  </td>
                ))}
              </tr>

              {/* Dynamic Technical Rows */}
              {techKeys.map((key) => (
                <tr key={key} className="transition-colors hover:bg-gray-50/50">
                  <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {key.replace('_', ' ')}
                  </td>
                  {compareItems.map((item) => (
                    <td key={item.id} className="p-6 text-sm font-medium text-gray-600 border-l border-gray-100">
                      {item.metadata?.[key] || <Minus className="w-4 h-4 text-gray-200" />}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Stock Status Row */}
              <tr>
                <td className="p-6 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Availability</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-6 border-l border-gray-100">
                    {item.stock > 0 ? (
                      <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase">
                        <Check className="w-4 h-4" /> In Stock
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase">
                        <X className="w-4 h-4" /> Out of Stock
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-gray-50">
          <button 
            onClick={closeCompareModal}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#06392F] transition-colors"
          >
            Close Comparison
          </button>
          <button 
            className="px-8 py-4 bg-[#06392F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all shadow-xl"
            onClick={() => {
              // Logic to add all to cart or similar
            }}
          >
            Add Selected to Project
          </button>
        </div>
      </div>
    </div>
  );
}