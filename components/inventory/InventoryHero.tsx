'use client';

import { Search, X, Box, Ruler, HardHat } from 'lucide-react';

export default function InventoryHero({ searchTerm, setSearchTerm }: any) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-[#06392F]">
      {/* Background Image with Professional Mask */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2062&auto=format&fit=crop" 
          alt="Architectural Framework"
          className="object-cover w-full h-full scale-110 opacity-50 animate-subtle-zoom"
        />
        {/* The 'Luxury' Gradient - transitions from your deep green to a transparent view */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06392F]/90 via-[#06392F]/60 to-[#F9FAFB]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Subtle Tagline */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[1px] w-8 bg-[#C75B39]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C75B39]">
            The Builder's Resource
          </span>
          <span className="h-[1px] w-8 bg-[#C75B39]" />
        </div>

        {/* REIMAGINED TEXT STYLE */}
        <h1 className="mb-12 text-6xl tracking-tighter text-white font-extralight md:text-9xl">
          Asham <br className="md:hidden" />
          <span className="font-serif italic text-[#C75B39]">Inventory</span>
          <span className="font-black text-white/20">.</span>
        </h1>

        {/* Elevated Search Bar */}
        <div className="relative w-full max-w-3xl group">
          <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#C75B39] to-[#06392F] opacity-20 blur transition duration-1000 group-focus-within:opacity-40" />
          <div className="relative flex items-center bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-center pl-8">
              <Search className="text-gray-400 group-focus-within:text-[#C75B39] transition-colors" size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search premium materials or modern house plans..." 
              className="w-full px-6 text-lg text-gray-900 outline-none py-7 placeholder:text-gray-400 placeholder:italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="pr-8 text-gray-400 transition-colors hover:text-red-500"
                title="Clear search"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats / Trust Signals */}
        <div className="items-center hidden gap-12 mt-12 md:flex text-white/60">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-[#C75B39]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">5k+ SKUs</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler size={16} className="text-[#C75B39]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <HardHat size={16} className="text-[#C75B39]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">NCA Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}