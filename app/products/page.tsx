'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, PackageX, Filter } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import TopSales from '@/components/store/TopSales'; // ✅ Include the Top Sales section

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get category from URL if it exists (e.g., /products?category=Cement)
  const categoryFilter = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce logic for search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
          params.append('category', categoryFilter);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Map data to ensure stock exists for the ProductCard
          setProducts(data.map((p: any) => ({ ...p, stock: p.stock ?? p.stock_quantity ?? 0 })));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [debouncedSearch, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO & SEARCH */}
      <div className="bg-[#06392F] text-white py-20 px-4 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
           {/* Decorative background element */}
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[80%] rounded-full bg-[#C75B39] blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="text-[#C75B39] font-black uppercase tracking-[0.4em] text-xs mb-4">Official Material Store</p>
          <h1 className="mb-10 text-5xl italic font-black tracking-tighter md:text-7xl">
            Asham Supply <span className="text-[#C75B39]">&</span> Design
          </h1>
          
          <div className="relative max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Search materials, equipment, or house plans..." 
              className="w-full pl-16 pr-8 py-6 rounded-[2rem] text-gray-800 focus:outline-none focus:ring-8 focus:ring-[#C75B39]/20 shadow-2xl transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute text-gray-300 -translate-y-1/2 left-6 top-1/2" size={28} />
          </div>
        </div>
      </div>

      <div className="px-4 py-16 mx-auto max-w-7xl">
        {/* TOP SALES - Shows the top 5 performers first */}
        {!debouncedSearch && !categoryFilter && <TopSales />}

        {/* SECTION TITLE */}
        <div className="flex items-center justify-between mb-12">
           <div>
              <h2 className="text-3xl font-black text-[#06392F]">
                {categoryFilter ? `${categoryFilter.replace(/-/g, ' ')}` : 'All Inventory'}
              </h2>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                {products.length} Items Available
              </p>
           </div>
           <button className="flex items-center gap-2 text-sm font-bold text-[#06392F] bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <Filter size={18} /> Filter Categories
           </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#C75B39] mb-4" size={48} />
            <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Syncing Asham Inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center bg-white border border-gray-100 rounded-[3rem] shadow-sm">
            <PackageX className="mx-auto mb-6 text-gray-100" size={80} />
            <h3 className="text-3xl font-black text-[#06392F]">No materials found</h3>
            <p className="mt-2 mb-10 italic font-medium text-gray-500">We couldn't find anything matching your current filters.</p>
            <button 
              onClick={() => {setSearchTerm(''); window.location.href='/products';}}
              className="bg-[#C75B39] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#06392F] transition-all shadow-lg active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense to prevent Next.js 15 deployment errors with useSearchParams
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-[#C75B39]" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}