import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import ServicesGrid from '@/components/ServicesGrid';
import ProductsPreview from '@/components/ProductsPreview';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import CTABanner from '@/components/CTABanner';
import StatsCounter from '@/components/StatsCounter';
import ProcessFlow from '@/components/ProcessFlow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const siteUrl = 'https://ashamconstruction.co.ke';

export const metadata: Metadata = {
  title: 'Asham Design & Construction | Architects & Builders in Western Kenya',
  description:
    'Kakamega-based architectural firm delivering precision-built residential and commercial projects across Kenya. Integrated design, construction, and building materials since 2015.',
  keywords: [
    'architects Kakamega',
    'construction company Kenya',
    'residential builders Western Kenya',
    'commercial construction Kenya',
    'building materials Kakamega',
    'architectural design Kenya',
    'house construction Kakamega',
    'Asham Construction',
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Asham Design & Construction | Architects & Builders in Western Kenya',
    description:
      'Kakamega-based architectural firm delivering precision-built residential and commercial projects across Kenya. Since 2015.',
    type: 'website',
    url: siteUrl,
    siteName: 'Asham Design & Construction',
    locale: 'en_KE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Asham Design & Construction - Architectural firm in Kakamega, Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asham Design & Construction | Architects & Builders in Western Kenya',
    description:
      'Kakamega-based architectural firm delivering precision-built residential and commercial projects across Kenya.',
    images: ['/og-image.jpg'],
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
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Asham Design & Construction',
  description:
    'Kakamega-based architectural firm delivering precision-built residential and commercial projects across Kenya.',
  url: siteUrl,
  telephone: '+254-712-575077',
  email: 'info@ashamconstruction.co.ke',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kenyatta Avenue, Ambwere Plaza, 1st Floor, Suite 5',
    addressLocality: 'Kakamega',
    addressRegion: 'Kakamega County',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '0.2827',
    longitude: '34.7519',
  },
  image: `${siteUrl}/og-image.jpg`,
  priceRange: '$$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
  sameAs: [
    'https://facebook.com/ashamconstruction',
    'https://instagram.com/ashamconstruction',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Asham Design & Construction',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessJsonLd, websiteJsonLd]),
        }}
      />

      <main className="flex flex-col min-h-screen bg-[#FDF8F5]">
        {/* 1. Hero Section */}
        <section className="relative">
          <HeroSlider />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDF8F5] to-transparent z-[5]" />
        </section>

        {/* 2. Stats Counter — compact floating bar */}
        <StatsCounter />

        {/* 4. Process Flow: How we work */}
        <section className="py-16 md:py-24 bg-white/50 backdrop-blur-sm">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">
                Our Process
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4">
                From Concept to Completion
              </h2>
            </div>
            <ProcessFlow />
          </div>
        </section>

        {/* 5. Services: What we do */}
        <section className="py-0 md:py-0">
          <div className="container px-6 mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <ServicesGrid />
            </Suspense>
          </div>
        </section>

        {/* 6. Products Preview */}
        <section className="py-16 md:py-24 bg-[#06392F] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#C75B39] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C75B39] rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container relative z-10 px-6 mx-auto">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">
                Materials Store
              </span>
              <h2 className="mt-4 mb-6 text-4xl font-black tracking-tighter text-white md:text-5xl">
                Quality Building Hardware
              </h2>
              <p className="text-lg text-white/80">
                Source premium materials directly from our construction store—curated for
                durability and finish.
              </p>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsPreview />
            </Suspense>
          </div>
        </section>

        {/* 8. Testimonials */}
        <section className="relative py-16 md:py-24 bg-white/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C75B39]/5 rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#06392F]/5 rounded-full" />
          </div>

          <div className="container relative z-10 px-6 mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <TestimonialsCarousel />
            </Suspense>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="relative">
          <div className="absolute inset-0 bg-[#06392F]" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

          <div className="container relative z-10 px-6 mx-auto">
            <CTABanner
              title="Ready to Start Your Project?"
              subtitle="From architectural design to material supply, we are your trusted partner in construction."
              buttonText="Get a Free Quote"
              buttonLink="/contact"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FDF8F5] to-transparent" />
        </section>
      </main>
    </>
  );
}