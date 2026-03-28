import { Plus_Jakarta_Sans } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer"; 
import ClientWrapper from "@/components/layout/ClientWrapper";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Font configuration
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

// Enhanced SEO Metadata with Kenyan context
export const metadata: Metadata = {
  metadataBase: new URL('https://ashamconstruction.co.ke'),
  title: {
    default: "Asham Design & Construction Ltd | Architects in Nairobi & Kakamega",
    template: "%s | Asham ACDL"
  },
  description: "Nairobi-based architectural firm delivering precision-built residential and commercial projects across Kenya. Since 2019, we've combined modernist design with sustainable construction.",
  keywords: [
    "architects in Nairobi",
    "Kenyan architecture firm",
    "residential architects Kenya",
    "sustainable design Kenya",
    "construction company Kakamega",
    "modernist architecture Kenya",
    "Asham Design Construction",
    "Mlolongo architects",
    "Maisonette design Nairobi"
  ],
  authors: [{ name: "Asham Design & Construction Ltd" }],
  creator: "Asham ACDL",
  publisher: "Asham Design & Construction Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Asham Design & Construction Ltd",
    description: "Precision-built infrastructure anchored in innovation, craftsmanship, and legacy.",
    url: 'https://ashamconstruction.co.ke',
    siteName: 'Asham ACDL',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Asham Design & Construction - Architectural firm in Kenya',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asham Design & Construction Ltd',
    description: 'Precision-built infrastructure anchored in innovation, craftsmanship, and legacy.',
    images: ['/og-image.jpg'],
    creator: '@ashamconstruction',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'jO5MJziRM0BzXYTRNMMr23__8erRpvifVZ16BFQ4q94',
  },
  category: 'architecture',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: '#06392F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE" className="scroll-smooth">
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Kenyan market verification */}
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
        
        {/* Added security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body 
        className={`
          ${plusJakarta.variable} 
          ${plusJakarta.className} 
          bg-[#FDF8F5] 
          text-[#1E2A2A] 
          antialiased 
          selection:bg-[#C75B39]/20 
          selection:text-[#1E2A2A]
          overflow-x-hidden
          min-h-screen
          flex flex-col
        `}
      >
        {/* Subtle background texture with fallback */}
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03] md:opacity-[0.05]">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 200px',
            }}
          />
          {/* Fallback if image exists */}
          {/* <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-multiply bg-repeat opacity-30" /> */}
        </div>

        {/* Main layout */}
        <div className="relative flex flex-col flex-grow">
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#06392F',
              color: '#fff',
              fontSize: '13px',
              borderRadius: '12px',
              padding: '12px 20px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-plus-jakarta)',
              maxWidth: '380px',
            },
            success: {
              iconTheme: {
                primary: '#C75B39',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#C75B39',
                secondary: 'white',
              },
            },
          }}
        />

        {/* Client-side handlers */}
        <ClientWrapper />

        {/* Vercel Web Analytics */}
        <Analytics />

        {/* Schema.org markup for Kenyan architectural firm */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArchitectureFirm",
              "@id": "https://ashamconstruction.co.ke",
              "name": "Asham Design & Construction Ltd",
              "alternateName": "Asham ACDL",
              "description": "Precision-built infrastructure anchored in innovation, craftsmanship, and legacy.",
              "url": "https://ashamconstruction.co.ke",
              "logo": "https://ashamconstruction.co.ke/logo.png",
              "image": "https://ashamconstruction.co.ke/og-image.jpg",
              "address": [
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Nairobi",
                  "streetAddress": "1st Floor Ambwere Plaza, Room 101",
                  "addressRegion": "Nairobi",
                  "postalCode": "00200",
                  "addressCountry": "KE"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Kakamega",
                  "streetAddress": "1st Floor Ambwere Plaza, Room 101",
                  "addressRegion": "Kakamega",
                  "postalCode": "50103",
                  "addressCountry": "KE"
                }
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+254-712-575-077",
                  "contactType": "customer service",
                  "availableLanguage": ["English", "Swahili"],
                  "areaServed": "KE"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+254-735-184-292",
                  "contactType": "sales",
                  "availableLanguage": ["English", "Swahili"],
                  "areaServed": "KE"
                }
              ],
              "email": "info@ashamconstruction.co.ke",
              "sameAs": [
                "https://www.facebook.com/ashamconstruction",
                "https://www.instagram.com/ashamdesign",
                "https://www.linkedin.com/company/asham-construction"
              ],
              "foundingDate": "2019",
              "founder": {
                "@type": "Person",
                "name": "John Mulievi Shamala",
                "jobTitle": "Principal Architect"
              },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Kenya"
                },
                {
                  "@type": "Country",
                  "name": "Uganda"
                },
                {
                  "@type": "Country",  
                  "name": "Tanzania"
                }
              ],
              "hasMap": "https://maps.app.goo.gl/ashamlocation",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "08:00",
                  "closes": "17:00"
                }
              ],
              "knowsAbout": [
                "Residential Architecture",
                "Commercial Architecture",
                "Sustainable Design",
                "Construction Management",
                "Interior Design",
                "Landscape Architecture",
                "Project Planning",
                "Structural Engineering"
              ],
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": 11,
                "maxValue": 50
              },
              "priceRange": "$$",
              "keywords": "architects in Nairobi, Kenyan architecture firm, residential architects Kenya, sustainable design Kenya"
            })
          }}
        />        {/* Client-side handlers */}
        <ClientWrapper />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}