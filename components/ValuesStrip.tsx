'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Building2,
  Shield,
  Users,
  FileCheck,
  Layers,
  HardHat,
  Leaf,
  ClipboardCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ValueItem {
  icon: React.ElementType;
  title: string;
  description: string;
  audience: 'architects' | 'contractors' | 'eia' | 'all';
  badge?: string;
}

const values: ValueItem[] = [
  {
    icon: Layers,
    title: 'BIM Integration',
    description: 'Level 2 compliant digital workflows for seamless design coordination',
    audience: 'architects',
    badge: 'Revit / ArchiCAD'
  },
  {
    icon: FileCheck,
    title: 'KBC Compliant',
    description: 'Full adherence to Kenya Building Code 2019 and international standards',
    audience: 'contractors',
    badge: 'Certified'
  },
  {
    icon: Leaf,
    title: 'NEMA Licensed',
    description: 'Comprehensive ESIA documentation and environmental compliance',
    audience: 'eia',
    badge: 'Expert Team'
  },
  {
    icon: Shield,
    title: 'Safety-First',
    description: 'Zero lost-time incidents with OSHA-compliant site protocols',
    audience: 'contractors',
    badge: 'ISO 45001'
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'ISO 9001 certified processes with rigorous quality control',
    audience: 'all',
    badge: 'ISO 9001'
  },
  {
    icon: TrendingUp,
    title: 'Value Engineering',
    description: 'Cost optimization without compromising design intent or quality',
    audience: 'architects',
    badge: 'Proven ROI'
  }
];

const audienceLabels = {
  architects: { color: '#3B82F6', label: 'For Architects' },
  contractors: { color: '#C75B39', label: 'For Contractors' },
  eia: { color: '#10B981', label: 'For EIA Experts' },
  all: { color: '#6B7280', label: 'Universal' }
};

const ValueCard = ({ value, index }: { value: ValueItem; index: number }) => {
  const Icon = value.icon;
  const audienceConfig = audienceLabels[value.audience];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-2xl group-hover:opacity-100 blur-xl"
        style={{ backgroundColor: `${audienceConfig.color}15` }}
      />

      <div className="relative h-full p-6 bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: audienceConfig.color }}
        />

        {/* Audience badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${audienceConfig.color}20`,
              color: audienceConfig.color
            }}
          >
            {audienceConfig.label}
          </span>
          {value.badge && (
            <span className="text-[10px] text-white/40 font-medium">
              {value.badge}
            </span>
          )}
        </div>

        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center mb-4 transition-colors duration-300 w-14 h-14 rounded-xl bg-white/5 group-hover:bg-white/10"
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <Icon
            className="w-6 h-6 transition-colors duration-300"
            style={{ color: audienceConfig.color }}
          />
        </motion.div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-medium text-white transition-colors group-hover:text-white/90">
          {value.title}
        </h3>
        <p className="text-sm leading-relaxed transition-colors text-white/50 group-hover:text-white/70">
          {value.description}
        </p>

        {/* Learn more link */}
        <div className="flex items-center gap-2 mt-4 text-xs font-medium transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ color: audienceConfig.color }}>
          <span>Learn more</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default function ValuesStrip() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#06392F]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C75B39]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-blue-500/5 blur-3xl" />

      <div className="container relative px-6 mx-auto max-w-7xl lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-xs font-medium text-[#C75B39] uppercase tracking-wider mb-6 border border-white/10">
            <Shield className="w-3 h-3" />
            Why Partner With Us
          </span>

          <h2 className="mb-6 text-3xl font-light leading-tight text-white lg:text-5xl">
            Technical excellence meets
            <span className="text-[#C75B39]"> regulatory precision</span>
          </h2>

          <p className="max-w-2xl text-lg leading-relaxed text-white/50">
            We speak the language of architects, contractors, and environmental professionals.
            Our credentials and processes are built to meet your industry standards.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 mt-16 border-t border-white/10"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {[
              { label: 'KBC 2019', sub: 'Compliant' },
              { label: 'ISO 9001', sub: 'Certified' },
              { label: 'NEMA', sub: 'Licensed' },
              { label: 'BIM', sub: 'Level 2' },
              { label: 'OSHA', sub: 'Certified' }
            ].map((cert, idx) => (
              <div key={idx} className="text-center">
                <div className="text-sm font-medium text-white/80">{cert.label}</div>
                <div className="text-xs tracking-wider uppercase text-white/40">{cert.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}