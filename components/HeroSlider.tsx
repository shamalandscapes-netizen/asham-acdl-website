'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Building2,
  HardHat,
  FileCheck,
  Leaf,
  ClipboardCheck,
  Layers,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  location: string;
  category: string;
  year: string;
  description: string;
  audience: 'architects' | 'contractors' | 'eia';
  stats: { value: string; label: string; }[];
  badges: string[];
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/assets/images/slide1.png',
    title: 'Integrated Design-Build Delivery',
    location: 'Mlolongo, Nairobi',
    category: 'Architectural Partnership',
    year: '2026',
    audience: 'architects',
    description: 'Seamless collaboration from concept to completion. We translate architectural vision into constructible reality with precision engineering and value engineering expertise.',
    stats: [
      { value: '99.2%', label: 'Design Intent Preserved' },
      { value: '12%', label: 'Cost Optimization' },
      { value: 'BIM', label: 'Level 2 Compliant' }
    ],
    badges: ['Design-Build', 'BIM Integration', 'Value Engineering']
  },
  {
    id: 2,
    image: '/assets/images/slide2.jpeg',
    title: 'Construction Excellence & Compliance',
    location: 'Lurambi, Kakamega',
    category: 'Contractor Services',
    year: '2026',
    audience: 'contractors',
    description: 'Reliable execution with transparent reporting, strict adherence to KBC and international standards, and proven track record of on-time, on-budget delivery.',
    stats: [
      { value: 'KBC 2019', label: 'Code Compliant' },
      { value: 'ISO 9001', label: 'Quality Certified' },
      { value: '0', label: 'Safety Incidents' }
    ],
    badges: ['KBC Compliant', 'OSHA Certified', 'Quality Assured']
  },
  {
    id: 3,
    image: '/assets/images/slide3.jpeg',
    title: 'Environmental Impact Assessment',
    location: 'Malava, Kakamega',
    category: 'EIA & Sustainability',
    year: '2025',
    audience: 'eia',
    description: 'Comprehensive environmental assessments, NEMA compliance documentation, and sustainable construction practices that minimize ecological footprint.',
    stats: [
      { value: 'NEMA', label: 'Licensed Experts' },
      { value: 'LEED', label: 'Accredited' },
      { value: '40%', label: 'Carbon Reduction' }
    ],
    badges: ['NEMA Approved', 'ESIA Compliant', 'Green Building']
  }
];

const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#C75B39]/20 rounded-full"
          initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
          animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [1, 2, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 25 + i * 3, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const ProgressIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="absolute z-30 flex items-center gap-3 top-12 left-12 text-white/80 mix-blend-difference">
    <span className="font-mono text-xs font-light tracking-widest">{(current + 1).toString().padStart(2, '0')}</span>
    <div className="w-20 h-[2px] bg-white/20 rounded-full overflow-hidden">
      <motion.div
        key={current}
        className="h-full bg-white rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 8, ease: "linear" }}
      />
    </div>
    <span className="font-mono text-xs font-light opacity-40">{total.toString().padStart(2, '0')}</span>
  </div>
);

const AudienceIndicator = ({ audience }: { audience: 'architects' | 'contractors' | 'eia' }) => {
  const configs = {
    architects: { icon: Building2, label: 'For Architectural Firms', color: '#C75B39' },
    contractors: { icon: HardHat, label: 'For Contractors', color: '#C75B39' },
    eia: { icon: Leaf, label: 'For EIA Experts', color: '#C75B39' }
  };

  const config = configs[audience];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-4 py-2 bg-[#C75B39]/20 backdrop-blur-md rounded-full border border-[#C75B39]/30"
    >
      <Icon className="w-4 h-4 text-[#C75B39]" />
      <span className="text-xs font-medium tracking-wider uppercase text-[#C75B39]">{config.label}</span>
    </motion.div>
  );
};

const VideoBackground = ({ src, index }: { src: string; index: number }) => (
  <motion.div
    initial={{ scale: 1.1, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.98, opacity: 0 }}
    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    className="absolute inset-0"
  >
    <Image src={src} alt="Project background" fill priority={index === 0} className="object-cover" quality={90} />
    <div className="absolute inset-0 bg-gradient-to-r from-[#06392F]/95 via-[#06392F]/60 to-[#06392F]/30 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#06392F] via-transparent to-transparent" />
    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none">
      <div className="w-full h-full bg-[url('/noise.png')] animate-grain" />
    </div>
  </motion.div>
);

const TrustBadges = ({ badges }: { badges: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {badges.map((badge, idx) => (
      <motion.span
        key={idx}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + idx * 0.1 }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-medium tracking-wider uppercase text-white/70"
      >
        <ShieldCheck className="w-3 h-3 text-[#C75B39]" />
        {badge}
      </motion.span>
    ))}
  </div>
);

const StatCard = ({ stat, index }: { stat: { value: string; label: string }; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + index * 0.1 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#C75B39]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative p-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl hover:border-[#C75B39]/30 transition-colors duration-300">
      <div className="text-2xl font-light tracking-tight text-white md:text-3xl">{stat.value}</div>
      <div className="text-[10px] tracking-wider uppercase text-white/40 mt-1">{stat.label}</div>
    </div>
  </motion.div>
);

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSlideIcon = (audience: string) => {
    switch(audience) {
      case 'architects': return <Layers className="w-4 h-4" />;
      case 'contractors': return <ClipboardCheck className="w-4 h-4" />;
      case 'eia': return <BarChart3 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <motion.div
      ref={containerRef}
      style={{ scale: heroScale, opacity: heroOpacity }}
      className="relative h-screen w-full overflow-hidden bg-[#06392F]"
    >
      <FloatingParticles />
      <ProgressIndicator current={currentSlide} total={slides.length} />

      <AnimatePresence mode="wait">
        <VideoBackground key={currentSlide} src={currentSlideData.image} index={currentSlide} />
      </AnimatePresence>

      <div className="relative z-10 flex items-center h-full px-6 mx-auto max-w-7xl lg:px-12">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 15, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Audience Indicator */}
              <AudienceIndicator audience={currentSlideData.audience} />

              {/* Category & Location */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 text-[9px] font-medium tracking-[0.2em] uppercase border rounded-full border-white/20 text-white backdrop-blur-md bg-white/5 flex items-center gap-2">
                  {getSlideIcon(currentSlideData.audience)}
                  {currentSlideData.category}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-[10px] font-light text-white/80 uppercase tracking-widest">
                  <MapPin size={11} className="text-[#C75B39]" />
                  {currentSlideData.location}
                </span>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-[10px] font-light text-white/60 uppercase tracking-widest">
                  <FileCheck size={11} className="text-[#C75B39]" />
                  {currentSlideData.year}
                </span>
              </div>

              {/* Title */}
              <h1 className="max-w-3xl text-4xl font-light leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl">
                {currentSlideData.title}
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base font-light leading-relaxed text-white/60 md:text-lg">
                {currentSlideData.description}
              </p>

              {/* Trust Badges */}
              <TrustBadges badges={currentSlideData.badges} />

              {/* Stats Grid */}
              <div className="grid max-w-lg grid-cols-3 gap-4 pt-2">
                {currentSlideData.stats.map((stat, idx) => (
                  <StatCard key={idx} stat={stat} index={idx} />
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#d16643' }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-[#C75B39] text-white px-8 py-4 font-semibold tracking-widest text-[10px] uppercase transition-all flex items-center justify-center gap-3 min-w-[220px] rounded-xl shadow-lg shadow-black/20"
                  >
                    Request Consultation
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>

                <Link href="/projects">
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 font-semibold tracking-widest text-white uppercase transition-all border border-white/20 backdrop-blur-md text-[10px] min-w-[220px] rounded-xl flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Capabilities
                  </motion.button>
                </Link>
              </div>

              {/* Partnership Trust Signal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 pt-4 border-t border-white/10"
              >
                <div className="flex -space-x-4">
                  {['AR', 'CN', 'EI'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-[#C75B39]/30 border-2 border-[#06392F] flex items-center justify-center text-[10px] font-medium text-white"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-white/50">
                  <span className="font-medium text-white/70">Trusted by 50+ partners</span> across architecture, construction & environmental sectors
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute z-30 flex items-center gap-3 bottom-12 right-12">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`group relative w-12 h-1 rounded-full overflow-hidden transition-all duration-300 ${
              idx === currentSlide ? 'bg-black/60' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {idx === currentSlide && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#C75B39]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-0.5%, -0.5%); }
          50% { transform: translate(0.5%, -0.5%); }
          90% { transform: translate(0.5%, 0.5%); }
        }
        .animate-grain { animation: grain 0.7s steps(2) infinite; }
      `}</style>
    </motion.div>
  );
}
