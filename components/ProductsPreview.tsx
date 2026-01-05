'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, PackageX } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card'; 

export default function ProductsPreview() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPicks() {
      try {
        // Fetching top 4 products from your live API
        const res = await fetch('/api/products?top_sales=true&limit=4');
        const data = await res.json();
        
        // Ensure data matches the ExtendedProduct type requirements
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
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-[#C75B39]"></span>
              <span className="text-[#C75B39] font-black uppercase tracking-[0.3em] text-[10px]">Store Highlights</span>
            </div>
            <h2 className="text-4xl font-black text-[#06392F] italic leading-tight">
              Top Picks This Week
            </h2>
            <p className="mt-4 text-lg font-medium text-gray-500">
              Direct access to premium materials and architectural plans vetted by Asham ACDL engineers.
            </p>
          </div>
          
          <Link href="/products" className="hidden md:inline-flex group">
            <span className="flex items-center gap-3 text-[#06392F] font-bold hover:text-[#C75B39] transition-all">
              View Full Catalog 
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#C75B39] group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </span>
          </Link>
        </div>

        {/* Dynamic Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#C75B39] mb-4" />
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Fetching live inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <PackageX className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="font-bold text-gray-500">No products found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/products">
            <button type="button" className="w-full py-4 rounded-2xl bg-[#06392F] text-white font-bold hover:bg-[#C75B39] transition-all shadow-lg">
              Explore All Products
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}