import { Suspense } from 'react';
import { Metadata } from 'next';
import HeroSlider from '@/components/HeroSlider';
import ValuesStrip from '@/components/ValuesStrip';
import ServicesGrid from '@/components/ServicesGrid';
import FeaturedProjects from '@/components/FeaturedProjects';
import ProductsPreview from '@/components/ProductsPreview'; 
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import CTABanner from '@/components/CTABanner';
import BlogPreview from '@/components/blog/BlogPreview';
import StatsCounter from '@/components/StatsCounter';
import ProcessFlow from '@/components/ProcessFlow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowRight, Link } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Asham Design & Construction | Architects & Builders in Western Kenya',
  description: 'Kakamega-based architectural firm delivering precision-built residential and commercial projects across Kenya. Since 1995.',
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#FDF8F5]">
      
      {/* 1. Hero Section: High-impact visuals */}
      <section className="relative">
        <HeroSlider />
        {/* Subtle gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDF8F5] to-transparent z-10" />
      </section>

      {/* 2. Stats Counter: Immediate credibility through numbers */}
      <section className="relative z-20 -mt-16">
        <div className="container px-6 mx-auto">
          <StatsCounter />
        </div>
      </section>

      {/* 3. Values Strip: Core philosophy */}
      <section className="py-16 md:py-24">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4 mb-6">
              Building with Purpose
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              For over 7 Years, we've approached each project as a partnership—listening first, 
              designing thoughtfully, and constructing with precision.
            </p>
          </div>
          <ValuesStrip />
        </div>
      </section>

      {/* 4. Process Flow: How we work (new section) */}
      <section className="py-16 md:py-24 bg-white/50 backdrop-blur-sm">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Our Process</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4">
              From Concept to Completion
            </h2>
          </div>
          <ProcessFlow />
        </div>
      </section>

      {/* 5. Services: What we do */}
      <section className="py-16 md:py-24">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col justify-between mb-16 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Expertise</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4">
                Integrated Design & Construction
              </h2>
            </div>
            <p className="max-w-md mt-4 text-gray-600 md:mt-0">
              From environmental assessment to material supply—we handle every phase of your project.
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ServicesGrid />
          </Suspense>
        </div>
      </section>

      {/* 6. Products Preview: The unique advantage */}
      <section className="py-16 md:py-24 bg-[#06392F] text-white relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C75B39] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C75B39] rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Materials Store</span>
            <h2 className="mt-4 mb-6 text-4xl font-black tracking-tighter text-white md:text-5xl">
              Quality Building Hardware
            </h2>
            <p className="text-lg text-white/80">
              Source premium materials directly from our construction store—curated for durability and finish.
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <ProductsPreview />
          </Suspense>
        </div>
      </section>

      {/* 7. Featured Projects: Proof of work */}
      <section className="py-16 md:py-24">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col justify-between mb-16 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4">
                Recent Projects
              </h2>
            </div>
            <Link 
              href="/projects" 
              className="group flex items-center gap-2 text-[#06392F] font-black uppercase tracking-widest text-sm mt-4 md:mt-0 hover:text-[#C75B39] transition-colors"
            >
              View All Projects 
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProjects />
          </Suspense>
        </div>
      </section>

      {/* 8. Testimonials with visual interest */}
      <section className="relative py-16 md:py-24 bg-white/50 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C75B39]/5 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#06392F]/5 rounded-full" />
        </div>
        
        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">Client Stories</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4 mb-6">
              Trusted by Homeowners & Developers
            </h2>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsCarousel />
          </Suspense>
        </div>
      </section>

      {/* 9. The Journal: Authority & Insights */}
      <section className="py-16 md:py-24">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col justify-between mb-16 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-[#C75B39] text-sm font-black tracking-[0.3em] uppercase">The Journal</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#06392F] mt-4">
                Insights & Perspectives
              </h2>
            </div>
            <p className="max-w-md mt-4 text-gray-600 md:mt-0">
              Thoughts on architecture, sustainability, and the craft of building in Kenya.
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <BlogPreview />
          </Suspense>
        </div>
      </section>

      {/* 10. Final Call to Action - full width with impact */}
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

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FDF8F5] to-transparent" />
      </section>

    </main>
  );
}