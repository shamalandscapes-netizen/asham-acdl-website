import HeroSlider from '@/components/HeroSlider';
import ValuesStrip from '@/components/ValuesStrip';
import ServicesGrid from '@/components/ServicesGrid';
import FeaturedProjects from '@/components/FeaturedProjects';
import ProductsPreview from '@/components/ProductsPreview'; 
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import CTABanner from '@/components/CTABanner';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section: High-impact visuals */}
      <HeroSlider />

      {/* 2. Trust Strip: Immediate credibility */}
      <ValuesStrip />

      {/* 3. Shop Preview: THE UNIQUE ADVANTAGE 
          Moving this here shows your "Construction Store" immediately 
          after building trust. */}
      <ProductsPreview />

      {/* 4. Services: How you design and build */}
      <ServicesGrid />

      {/* 5. Projects: Proof of your work */}
      <FeaturedProjects />

      {/* 6. Testimonials: Social proof */}
      <TestimonialsCarousel />

      {/* 7. Final Call to Action */}
      <CTABanner 
        title="Ready to Start Your Project?" 
        subtitle="From architectural design to material supply, we are your trusted partner in construction."
        buttonText="Get a Free Quote"
        buttonLink="/contact"
      />

    </div>
  );
}