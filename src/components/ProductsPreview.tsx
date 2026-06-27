'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowUpRight,
  Truck,
  Shield,
  Award,
  Package,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const trustIndicators = [
  { icon: Shield, label: 'Engineer Vetted', desc: 'Every batch tested' },
  { icon: Truck, label: '48h Dispatch', desc: 'Western Kenya coverage' },
  { icon: Award, label: 'Trade Pricing', desc: 'Volume discounts' },
  { icon: Package, label: 'Project Supply', desc: 'Bulk orders welcome' },
];

export default function ProductsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-[#06392F] overflow-hidden"
    >
      {/* Ambient glow layers */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C75B39]/[0.08] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C75B39]/[0.02] rounded-full blur-[200px] pointer-events-none" />

      {/* ─── COMING SOON OVERLAY ─── */}
      <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative">
          <span
            className="text-[14vw] lg:text-[11vw] font-black text-white/[0.035] tracking-[0.25em] uppercase select-none whitespace-nowrap"
            style={{ textShadow: '0 0 100px rgba(199, 91, 57, 0.08)' }}
          >
            COMING SOON
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[140%] h-[1px] bg-[#C75B39]/[0.08] rotate-[-6deg]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 mx-auto max-w-6xl">
        {/* ─── HEADER ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C75B39]" />
              <span className="text-[#C75B39] text-xs font-semibold tracking-[0.3em] uppercase">
                Materials Store
              </span>
            </div>
            <h2 className="text-3xl lg:text-[2.75rem] font-light text-white tracking-tight leading-[1.15]">
              Quality Building <span className="font-semibold">Hardware</span>
            </h2>
            <p className="mt-3.5 text-sm text-white/35 max-w-md leading-relaxed">
              Premium materials sourced directly from manufacturers. Tested,
              certified, and delivered to your site within 48 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link
              href="/products"
              className="group hidden lg:inline-flex items-center gap-2.5 text-sm font-medium text-white/50 hover:text-[#C75B39] transition-colors duration-300"
            >
              <span className="relative">
                View Full Catalog
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#C75B39] group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </div>

        {/* ─── PLACEHOLDER GRID ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative group"
            >
              <div className="relative bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden aspect-square flex items-center justify-center hover:border-[#C75B39]/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-[#C75B39]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Package className="w-5 h-5 text-white/15" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-20 h-2.5 bg-white/[0.06] rounded-full mx-auto" />
                    <div className="w-12 h-2 bg-white/[0.04] rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── TRUST ROW ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 pt-10 border-t border-white/[0.06]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustIndicators.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-[#C75B39]/20 group-hover:bg-[#C75B39]/[0.06] transition-all duration-300">
                    <Icon className="w-4 h-4 text-[#C75B39]/70 group-hover:text-[#C75B39] transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-white/25 mt-0.5 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── MOBILE CTA ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 lg:hidden text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C75B39] group"
          >
            View Full Catalog
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}