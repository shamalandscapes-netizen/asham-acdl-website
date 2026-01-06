'use client';

import { useUIStore } from '@/store/ui-store';
import { X, ArrowRightLeft, Trash2 } from 'lucide-react';
import Image from 'next/image';

export function CompareBar() {
  const { compareItems, removeFromCompare, openCompareModal, clearCompare } = useUIStore();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#06392F] text-white rounded-[2rem] p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
        
        {/* Left Section: Thumbnails */}
        <div className="flex items-center gap-4">
          <div className="bg-[#C75B39] p-3 rounded-2xl hidden sm:flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex -space-x-3 overflow-hidden">
            {compareItems.map((item) => (
              <div 
                key={item.id} 
                className="relative w-12 h-12 rounded-xl border-2 border-[#06392F] bg-white overflow-hidden group transition-transform hover:z-10 hover:scale-110"
              >
                <Image 
                  src={item.image_url || item.featured_image_url || '/placeholder.png'} 
                  alt={item.name} 
                  fill 
                  className="object-cover" 
                />
                <button 
                  onClick={() => removeFromCompare(item.id)}
                  type="button"
                  aria-label={`Remove ${item.name} from comparison`}
                  title={`Remove ${item.name}`}
                  className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-red-600/90 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col ml-2">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
              {compareItems.length} / 3 Items
            </p>
            <button 
              onClick={clearCompare}
              className="text-[8px] font-bold uppercase tracking-tighter text-white/40 hover:text-red-400 transition-colors text-left mt-1"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Right Section: Action */}
        <button 
          onClick={openCompareModal}
          disabled={compareItems.length < 2}
          className="bg-white text-[#06392F] px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
        >
          {compareItems.length < 2 ? 'Add 1 more to compare' : 'Compare Specifications'}
        </button>
      </div>
    </div>
  );
}