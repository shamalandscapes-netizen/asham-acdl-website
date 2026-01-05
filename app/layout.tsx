import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// ✅ Components
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import { CartDrawer } from '@/components/cart/cart-drawer';

// ✅ Initialize Montserrat with variable for Tailwind/Global CSS access
const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-montserrat',
});

// ✅ Advanced Multi-Regional SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Asham Design Construction | NCA 6 Firm Kenya & Eastern Uganda",
    template: "%s | Asham Construction Ltd"
  },
  description: "Premier construction & architectural firm specializing in NCA 6 structural engineering, NEMA-compliant assessments, and industrial building across Kenya and Eastern Uganda.",
  keywords: [
    "NCA 6 Contractors Kenya", 
    "Architects in Kakamega", 
    "Construction companies in Mbale", 
    "Structural Engineering Uganda", 
    "NEMA Environmental Impact Assessment",
    "Building Construction material supply Western Kenya"
  ],
  metadataBase: new URL('https://ashamconstruction.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://ashamconstruction.co.ke',
    siteName: 'Asham Design Construction Ltd',
    images: [{
      url: '/api/og', // ✅ Switched to the dynamic Nerd-tier OG generator
      width: 1200,
      height: 630,
      alt: 'Asham Design Construction Architectural & Structural Engineering',
    }],
  },
  icons: {
    icon: '/favicon.png', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Schema.org JSON-LD for Search Engines - Strategic Regional Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ConstructionBusiness",
              "name": "Asham Design Construction Ltd",
              "image": "https://ashamconstruction.co.ke/assets/images/logos/logo.png",
              "areaServed": [
                { "@type": "State", "name": "Western Kenya" },
                { "@type": "Country", "name": "Kenya" },
                { "@type": "State", "name": "Eastern Region, Uganda" }
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kakamega",
                "addressCountry": "KE"
              },
              "knowsAbout": [
                "NCA 6 Regulations", 
                "NEMA Compliance", 
                "BIM Design", 
                "Architectural Design",
                "Structural Engineering"
              ]
            })
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${montserrat.className} bg-[#FDFDFD] text-[#06392F] antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* Top Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Bottom Footer */}
          <Footer />

          {/* Global UI Components */}
          <CartDrawer />
          
          {/* Toast Notifications Styled for Architectural Aesthetic */}
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#06392F',
                color: '#fff',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)'
              },
              success: {
                style: {
                  background: '#ECFDF5', 
                  color: '#064E3B',      
                  border: '1px solid #10B981'
                },
              },
              error: {
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