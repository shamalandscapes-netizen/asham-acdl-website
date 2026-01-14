'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, PackageX } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';

// Skeleton Component for better UX
const ProductSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="w-full bg-gray-200 rounded-3xl aspect-square" />
    <div className="w-2/3 h-4 bg-gray-200 rounded" />
    <div className="w-1/2 h-4 bg-gray-200 rounded" />
  </div>
);

export default function ProductsPreview() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPicks() {
      try {
        const res = await fetch('/api/products?top_sales=true&limit=4');
        const data = await res.json();
        
        const formattedData = data.map((p: any) => ({
          ...p,
          stock: p.stock ?? p.stock_quantity ?? 0
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
    <section className="py-12 bg-white border-t border-gray-100 md:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 mb-10 md:flex-row md:items-end md:mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="h-px w-6 md:w-8 bg-[#C75B39]"></span>
              <span className="text-[#C75B39] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">
                Store Highlights
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#06392F] italic leading-[1.1]">
              Top Picks This Week
            </h2>
            <p className="mt-3 text-base font-medium text-gray-500 md:mt-4 md:text-lg">
              Direct access to premium materials vetted by Asham ACDL engineers.
            </p>
          </div>
          
          <Link href="/products" className="hidden md:inline-flex group">
            <span className="flex items-center gap-3 text-[#06392F] font-bold hover:text-[#C75B39] transition-all">
              View Full Catalog 
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#C75B39] group-hover:text-white transition-all shadow-sm">
                <ArrowRight size={20} />
              </div>
            </span>
          </Link>
        </div>

        {/* Dynamic Content State */}
        {loading ? (
          /* Skeleton Grid: Matches the actual grid layout */
          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 md:py-20 text-center bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-dashed border-gray-200">
            <PackageX className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="font-bold text-gray-500">Inventory is currently being updated.</p>
          </div>
        ) : (
          /* Grid adjustments: 2 columns on mobile, 4 on desktop */
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-8 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile CTA: Visible only on small screens */}
        <div className="mt-10 md:hidden">
          <Link href="/products">
            <button type="button" className="w-full py-4 rounded-xl bg-[#06392F] text-white font-bold active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2">
              Explore All Products
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}