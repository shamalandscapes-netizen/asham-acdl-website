// components/ProductsPreview.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Loader2, 
  PackageX, 
  TrendingUp, 
  Star, 
  Truck, 
  Shield,
  Sparkles,
  ChevronRight,
  Package,
  Clock,
  Award
} from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';

// Enhanced Skeleton with architectural grid lines
const ProductSkeleton = () => (
  <div className="space-y-4">
    <div className="relative w-full overflow-hidden bg-[#F5F5F0] rounded-3xl aspect-square">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwNjM5MkYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
    <div className="px-1 space-y-3">
      <div className="w-3/4 h-4 bg-[#06392F]/10 rounded-full" />
      <div className="w-1/2 h-4 bg-[#06392F]/10 rounded-full" />
      <div className="w-2/3 h-3 bg-[#06392F]/5 rounded-full" />
    </div>
  </div>
);

// Trust indicators data
const trustIndicators = [
  { icon: Shield, label: 'Quality Guaranteed', desc: 'Engineer vetted' },
  { icon: Truck, label: 'Rapid Delivery', desc: '24-48 hour dispatch' },
  { icon: Award, label: 'Trade Pricing', desc: 'Volume discounts' },
  { icon: Package, label: 'Bulk Orders', desc: 'Project supply' }
];

export default function ProductsPreview() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchTopPicks() {
      try {
        const res = await fetch('/api/products?top_sales=true&limit=4');
        const data = await res.json();
        
        const formattedData = data.map((p: any) => ({
          ...p,
          stock: p.stock ?? p.stock_quantity ?? 0,
          badge: p.stock > 50 ? 'Popular' : p.stock < 10 ? 'Low Stock' : null
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-white md:py-28 lg:py-36"
    >
      {/* Architectural Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C75B39]/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#06392F]/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #06392F 1px, transparent 1px),
                           linear-gradient(to bottom, #06392F 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-10 mb-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#F5F5F0] rounded-full border border-[#06392F]/5"
            >
              <Package className="w-4 h-4 text-[#C75B39]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#06392F]">
                Materials Supply
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#06392F] leading-[1.05] tracking-tight mb-6"
            >
              Premium Building
              <span className="block text-[#C75B39] mt-1">Materials</span>
            </motion.h2>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-[#06392F]/60 leading-relaxed max-w-xl"
            >
              Direct-from-manufacturer sourcing ensures competitive pricing without compromising on quality. Every batch tested and certified.
            </motion.p>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-8"
            >
              <div>
                <div className="text-3xl font-bold text-[#06392F]">500+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/40 mt-1">Products</div>
              </div>
              <div className="w-px bg-[#06392F]/10" />
              <div>
                <div className="text-3xl font-bold text-[#06392F]">72h</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/40 mt-1">Delivery</div>
              </div>
              <div className="w-px bg-[#06392F]/10" />
              <div>
                <div className="text-3xl font-bold text-[#06392F]">ISO</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#06392F]/40 mt-1">Certified</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="hidden lg:block"
          >
            <Link href="/products">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#06392F] text-white rounded-full font-semibold text-sm tracking-wide shadow-xl shadow-[#06392F]/20 hover:shadow-[#C75B39]/20 hover:bg-[#C75B39] transition-all duration-300"
              >
                <span>View Full Catalog</span>
                <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/20 group-hover:bg-white/30">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
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
              className="grid grid-cols-2 gap-6 lg:grid-cols-4"
            >
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center bg-[#F5F5F0] rounded-[2.5rem] border border-[#06392F]/5"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#06392F]/5 flex items-center justify-center">
                <PackageX className="w-10 h-10 text-[#06392F]/30" />
              </div>
              <h3 className="text-lg font-bold text-[#06392F] mb-2">Inventory Update</h3>
              <p className="text-sm text-[#06392F]/50 max-w-sm mx-auto">
                New materials arriving soon. Contact us for advance orders.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <ProductCard product={product} />
                  
                  {/* Floating Badge */}
                  {product.badge && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`absolute top-4 left-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg ${
                        product.badge === 'Popular' 
                          ? 'bg-[#C75B39] text-white' 
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {product.badge}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4 mt-16 lg:grid-cols-4"
        >
          {trustIndicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-6 bg-[#F5F5F0] rounded-2xl border border-[#06392F]/5 hover:border-[#C75B39]/20 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#06392F] text-white flex items-center justify-center mb-4 group-hover:bg-[#C75B39] transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-[#06392F] mb-1">{item.label}</div>
                <div className="text-xs text-[#06392F]/50">{item.desc}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-12 lg:hidden"
        >
          <Link href="/products">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-5 bg-[#06392F] text-white rounded-2xl font-semibold text-sm tracking-wide shadow-xl flex items-center justify-center gap-3 hover:bg-[#C75B39] transition-colors duration-300"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}