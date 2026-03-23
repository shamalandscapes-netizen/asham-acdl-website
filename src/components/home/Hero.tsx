'use client';

import Link from 'next/link';
import { ArrowRight, Ruler, HardHat, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-[#06392F]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Modern Commercial Architecture"
          className="object-cover w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06392F] via-[#06392F]/80 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center h-full px-6 pt-20 pb-16 mx-auto max-w-7xl md:px-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-10 bg-[#C75B39]" />
            <span className="text-xs font-bold tracking-[0.5em] text-[#C75B39] uppercase">The Blueprint for Kenya</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light text-white leading-[0.95] tracking-tighter mb-8">
            Asham <br />
            <span className="font-black italic text-[#C75B39]">Supply & Design.</span>
          </h1>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* LINKED TO SHOP */}
            <Link href="/products" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-[#C75B39] px-10 py-6 text-white font-black rounded-2xl transition-all hover:bg-[#A84A2D] hover:-translate-y-1 shadow-2xl">
                Explore Shop
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
            </Link>
            
            <Link href="/services" className="w-full sm:w-auto">
              <button className="flex items-center justify-center w-full gap-4 px-10 py-6 font-bold text-white transition-all border-2 sm:w-auto border-white/20 backdrop-blur-md bg-white/5 rounded-2xl hover:bg-white/10">
                Architectural Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}