'use client';

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useUIStore } from '@/store/ui-store';

// ✅ Global UI Layers
import { CartDrawer } from '@/components/cart/cart-drawer';
import { QuickViewModal } from '@/components/products/quick-view-modal';
import { SearchOverlay } from '@/components/search/search-overlay';
import WhatsAppButton from "./WhatsAppButton"; // Ensure this path matches your file structure

export default function ClientWrapper() {
  const closeAll = useUIStore((state) => state.closeAll);

  // ✅ Global Event Orchestration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAll]);

  return (
    <>
      {/* Search > QuickView > Cart > WhatsApp (Order for Z-Index) */}
      <SearchOverlay />
      <QuickViewModal />
      <CartDrawer />
      
      {/* ✅ Floating Contact Layer */}
      <WhatsAppButton />
      
      {/* ✅ Notification System */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          className: 'premium-toast',
          style: {
            fontFamily: 'var(--font-montserrat)',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
            style: {
              background: '#F0FDF4',
              color: '#06392F',      
              border: '1px solid #10B981',
            },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
            style: {
              background: '#FEF2F2', 
              color: '#991B1B',      
              border: '1px solid #EF4444'
            },
          },
        }}
      /> 
    </>
  );
}