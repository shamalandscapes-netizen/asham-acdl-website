'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { Flame, TrendingUp } from 'lucide-react';
import { Product } from '@/types/products';

// Match the ExtendedProduct requirement from your ProductCard
interface ExtendedProduct extends Product {
  stock: number;
  original_price?: number;
  sales_count?: number;
}

export default function TopSales() {
  const [products, setProducts] = useState<ExtendedProduct[]>([]); // ✅ Updated Type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopSales() {
      try {
        const res = await fetch('/api/products?top_sales=true');
        const data = await res.json();
        
        // Ensure every product has a stock value to satisfy TypeScript
        const formattedData = data.map((p: any) => ({
          ...p,
          stock: p.stock ?? 0, // ✅ Fallback to 0 if stock is missing in DB
        }));

        setProducts(formattedData);
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
    <section className="py-16">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#C75B39] p-3 rounded-2xl shadow-lg shadow-[#C75B39]/20">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#06392F] italic">Top Sales This Week</h2>
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Most popular materials</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#C75B39] font-black text-sm uppercase tracking-tighter">
          <TrendingUp size={16} /> Live Trends
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product, index) => (
          <div key={product.id} className="relative">
            {/* Rank Badge */}
            <div className="absolute -top-3 -left-3 z-10 bg-[#06392F] text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-gray-50 shadow-xl">
              #{index + 1}
            </div>
            {/* Now satisfies ExtendedProduct requirement */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}