'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingCart,
  Building2,
  Wrench,
  Leaf,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  link: string;
  stat: string;
}

const services: Service[] = [
  {
    icon: Leaf,
    title: 'Environmental Impact Assessment',
    description:
      'NEMA-compliant assessments with ecological responsibility at the core.',
    features: ['NEMA Compliance', 'Ecological Audits', 'Sustainability Planning'],
    link: '/services/environmental-impact-assessment',
    stat: '100+ Approved',
  },
  {
    icon: Wrench,
    title: 'Construction Services',
    description:
      'End-to-end project management with structural integrity and timeline precision.',
    features: ['Structural Engineering', 'Quality Control', 'Site Supervision'],
    link: '/services/general-construction',
    stat: '250+ Delivered',
  },
  {
    icon: ShoppingCart,
    title: 'Building Materials Supply',
    description:
      'Premium materials sourced directly from trusted manufacturers.',
    features: ['Cement & Concrete', 'Steel Products', 'Finishing Materials'],
    link: '/services/material-supply',
    stat: '500+ Products',
  },
  {
    icon: Building2,
    title: 'Architectural Services',
    description:
      'Complete design, visualization, and planning for modern spaces.',
    features: ['Building Design', '3D Visualization', 'Planning Permission'],
    link: '/services/architectural-design',
    stat: '15+ Awards',
  },
];

export default function ServicesGrid() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#FDF8F5] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C75B39]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#06392F]/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-6 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-[#C75B39] text-xs font-semibold tracking-[0.3em] uppercase">
              What We Do
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-light text-[#06392F] tracking-tight">
              Integrated <span className="font-semibold">Services</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[#06392F]/50 leading-relaxed">
            From environmental approvals to final construction — every phase,
            one partner.
          </p>
        </motion.div>

        {/* Services — horizontal list layout */}
        <div className="space-y-px bg-[#06392F]/5 rounded-2xl overflow-hidden border border-[#06392F]/5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href={service.link} className="group block">
                <div className="relative bg-white hover:bg-[#FDF8F5] transition-colors duration-300">
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C75B39] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                  <div className="flex items-center gap-6 lg:gap-10 p-6 lg:p-8">
                    {/* Icon */}
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-[#06392F]/5 items-center justify-center group-hover:bg-[#C75B39]/10 transition-colors duration-300">
                      <service.icon className="w-5 h-5 text-[#06392F] group-hover:text-[#C75B39] transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base lg:text-lg font-semibold text-[#06392F] group-hover:text-[#C75B39] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <ArrowUpRight
                          size={14}
                          className="text-[#C75B39] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </div>
                      <p className="text-sm text-[#06392F]/50 leading-relaxed hidden lg:block">
                        {service.description}
                      </p>
                    </div>

                    {/* Features — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-[#06392F]/40 bg-[#F5F5F0] rounded-full border border-[#06392F]/5"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Stat */}
                    <div className="hidden sm:block text-right shrink-0">
                      <div className="text-lg font-light text-[#06392F] group-hover:text-[#C75B39] transition-colors duration-300">
                        {service.stat.split(' ')[0]}
                      </div>
                      <div className="text-[10px] tracking-widest uppercase text-[#06392F]/40">
                        {service.stat.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex items-center justify-between"
        >
          <p className="text-xs text-[#06392F]/40 tracking-wide">
            BORAQS Registered • NEMA Licensed • ISO Certified
          </p>
          <Link
            href="/services"
            className="group flex items-center gap-2 text-sm font-semibold text-[#06392F] hover:text-[#C75B39] transition-colors"
          >
            All Services
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}