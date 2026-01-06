'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { Activity } from 'lucide-react';
import { Product } from '@/types/products';

// Expert Tip: We extend the base Product type to ensure our UI specific 
// properties are recognized without breaking the base type.
interface ExtendedProduct extends Product {
  stock: number;
  original_price?: number;
  sales_count?: number;
  slug: string; // Ensure this is explicitly handled
}

export default function TopSales() {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopSales() {
      try {
        const res = await fetch('/api/products?top_sales=true');
        const data = await res.json();
        
        const formattedData = data.map((p: any) => {
          // If the DB doesn't provide a slug, we generate one from the name
          // to satisfy the ExtendedProduct type requirement.
          const generatedSlug = p.slug || p.name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

          return {
            ...p,
            slug: generatedSlug,
            stock: p.stock ?? 0,
          };
        });

        setProducts(formattedData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load top sales:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopSales();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 border-b border-gray-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#C75B39]">
            <Activity size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Market Analysis</span>
          </div>
          <h2 className="text-5xl font-black text-[#06392F] uppercase tracking-tighter">
            PROVEN <span className="text-gray-300">DEMAND</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Highest volume materials and designs this period
          </p>
        </div>
      </div>

      {/* TECHNICAL GRID */}
      <div className="grid grid-cols-1 gap-px bg-gray-100 border border-gray-100 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 overflow-hidden rounded-3xl shadow-2xl shadow-[#06392F]/5">
        {products.map((product, index) => (
          <div key={product.id} className="relative p-4 transition-colors bg-white group hover:bg-gray-50">
            {/* LARGE INDEX NUMBER */}
            <div className="absolute z-10 pointer-events-none top-6 right-6">
              <span className="text-7xl font-black text-gray-100 leading-none transition-colors group-hover:text-[#C75B39]/10">
                0{index + 1}
              </span>
            </div>
            
            <div className="relative z-20">
              <ProductCard product={product} />
            </div>

            <div className="mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 border-t border-gray-50 pt-4">
              <span>Performance Rank</span>
              <span className="text-[#06392F]">Top Tier</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}