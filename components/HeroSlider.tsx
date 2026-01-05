'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/slide1.jpg', 
    title: 'Greenfield Industrial Complex',
    description: 'State-of-the-art manufacturing facility'
  },
  {
    id: 2,
    image: '/assets/images/slide2.jpg',
    title: 'Lakeside Residential Development',
    description: 'Sustainable living communities'
  },
  {
    id: 3,
    image: '/assets/images/slide3.jpg',
    title: 'Urban Commercial Hub',
    description: 'Modern business district transformation'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div 
      className="relative h-[90vh] w-full overflow-hidden bg-[#06392F]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* --- LAYER 1: BACKGROUND SLIDER --- */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-[#06392F]" />
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06392F]/90 via-[#06392F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06392F]/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* --- LAYER 2: STATIC HERO CONTENT --- */}
      <div className="container relative z-10 flex items-center h-full px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 mb-6 text-sm font-semibold tracking-widest uppercase border rounded border-[#C75B39]/50 text-[#C75B39] bg-[#06392F]/50 backdrop-blur-sm">
              Engineering tomorrow, building today
            </span>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl drop-shadow-lg uppercase tracking-tighter">
              Asham Design <br /> Construction Ltd
            </h1>
            <p className="max-w-2xl pl-6 mb-8 text-lg leading-relaxed text-gray-200 border-l-4 md:text-xl border-[#C75B39]">
              Delivering precision-built infrastructure anchored in innovation, craftsmanship, and legacy. 
              We execute with purpose and integrity.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full group bg-[#C75B39] hover:bg-[#b04a2a] text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 font-bold text-white transition-all bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-[#06392F] text-sm uppercase tracking-widest">
                  View Our Portfolio
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- LAYER 3: CONTROLS & WATERMARK --- */}
      
      <div className="absolute z-20 flex justify-between transform -translate-y-1/2 pointer-events-none top-1/2 left-4 right-4">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="p-3 text-white transition-all border rounded-full pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-[#C75B39] border-white/20 hover:border-[#C75B39] group"
        >
          <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="p-3 text-white transition-all border rounded-full pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-[#C75B39] border-white/20 hover:border-[#C75B39] group"
        >
          <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="absolute bottom-0 right-0 z-20 hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="bg-[#06392F]/95 p-8 min-w-[320px] border-t-4 border-[#C75B39] shadow-2xl"
          >
            <p className="mb-2 text-xs font-black tracking-widest uppercase text-[#C75B39]">Featured Project</p>
            <h3 className="mb-1 text-xl font-black text-white uppercase tracking-tighter">{slides[currentSlide].title}</h3>
            <p className="text-sm text-gray-400 font-medium">{slides[currentSlide].description}</p>
            <div className="flex gap-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-[#C75B39] w-8' : 'bg-gray-600 w-4 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- LOGO WATERMARK (Bottom Left) --- NO BACKGROUND BOX --- */}
      <div className="absolute z-20 hidden bottom-12 left-8 lg:block opacity-90">
        <div className="flex items-center gap-4">
           <div className="relative w-48 h-48">
             <Image 
                src="/assets/images/logos/logo.png" 
                alt="Asham Logo" 
                fill 
                className="object-contain"
             />
           </div>
        </div>
      </div>
    </div>
  );
}