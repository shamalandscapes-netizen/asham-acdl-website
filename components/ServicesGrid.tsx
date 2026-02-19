// components/ServicesGrid.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { 
  ShoppingCart, Building2, Wrench, Leaf, 
  Users, FileText, ShieldCheck, Clock, ArrowRight, 
  Compass, Ruler, ArrowUpRight
} from 'lucide-react';

interface Service {
  icon: any;
  title: string;
  description: string;
  features: string[];
  link: string;
  highlight?: string;
  stats?: {
    value: string;
    label: string;
  }[];
}

const services: Service[] = [
  {
    icon: Leaf,
    title: 'Environmental Impact Assessment',
    description: 'Mandatory NEMA-compliant assessments with a commitment to ecological responsibility and sustainable development.',
    highlight: 'NEMA Licensed',
    features: ['NEMA Compliance', 'Ecological Audits', 'Sustainability Planning', 'Waste Management', 'Biodiversity Protection'],
    link: '/services/environmental-impact-assessment', // Fixed slug
    stats: [
      { value: '100+', label: 'Projects Approved' },
      { value: 'NEMA', label: 'Registered' }
    ]
  },
  {
    icon: Wrench,
    title: 'Construction Services',
    description: 'End-to-end construction project management with uncompromising focus on structural integrity and timeline adherence.',
    highlight: '25+ Years Experience',
    features: ['Structural Engineering', 'Project Management', 'Quality Control', 'Site Supervision', 'Health & Safety'],
    link: '/services/general-construction', // Fixed slug
    stats: [
      { value: '250+', label: 'Projects Delivered' },
      { value: 'ISO', label: 'Certified' }
    ]
  },
  {
    icon: ShoppingCart,
    title: 'Building Materials Supply',
    description: 'Premium construction materials sourced directly from trusted manufacturers with rigorous quality assurance.',
    highlight: 'Direct From Mills',
    features: ['Cement & Concrete', 'Steel Products', 'Timber & Wood', 'Finishing Materials', 'Roofing Systems'],
    link: '/services/material-supply', // Fixed slug
    stats: [
      { value: '500+', label: 'Products' },
      { value: '24hr', label: 'Delivery' }
    ]
  },
  {
    icon: Building2,
    title: 'Architectural Services',
    description: 'Complete architectural design, 3D visualization, and planning solutions for modern living and working spaces.',
    highlight: 'Award-Winning Design',
    features: ['Building Design', '3D Visualization', 'Planning Permission', 'Interior Design', 'Landscape Design'],
    link: '/services/architectural-design', // Fixed slug
    stats: [
      { value: '15+', label: 'Design Awards' },
      { value: 'BORAQS', label: 'Registered' }
    ]
  }
];

const additionalServices = [
  { icon: Users, title: 'Consultation', description: 'Expert construction advice and feasibility studies.' },
  { icon: FileText, title: 'Documentation', description: 'Complete project documentation and legal approvals.' },
  { icon: ShieldCheck, title: 'Safety Audits', description: 'Comprehensive site safety and compliance inspections.' },
  { icon: Clock, title: 'Maintenance', description: 'Ongoing property maintenance and structural health checks.' },
];

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-[#F5F5F0]">
      {/* Architectural Background Grid */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #06392F 1px, transparent 1px),
            linear-gradient(to bottom, #06392F 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>

      {/* Soft Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C75B39]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#06392F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-sm border border-[#06392F]/10"
              >
                <Compass className="w-4 h-4 text-[#C75B39]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#06392F]">
                  Integrated Solutions
                </span>
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold text-[#06392F] leading-[1.1]">
                  Core <span className="text-[#C75B39]">Services</span>
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#C75B39] to-[#C75B39]/30 rounded-full" />
              </div>
            </div>

            <p className="lg:max-w-md text-base leading-relaxed text-[#06392F]/70 lg:text-right">
              From environmental approvals to final construction, we deliver integrated excellence across every phase of your project.
            </p>
          </div>
        </motion.div>

        {/* Main Services Grid - Architectural Cards */}
        <div className="grid grid-cols-1 gap-8 mb-24 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card Container */}
              <div className="relative h-full bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-[#06392F]/5 hover:shadow-2xl hover:shadow-[#C75B39]/10 transition-all duration-500 border border-[#06392F]/5 hover:border-[#C75B39]/20">
                
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#06392F] via-[#C75B39] to-[#06392F] opacity-20 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content Padding */}
                <div className="relative p-8 lg:p-10">
                  
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      {/* Icon Container - Fully Rounded */}
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.7 }}
                        className="w-16 h-16 rounded-2xl bg-[#06392F] flex items-center justify-center shadow-lg shadow-[#06392F]/20 group-hover:bg-[#C75B39] group-hover:shadow-[#C75B39]/30 transition-all duration-500"
                      >
                        <service.icon className="text-white w-7 h-7" />
                      </motion.div>
                      
                      <div>
                        {service.highlight && (
                          <span className="inline-block px-3 py-1 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#C75B39] bg-[#C75B39]/10 rounded-full">
                            {service.highlight}
                          </span>
                        )}
                        <h3 className="text-xl lg:text-2xl font-bold text-[#06392F] leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Arrow Link */}
                    <Link href={service.link}>
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        className="w-12 h-12 rounded-full border-2 border-[#06392F]/10 flex items-center justify-center text-[#06392F] group-hover:border-[#C75B39] group-hover:text-[#C75B39] group-hover:bg-[#C75B39]/5 transition-all duration-300"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="text-[15px] leading-relaxed text-[#06392F]/70 mb-8">
                    {service.description}
                  </p>

                  {/* Stats Row */}
                  {service.stats && (
                    <div className="flex gap-8 mb-8 pb-8 border-b border-[#06392F]/10">
                      {service.stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-3xl font-bold text-[#06392F]">{stat.value}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/50">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features - Pill Style */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 text-[11px] font-semibold text-[#06392F]/80 bg-[#F5F5F0] rounded-full border border-[#06392F]/5 group-hover:border-[#C75B39]/20 group-hover:text-[#C75B39] transition-all duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button - Fully Rounded Pill */}
                  <Link href={service.link}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-8 bg-[#06392F] text-white rounded-full font-semibold text-sm tracking-wide hover:bg-[#C75B39] transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#06392F]/20 hover:shadow-[#C75B39]/30"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>

                {/* Decorative Corner */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#C75B39]/5 rounded-full blur-3xl group-hover:bg-[#C75B39]/10 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services - Compact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center gap-4 mb-10">
            <Ruler className="w-5 h-5 text-[#C75B39]" />
            <h3 className="text-2xl font-bold text-[#06392F]">Complementary Expertise</h3>
            <div className="flex-1 h-px bg-[#06392F]/10 rounded-full" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-6 bg-white rounded-3xl border border-[#06392F]/5 hover:border-[#C75B39]/20 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F0] flex items-center justify-center mb-4 group-hover:bg-[#C75B39] transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-[#06392F] group-hover:text-white transition-colors" />
                </div>
                
                <h4 className="text-lg font-bold text-[#06392F] mb-2 group-hover:text-[#C75B39] transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm text-[#06392F]/60 leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-[#C75B39] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 bg-white rounded-full shadow-lg border border-[#06392F]/5">
            <span className="px-6 text-sm text-[#06392F]/60">Ready to start your project?</span>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#C75B39] text-white rounded-full font-semibold text-sm hover:bg-[#06392F] transition-colors duration-300 shadow-lg flex items-center gap-2"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          
          <p className="mt-8 text-[11px] font-bold tracking-[0.2em] text-[#06392F]/40 uppercase">
            BORAQS Registered • NEMA Licensed • ISO Certified
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}