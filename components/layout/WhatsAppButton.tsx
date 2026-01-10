'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleChatClick = async () => {
    // ✅ Track the conversion in Supabase using the full 'as any' bypass
    try {
      // FIX: Cast the base supabase object to any to break the 'never' type chain
      await (supabase as any)
        .from('lead_events')
        .insert([
          { 
            event_type: 'whatsapp_click',
            page_url: window.location.pathname 
          }
        ]);
    } catch (e) {
      console.error("Tracking error:", e);
    }

    // Proceed to WhatsApp
    const phoneNumber = "254700000000"; // Replace with your actual number
    const message = "Hello Asham ACDL, I'd like to discuss a project.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-8 left-8 z-[60] group flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000"
    >
      <div className="bg-[#06392F] text-white px-5 py-2.5 rounded-full shadow-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hidden md:block border border-white/10">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
          Inquire via WhatsApp
        </p>
      </div>

      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-[#06392F] animate-ping opacity-20"></span>
        <div className="relative bg-[#06392F] p-3 rounded-full shadow-2xl border border-white/20 hover:scale-110 hover:-rotate-12 transition-all duration-500">
          <img 
            src="/assets/icons/whatsapp.png" 
            alt="WhatsApp" 
            className="object-contain w-7 h-7 brightness-0 invert" 
          />
        </div>
      </div>
    </button>
  );
}