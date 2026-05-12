'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

interface Slide {
  [x: string]: ReactNode;
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/slide1.png',
    title: 'Integrated Design-Build Delivery',
    description: 'Seamless collaboration from concept to completion. Precision engineering meets architectural vision.',
  },
  {
    id: 2,
    image: '/assets/images/slide2.jpeg',
    title: 'Construction Excellence',
    description: 'KBC-compliant execution with transparent reporting and on-time, on-budget delivery.',
  },
  {
    id: 3,
    image: '/assets/images/slide3.jpeg',
    title: 'Environmental Impact Assessment',
    description: 'NEMA-licensed assessments and sustainable construction practices for every project.',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[currentSlide];

  return (
    <motion.div
      ref={containerRef}
      style={{ scale: heroScale, opacity: heroOpacity }}
      className="relative h-screen w-full overflow-hidden bg-[#1a1a1a]"
    >
      {/* Background Image — high visibility */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            priority={currentSlide === 0}
            className="object-cover"
            quality={90}
          />
          {/* Light overlay so image is clearly visible */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content — minimal, clean, pushed below navbar */}
      <div className="relative z-10 flex items-end h-full px-6 pb-20 lg:pb-28 mx-auto max-w-7xl lg:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            {/* Location */}
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={14} className="text-[#C75B39]" />
              <span className="text-sm font-medium tracking-widest uppercase text-white/70">
                {current.location}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl mb-5">
              {current.title}
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed text-white/60 max-w-md mb-8">
              {current.description}
            </p>

            {/* Single CTA */}
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-[#C75B39] text-white px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase rounded-lg transition-colors hover:bg-[#b54d2e] flex items-center gap-3"
              >
                Start Your Project
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators — bottom right, minimal */}
      <div className="absolute z-20 flex items-center gap-3 bottom-8 right-6 lg:right-12">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-[2px] rounded-full transition-all duration-500 ${
              idx === currentSlide
                ? 'w-10 bg-white'
                : 'w-5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Slide counter — bottom left, subtle */}
      <div className="absolute z-20 bottom-8 left-6 lg:left-12">
        <span className="font-mono text-xs text-white/40 tracking-widest">
          {(currentSlide + 1).toString().padStart(2, '0')} / {slides.length.toString().padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
}