// components/TestimonialsCarousel.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  MapPin, 
  Calendar, 
  HardHat,
  Building2,
  FileText,
  Ruler,
  Compass
} from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  project: string;
  projectLocation: string;
  projectYear: string;
  initials: string;
  projectType: 'Residential' | 'Commercial' | 'Medical';
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Moureen',
    role: 'Homeowner',
    company: 'Private Residence',
    content: 'Asham brought our vision to life with incredible attention to detail. The vibrant red and yellow trims combined with natural stone blockwork make our home truly unique. Their team was professional throughout the construction, and the quality of workmanship exceeded our expectations.',
    rating: 5,
    project: 'Moureen Residence',
    projectLocation: 'Nairobi',
    projectYear: '2024',
    initials: 'M',
    projectType: 'Residential'
  },
  {
    id: 2,
    name: 'Tonny Muyale',
    role: 'Homeowner',
    company: 'Private Client',
    content: 'The two-bedroom bungalow Asham designed for me in Mlolongo is everything I dreamed of. The terracotta roof and stone cladding give it timeless character, and the landscaping with hydrangeas creates a beautiful entrance. They managed every detail perfectly, from the front porch to the integrated garage.',
    rating: 5,
    project: 'Tonny Muyale Bungalow',
    projectLocation: 'Mlolongo',
    projectYear: '2024',
    initials: 'T',
    projectType: 'Residential'
  },
  {
    id: 3,
    name: 'Malava Teachers SACCO',
    role: 'Board Chairman',
    company: 'Malava Teachers SACCO',
    content: 'The Malava Teachers Plaza project demonstrates Asham\'s capability to handle complex mixed-use developments. The banking hall, office spaces, and residential apartments were all delivered to specification. Their understanding of commercial requirements and attention to security features made this project a success.',
    rating: 5,
    project: 'Malava Teachers Plaza',
    projectLocation: 'Kakamega',
    projectYear: '2024',
    initials: 'MTS',
    projectType: 'Commercial'
  },
  {
    id: 4,
    name: 'Samuel Waswa',
    role: 'Homeowner',
    company: 'Private Client',
    content: 'The level of detail in the architectural drawings for my maisonette in Mlolongo is exceptional. Every aspect from foundation trenches to window schedules was meticulously documented. The integrated landscape design with kitchen garden and pergola shows their holistic approach to residential architecture.',
    rating: 5,
    project: 'Samuel Waswa Maisonette',
    projectLocation: 'Mlolongo',
    projectYear: '2026',
    initials: 'SW',
    projectType: 'Residential'
  },
  {
    id: 5,
    name: 'Equity Afya',
    role: 'Facilities Manager',
    company: 'Equity Afya',
    content: 'Asham transformed our medical reception area with a design that balances professionalism with patient comfort. The curved reception desk and orange accent columns create a welcoming yet efficient healthcare environment. They understood our specific requirements for patient privacy and workflow.',
    rating: 5,
    project: 'Equity Afya Medical Reception',
    projectLocation: 'Nairobi',
    projectYear: '2024',
    initials: 'EA',
    projectType: 'Medical'
  }
];

const projectTypeIcons = {
  Residential: Building2,
  Commercial: Ruler,
  Medical: Compass
};

export default function TestimonialsCarousel() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  const next = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];
  const ProjectIcon = projectTypeIcons[current.projectType];

  return (
    <section className="relative py-28 overflow-hidden bg-[#F5F5F0]">
      {/* Architectural Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-[#06392F]/10" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-[#06392F]/10" />
        
        {/* Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `
            linear-gradient(to right, #06392F 1px, transparent 1px),
            linear-gradient(to bottom, #06392F 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Soft Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C75B39]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#06392F]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 max-w-6xl px-6 mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white rounded-full border border-[#06392F]/10 shadow-sm"
          >
            <FileText className="w-4 h-4 text-[#C75B39]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06392F]">
              Client Testimonials
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#06392F] leading-[1.05] tracking-tight mb-6">
            Building Trust,
            <span className="block text-[#C75B39]">One Project at a Time</span>
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#C75B39]/30" />
            <div className="w-2 h-2 rounded-full bg-[#C75B39]" />
            <div className="h-px w-12 bg-[#C75B39]/30" />
          </div>
          
          <p className="max-w-2xl mx-auto text-lg text-[#06392F]/60 leading-relaxed">
            Real feedback from clients who have experienced our commitment to quality and excellence.
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div className="relative">
          {/* Large Quote Mark */}
          <div className="absolute z-0 -top-8 left-8 opacity-5">
            <Quote className="w-32 h-32 text-[#06392F]" />
          </div>

          {/* Card Container */}
          <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-2xl shadow-[#06392F]/5 border border-[#06392F]/5">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 md:p-12 lg:p-16"
              >
                {/* Top Bar - Project Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#06392F]/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#06392F] flex items-center justify-center text-white">
                      <ProjectIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#C75B39] mb-1">
                        {current.projectType} Project
                      </div>
                      <div className="text-lg font-bold text-[#06392F]">
                        {current.project}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-[#06392F]/50">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {current.projectLocation}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#06392F]/20" />
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {current.projectYear}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          i < current.rating 
                            ? 'fill-[#C75B39] text-[#C75B39]' 
                            : 'text-[#06392F]/10'
                        }`} 
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote Content */}
                <blockquote className="relative mb-10">
                  <p className="text-xl md:text-2xl lg:text-3xl font-medium text-[#06392F] leading-relaxed">
                    "{current.content}"
                  </p>
                </blockquote>

                {/* Client Info */}
                <div className="flex items-center justify-between flex-wrap gap-6 pt-8 border-t border-[#06392F]/5">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06392F] to-[#0a4d3f] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#06392F]/20">
                      {current.initials}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#06392F] mb-1">
                        {current.name}
                      </div>
                      <div className="text-sm text-[#06392F]/50">
                        {current.role}, <span className="text-[#C75B39] font-medium">{current.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Status Badge */}
                  <div className="px-4 py-2 bg-[#F5F5F0] rounded-full border border-[#06392F]/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#06392F]/60">
                        Project Completed
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute flex gap-3 bottom-8 right-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prev}
                className="w-14 h-14 rounded-full bg-[#F5F5F0] border border-[#06392F]/10 flex items-center justify-center text-[#06392F] hover:bg-[#06392F] hover:text-white hover:border-[#06392F] transition-all duration-300 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                className="w-14 h-14 rounded-full bg-[#C75B39] flex items-center justify-center text-white hover:bg-[#06392F] transition-all duration-300 shadow-lg shadow-[#C75B39]/30"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentTestimonial ? 1 : -1);
                  setCurrentTestimonial(index);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentTestimonial 
                    ? 'bg-[#C75B39] w-10' 
                    : 'bg-[#06392F]/10 w-2 hover:bg-[#06392F]/30'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="mt-6 text-center">
            <span className="text-sm font-medium text-[#06392F]/40">
              <span className="text-[#C75B39] font-bold text-lg">{String(currentTestimonial + 1).padStart(2, '0')}</span>
              <span className="mx-2">/</span>
              <span>{String(testimonials.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mt-20 md:grid-cols-4"
        >
          {[
            { value: '50+', label: 'Projects Delivered', icon: HardHat },
            { value: '15+', label: 'Years Building', icon: Calendar },
            { value: '100%', label: 'Satisfaction Rate', icon: Star },
            { value: '8', label: 'Counties Served', icon: MapPin },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative p-6 bg-white rounded-2xl border border-[#06392F]/5 shadow-lg hover:shadow-xl hover:border-[#C75B39]/20 transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#F5F5F0] flex items-center justify-center text-[#C75B39] group-hover:bg-[#C75B39] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-[#06392F] mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/40">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-10 border-t border-[#06392F]/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/30">Trusted Partners:</span>
            {['Equity Afya', 'Malava Teachers SACCO', 'Private Developers', 'Residential Clients'].map((client, i) => (
              <span key={i} className="text-sm font-bold text-[#06392F]/60 hover:text-[#C75B39] transition-colors cursor-default">
                {client}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}