'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  Loader2, ArrowLeft, ShieldCheck, Info, FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';

// Import your store
import { useCartStore } from '@/store/cart-store';

export default function CartPage() {
  // Pull actions and state from Zustand
  const { items, removeItem, updateQuantity } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate totals based on Store items
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  // Handle local loading state for quantity buttons to keep UI snappy
  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdating(id);
    updateQuantity(id, newQty);
    // Artificial delay removed for instant feel, but keep state for loader feedback
    setTimeout(() => setUpdating(null), 300);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-[#C75B39]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#06392F] selection:bg-[#C75B39] selection:text-white">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#06392F 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative px-6 py-20 mx-auto max-w-7xl">
        
        {/* STRUCTURAL HEADER */}
        <header className="mb-16 border-l-8 border-[#06392F] pl-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#C75B39]" />
                <p className="text-[#C75B39] font-black text-[10px] uppercase tracking-[0.4em]">Section 01 / Acquisition</p>
              </div>
              <h1 className="text-5xl font-black leading-none tracking-tighter uppercase md:text-7xl">Procurement <br/> Manifest</h1>
            </div>
            <div className="flex items-center gap-6 pb-2">
               <div className="hidden text-right md:block">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Session</p>
                 <p className="text-[10px] font-mono font-bold tracking-tight">STATUS: AUTHENTICATED</p>
               </div>
               <div className="flex items-center gap-3 px-5 py-3 border-2 border-[#06392F] rounded-2xl bg-white shadow-[4px_4px_0px_#06392F]">
                 <ShieldCheck className="text-emerald-600" size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Secured</span>
               </div>
            </div>
          </div>
        </header>

        {items.length === 0 ? (
          <section className="py-40 text-center bg-white border-2 border-[#06392F]/5 rounded-[3rem] shadow-sm">
            <div className="relative inline-block mb-8">
              <ShoppingBag className="text-gray-100" size={120} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus className="text-[#C75B39] animate-bounce" size={40} />
              </div>
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">Manifest is Empty</h2>
            <p className="max-w-md mx-auto mt-4 text-sm italic font-bold leading-relaxed tracking-tight text-gray-400 uppercase">
              No construction assets have been flagged for procurement.
            </p>
            <Link href="/products" className="inline-flex items-center gap-4 mt-12 bg-[#06392F] text-white px-12 py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#C75B39] transition-all rounded-2xl shadow-xl">
              Initialize Sourcing <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* ITEMS LIST */}
            <main className="lg:col-span-8">
              <div className="bg-white border-2 border-[#06392F]/5 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="hidden grid-cols-12 p-6 border-b border-gray-100 md:grid bg-gray-50/50">
                   <div className="col-span-7 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Detail</div>
                   <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Quantity</div>
                   <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Valuation</div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="relative flex flex-col md:grid md:grid-cols-12 items-center gap-6 p-6 group transition-all hover:bg-[#FBFBFB]">
                      
                      {/* Image & Title */}
                      <div className="flex items-center w-full col-span-7 gap-6">
                        <div className="relative w-24 h-24 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group-hover:border-[#C75B39]/30 transition-colors shrink-0">
                          <Image 
                            src={item.image || '/placeholder.png'} 
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block px-2 py-0.5 bg-[#06392F]/5 text-[#C75B39] text-[8px] font-black uppercase tracking-[0.2em] mb-2 rounded">
                            {item.category || 'Standard Asset'}
                          </span>
                          <h3 className="pr-4 text-xl font-black leading-tight tracking-tighter uppercase truncate">{item.name}</h3>
                          <button 
                            onClick={() => removeItem(item.id)}
                            title={`Remove ${item.name} from manifest`}
                            className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} aria-hidden="true" /> Remove Asset
                          </button>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center w-full col-span-3">
                        <div className="flex items-center border-2 border-[#06392F] rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_#06392F]">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                            title="Decrease quantity"
                            className="p-3 transition-colors hover:bg-gray-50 disabled:opacity-10"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center font-black text-sm border-x-2 border-[#06392F] py-2" aria-live="polite">
                            {updating === item.id ? <Loader2 size={14} className="animate-spin mx-auto text-[#C75B39]" /> : item.quantity}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            title="Increase quantity"
                            className="p-3 transition-colors hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="w-full col-span-2 text-right">
                        <p className="text-lg font-black tracking-tighter text-[#06392F]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                          @ {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                href="/products" 
                className="inline-flex items-center gap-3 mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#C75B39] transition-all group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Re-enter Catalog
              </Link>
            </main>

            {/* SUMMARY PANEL */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="bg-[#06392F] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FileText size={100} />
                  </div>

                  <h3 className="flex items-center justify-between pb-4 mb-8 text-2xl font-black tracking-tighter uppercase border-b border-white/10">
                    Summary 
                    <span className="text-[10px] font-bold px-3 py-1 bg-white/10 rounded-full tracking-widest">{items.length} Assets</span>
                  </h3>
                  
                  <div className="mb-10 space-y-4">
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-white/50">
                      <span>Gross Subtotal</span>
                      <span className="text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-white/50">
                      <span>Statutory VAT (16%)</span>
                      <span className="text-white">{formatCurrency(vat)}</span>
                    </div>
                    <div className="pt-6 mt-6 border-t border-white/20">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C75B39]">Final Valuation</span>
                        <span className="text-5xl font-black tracking-tighter">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href="/checkout"
                    title="Proceed to final settlement and logistics"
                    className="group relative flex items-center justify-center w-full bg-[#C75B39] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] overflow-hidden transition-all hover:bg-white hover:text-[#06392F] shadow-xl"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Secure Checkout <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                    </span>
                  </Link>

                  <div className="p-5 mt-8 border bg-white/5 border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="flex gap-3">
                      <Info size={18} className="text-[#C75B39] shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white mb-1">Logistics Note</p>
                        <p className="text-[9px] leading-relaxed text-white/40 uppercase font-bold">
                          Shipping rates and mobilization fees are calculated during checkout based on site GIS data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}