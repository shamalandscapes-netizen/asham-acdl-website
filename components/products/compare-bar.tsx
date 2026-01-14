'use client';

import { useUIStore } from '@/store/ui-store';
import { X, ArrowRightLeft, Trash2, Info } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function CompareBar() {
  const { 
    compareItems, 
    removeFromCompare, 
    openCompareModal, 
    clearCompare 
  } = useUIStore();

  // Only show if there are items to compare
  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[95%] max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#06392F] text-white rounded-[2.5rem] p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row items-center justify-between border border-white/10 backdrop-blur-xl gap-4 sm:gap-0">
        
        {/* Left Section: Thumbnails & Count */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center justify-center p-3 bg-[#C75B39] rounded-2xl sm:flex shadow-inner">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex -space-x-3 overflow-hidden">
            {compareItems.map((item) => (
              <div 
                key={item.id} 
                className="relative w-12 h-12 rounded-2xl border-2 border-[#06392F] bg-white overflow-hidden group transition-all duration-300 hover:z-10 hover:scale-110 shadow-lg"
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
                  className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-red-600/90 group-hover:opacity-100"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            
            {/* Placeholder Slots */}
            {[...Array(Math.max(0, 3 - compareItems.length))].map((_, i) => (
              <div 
                key={`empty-${i}`}
                className="flex items-center justify-center w-12 h-12 border-2 border-dashed rounded-2xl border-white/10 bg-white/5"
              >
                <PlusIcon size={12} className="text-white/20" />
              </div>
            ))}
          </div>

          <div className="flex flex-col ml-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C75B39] animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                {compareItems.length} / 3 Items
              </p>
            </div>
            <button 
              onClick={clearCompare}
              className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors text-left mt-1.5 flex items-center gap-1 group"
            >
              <Trash2 size={10} className="transition-transform group-hover:rotate-12" /> Clear List
            </button>
          </div>
        </div>

        {/* Right Section: Action Button */}
        <button 
          onClick={openCompareModal}
          disabled={compareItems.length < 2}
          className={cn(
            "w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
            compareItems.length < 2 
              ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/10" 
              : "bg-white text-[#06392F] hover:bg-[#C75B39] hover:text-white"
          )}
        >
          {compareItems.length < 2 ? (
            <>
              <Info size={14} /> Add 1 more to compare
            </>
          ) : (
            'Compare Specifications'
          )}
        </button>
      </div>
    </div>
  );
}

function PlusIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}