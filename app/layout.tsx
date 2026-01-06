'use client';

import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import "./globals.css";

// ✅ Components
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import { CartDrawer } from '@/components/cart/cart-drawer';
import { QuickViewModal } from '@/components/products/quick-view-modal';
import { SearchOverlay } from '@/components/search/search-overlay';

// ✅ Store
import { useUIStore } from '@/store/ui-store';

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const closeAll = useUIStore((state) => state.closeAll);

  // ✅ 15-Year Pro Tip: Global Event Orchestration
  // Handles 'Esc' to close any open UI layer and prevents "z-index soup"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAll]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.variable} ${montserrat.className} bg-[#FDFDFD] text-[#06392F] antialiased selection:bg-[#06392F] selection:text-white`}>
        
        {/* ✅ Main Layout Container */}
        <div className="relative flex flex-col min-h-screen">
          
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />

          {/* ✅ Global UI Layers (Managed by useUIStore) */}
          {/* Order matters for Z-Index: Search > QuickView > Cart */}
          <SearchOverlay />
          <QuickViewModal />
          <CartDrawer />
          
          {/* ✅ Branded Notification System */}
          <Toaster 
            position="bottom-right" // Shifted to bottom-right (Standard eCommerce UX)
            reverseOrder={false} 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#06392F',
                color: '#fff',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
                style: {
                  background: '#F0FDF4', // Very light green
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
        </div>
      </body>
    </html>
  );
}