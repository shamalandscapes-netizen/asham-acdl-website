'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import {
  Award,
  Building2,
  Users,
  Calendar,
  HardHat,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  Leaf,
  ClipboardList,
  CheckCircle2,
  Timer
} from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  description: string;
  audience: 'all' | 'architects' | 'contractors' | 'eia';
}

const stats: StatItem[] = [
  {
    icon: <Calendar className="w-5 h-5" />,
    value: 10,
    label: 'Years Experience',
    suffix: '+',
    description: 'Decade of delivering complex projects across East Africa',
    audience: 'all'
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    value: 127,
    label: 'Projects Delivered',
    suffix: '+',
    description: 'Residential, commercial & mixed-use developments',
    audience: 'all'
  },
  {
    icon: <FileCheck className="w-5 h-5" />,
    value: 100,
    label: 'Compliance Rate',
    suffix: '%',
    description: 'KBC, NEMA & ISO standards adherence',
    audience: 'all'
  },
  {
    icon: <HardHat className="w-5 h-5" />,
    value: 0,
    label: 'Safety Incidents',
    suffix: '',
    description: 'Zero lost-time accidents across all sites',
    audience: 'contractors'
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    value: 99,
    label: 'Design Accuracy',
    suffix: '%',
    description: 'BIM-enabled precision in construction',
    audience: 'architects'
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    value: 45,
    label: 'Carbon Reduction',
    suffix: '%',
    description: 'Average CO2 savings vs. conventional builds',
    audience: 'eia'
  },
  {
    icon: <Timer className="w-5 h-5" />,
    value: 98,
    label: 'On-Time Delivery',
    suffix: '%',
    description: 'Projects completed within scheduled timelines',
    audience: 'contractors'
  },
  {
    icon: <Award className="w-5 h-5" />,
    value: 12,
    label: 'Industry Awards',
    suffix: '',
    description: 'Recognition for design & sustainability excellence',
    audience: 'all'
  }
];

// Smooth counter animation with spring physics
const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest)
  );

  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, springValue, hasAnimated]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (latest) => {
      setDisplayNumber(latest);
    });
    return unsubscribe;
  }, [displayValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayNumber}{suffix}
    </span>
  );
};

// Individual stat card component
const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C75B39]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      <div className="relative h-full p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#C75B39]/20 transition-all duration-300">
        {/* Icon with animated background */}
        <div className="relative mb-4">
          <motion.div
            className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#C75B39]/10 to-[#C75B39]/5 text-[#C75B39]"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.2 }}
          >
            {stat.icon}
          </motion.div>

          {/* Audience badge */}
          {stat.audience !== 'all' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C75B39]" title={`Relevant for ${stat.audience}`} />
          )}
        </div>

        {/* Value */}
        <div className="text-3xl lg:text-4xl font-light text-[#06392F] tracking-tight mb-1">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-[#06392F] mb-2">
          {stat.label}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-gray-400">
          {stat.description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#C75B39] to-[#C75B39]/30 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
          viewport={{ once: true }}
          style={{ originX: 0 }}
        />
      </div>
    </motion.div>
  );
};

// Trust badges row
const TrustBadges = () => {
  const badges = [
    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'KBC Compliant' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'ISO 9001' },
    { icon: <FileCheck className="w-4 h-4" />, label: 'NEMA Licensed' },
    { icon: <TrendingUp className="w-4 h-4" />, label: 'BIM Ready' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-3 mt-8"
    >
      {badges.map((badge, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#06392F]/5 rounded-full text-xs font-medium text-[#06392F]/70"
        >
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </motion.div>
  );
};

export default function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C75B39]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06392F]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 mx-auto max-w-7xl lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C75B39]/10 rounded-full text-xs font-medium text-[#C75B39] uppercase tracking-wider mb-4">
            <TrendingUp className="w-3 h-3" />
            Track Record
          </span>
          <h2 className="text-3xl lg:text-4xl font-light text-[#06392F] mb-4">
            Built on Proven Performance
          </h2>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-500 lg:text-base">
            Numbers that matter to architects, contractors, and environmental professionals.
            Our metrics reflect the standards you demand.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Trust badges */}
        <TrustBadges />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            Partner with a team that understands your industry requirements
          </p>
        </motion.div>
      </div>
    </section>
  );
}