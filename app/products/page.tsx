'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Loader2, PackageX, Filter, X, LayoutGrid } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import TopSales from '@/components/store/TopSales';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryFilter = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`${pathname}?${createQueryString('search', searchTerm)}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, createQueryString]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${searchParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.map((p: any) => ({ 
            ...p, 
            stock: p.stock ?? p.stock_quantity ?? 0 
          })));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-[#06392F]">
      {/* HERO SECTION */}
      <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-[#06392F]">
        <div className="absolute inset-0 z-0 grayscale opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb1930060?q=80&w=2070&auto=format&fit=crop" 
            alt="Structural construction background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '45px 45px' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#06392F] via-[#06392F]/30 to-transparent" />

        <div className="relative z-10 flex flex-col items-start justify-end w-full h-full px-6 pb-20 mx-auto max-w-7xl">
          <p className="text-[#C75B39] font-black text-xs uppercase tracking-[0.5em] mb-4">
            Official Asham Material Store
          </p>
          <h1 className="text-3xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] mb-12">
            MASTER <br /> INVENTORY
          </h1>
          
          {/* SEARCH BAR WITH ACCESSIBILITY FIXES */}
          <div className="relative w-full max-w-3xl group">
            <label htmlFor="inventory-search" className="sr-only">Search inventory</label>
            <input 
              id="inventory-search"
              type="text" 
              placeholder="SEARCH CATALOG BY MATERIAL, PLAN, OR SPEC..." 
              className="w-full bg-white/10 border border-white/20 backdrop-blur-lg px-14 py-6 text-white outline-none focus:bg-white focus:text-[#06392F] transition-all uppercase font-bold tracking-widest text-sm rounded-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#06392F]" size={20} aria-hidden="true" />
            
            {searchTerm && (
              <button 
                type="button" 
                title="Clear search" // ACCESSIBILITY FIX
                aria-label="Clear search input" // ACCESSIBILITY FIX
                onClick={() => setSearchTerm('')} 
                className="absolute transition-colors -translate-y-1/2 right-5 top-1/2 text-white/50 hover:text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="px-6 py-20 mx-auto max-w-7xl">
        {!queryParam && categoryFilter === 'all' && (
          <div className="mb-24">
            <TopSales />
          </div>
        )}

        {/* DIRECTORY HEADER */}
        <div className="border-t-[6px] border-[#06392F] pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#C75B39]">
              <LayoutGrid size={14} aria-hidden="true" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em]">Directory</h2>
            </div>
            <h3 className="text-5xl font-black tracking-tighter uppercase md:text-7xl">The Collection</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              {loading ? 'Consulting DB...' : `${products.length} Professional Units Available`}
            </p>
          </div>
          
          <button 
            type="button"
            title="Open category filters" // ACCESSIBILITY FIX
            aria-label="Filter products by category" // ACCESSIBILITY FIX
            className="flex items-center gap-3 bg-[#06392F] text-white px-10 py-5 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#C75B39] transition-all shadow-xl active:scale-95"
          >
            <Filter size={16} aria-hidden="true" /> Filter Catalog
          </button>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40" aria-live="polite">
            <Loader2 className="animate-spin text-[#C75B39] mb-4" size={48} />
            <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Synchronizing Inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
            <PackageX className="mx-auto mb-6 text-gray-100" size={100} aria-hidden="true" />
            <h3 className="text-3xl font-black uppercase text-[#06392F]">Zero Results</h3>
            <p className="mt-2 mb-10 text-xs font-bold tracking-widest text-gray-400 uppercase">No matches for your inquiry</p>
            <button 
              type="button"
              title="Reset all filters" // ACCESSIBILITY FIX
              aria-label="Reset all search and category filters" // ACCESSIBILITY FIX
              onClick={() => {setSearchTerm(''); router.push('/products');}}
              className="bg-[#C75B39] text-white px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-[#06392F] transition-all shadow-lg"
            >
              Reset Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-white"><Loader2 className="animate-spin text-[#06392F]" size={40} /></div>}>
      <ProductsContent />
    </Suspense>
  );
}