'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  PackageX,
  ArrowUpRight,
  Truck,
  Shield,
  Award,
  Package,
} from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';

const trustIndicators = [
  { icon: Shield, label: 'Engineer Vetted', desc: 'Every batch tested' },
  { icon: Truck, label: '48h Dispatch', desc: 'Western Kenya coverage' },
  { icon: Award, label: 'Trade Pricing', desc: 'Volume discounts' },
  { icon: Package, label: 'Project Supply', desc: 'Bulk orders welcome' },
];

const ProductSkeleton = () => (
  <div className="space-y-3">
    <div className="relative w-full aspect-square bg-[#F5F5F0] rounded-xl overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
    <div className="space-y-2">
      <div className="w-2/3 h-3 bg-[#06392F]/10 rounded-full" />
      <div className="w-1/3 h-3 bg-[#06392F]/5 rounded-full" />
    </div>
  </div>
);

export default function ProductsPreview() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    async function fetchTopPicks() {
      try {
        const res = await fetch('/api/products?top_sales=true&limit=4');
        const data = await res.json();

        const formattedData = data.map((p: any) => ({
          ...p,
          stock: p.stock ?? p.stock_quantity ?? 0,
          badge:
            p.stock > 50 ? 'Popular' : p.stock < 10 ? 'Low Stock' : null,
        }));

        setProducts(formattedData);
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopPicks();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-[#06392F] overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C75B39]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── COMING SOON WATERMARK OVERLAY ─── */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Large background text */}
          <span
            className="text-[12vw] lg:text-[10vw] font-black text-white/[0.04] tracking-[0.2em] uppercase select-none whitespace-nowrap"
            style={{
              textShadow: '0 0 80px rgba(199, 91, 57, 0.1)',
            }}
          >
            COMING SOON
          </span>
          {/* Subtle diagonal line through text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[120%] h-[2px] bg-[#C75B39]/10 rotate-[-5deg]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#C75B39] text-xs font-semibold tracking-[0.3em] uppercase">
              Materials Store
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-light text-white tracking-tight">
              Quality Building <span className="font-semibold">Hardware</span>
            </h2>
            <p className="mt-3 text-sm text-white/40 max-w-md leading-relaxed">
              Premium materials sourced directly from manufacturers. Tested,
              certified, and delivered to your site.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group hidden lg:inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-[#C75B39] transition-colors"
            >
              View Full Catalog
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02]"
            >
              <PackageX className="w-10 h-10 text-white/20 mx-auto mb-4" />
              <p className="text-sm text-white/40">
                New inventory arriving soon.
              </p>
              <Link
                href="/contact"
                className="inline-block mt-4 text-xs text-[#C75B39] font-semibold tracking-widest uppercase hover:underline"
              >
                Contact for advance orders
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  className="relative group"
                >
                  <div className="relative bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-[#C75B39]/30 transition-colors duration-300">
                    <ProductCard product={product} />

                    {/* Badge */}
                    {product.badge && (
                      <div
                        className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                          product.badge === 'Popular'
                            ? 'bg-[#C75B39] text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {product.badge}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 pt-10 border-t border-white/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#C75B39]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-white/30 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 lg:hidden text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#C75B39]"
          >
            View Full Catalog
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}