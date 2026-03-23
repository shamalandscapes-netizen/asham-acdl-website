import Link from 'next/link';
import Button from '@/components/ui/Button'; // Ensure this path is correct based on your setup
import { ArrowRight } from 'lucide-react';

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export default function CTABanner({
  title = "Ready to Build Your Dream?",
  subtitle = "From architectural designs to quality materials, we have everything you need to get started.",
  buttonText = "Get a Free Quote",
  buttonLink = "/contact",
  backgroundImage = "/images/construction-bg-overlay.jpg" // You can replace this default or pass a prop
}: CTABannerProps) {
  return (
    <section className="relative py-16 md:py-24 bg-[#06392F] overflow-hidden">
      
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#fff" />
        </svg>
      </div>

      <div className="relative z-10 px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        
        <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-200">
          {subtitle}
        </p>

        <Link href={buttonLink}>
          <Button 
            size="lg" 
            variant="secondary" 
            className="transition-all transform shadow-xl hover:shadow-2xl hover:-translate-y-1"
            rightIcon={<ArrowRight size={20} />}
          >
            {buttonText}
          </Button>
        </Link>
      </div>
    </section>
  );
}