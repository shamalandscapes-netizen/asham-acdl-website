'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/store/ui-store';
import { Search, X, ArrowRight, Loader2, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Setup Overlay: Focus & Load Recent Items
  useEffect(() => {
    if (isSearchOpen) {
      // Load from localStorage
      const saved = localStorage.getItem('asham_recent_viewed');
      if (saved) {
        setRecentItems(JSON.parse(saved));
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // 2. Optimized Fetch Logic with Debounce & AbortController
  useEffect(() => {
    const abortController = new AbortController();

    const performSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: abortController.signal
        });
        
        const data = await response.json();
        
        if (data.products) {
          setResults(data.products);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Search fetch error:", err);
        }
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      performSearch();
    }, 400);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-[#06392F] text-white overflow-y-auto animate-in fade-in duration-500">
      <div className="container px-6 py-12 mx-auto">
        
        {/* Search Header */}
        <div className="flex items-center justify-between mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Global Manifest Search</h2>
          <button 
            onClick={closeSearch}
            title="Close Search"
            aria-label="Close Search"
            className="p-4 transition-transform duration-300 outline-none hover:rotate-90 group"
          >
            <X className="w-8 h-8 group-hover:text-[#C75B39]" />
          </button>
        </div>

        {/* Input Area */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#C75B39]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="FIND MATERIALS OR PROJECTS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white/10 py-6 pl-14 text-4xl md:text-6xl font-black uppercase tracking-tighter placeholder:text-white/5 focus:outline-none focus:border-[#C75B39] transition-colors"
          />
          {isSearching && (
            <Loader2 className="absolute right-0 -translate-y-1/2 top-1/2 animate-spin text-[#C75B39]" />
          )}
        </div>

        {/* Results / Content Grid */}
        <div className="max-w-4xl mx-auto">
          {results.length > 0 ? (
            /* Search Results View */
            <div className="grid grid-cols-1 gap-4 duration-700 md:grid-cols-2 animate-in slide-in-from-bottom-8">
              {results.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug || product.id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-6 p-4 transition-all border border-transparent group hover:bg-white/5 rounded-2xl hover:border-white/10"
                >
                  <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden bg-white border shadow-xl rounded-xl border-white/10">
                    <Image 
                      src={product.featured_image_url || '/placeholder.png'} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-black text-[#C75B39] uppercase tracking-[0.2em] mb-1 opacity-90">
                      {product.category || 'General Material'}
                    </span>
                    <h3 className="text-lg font-bold leading-tight tracking-tight uppercase truncate transition-transform duration-300 md:text-xl group-hover:translate-x-1">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-white/40">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="ml-auto transition-all duration-300 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-[#C75B39]" />
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length > 1 && !isSearching ? (
            /* No Results View */
            <div className="py-20 text-center duration-300 animate-in fade-in zoom-in">
              <p className="text-2xl font-black tracking-widest uppercase text-white/20">No matching assets found</p>
              <button 
                onClick={() => setQuery('')}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-[#C75B39] hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Default View: Recently Viewed & Popular Categories */
            <div className="space-y-16">
              
              {/* Recently Viewed Section */}
              {recentItems.length > 0 && (
                <div className="space-y-6 duration-700 animate-in fade-in">
                  <div className="flex items-center gap-2 text-white/30">
                    <Clock className="w-3 h-3" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Recently Consulted</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {recentItems.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/products/${item.slug || item.id}`} 
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3 transition-all border bg-white/5 rounded-xl border-white/5 hover:border-white/20 group"
                      >
                        <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden bg-white rounded-lg">
                          <Image 
                            src={item.featured_image_url || '/placeholder.png'} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase truncate group-hover:text-[#C75B39] transition-colors">{item.name}</p>
                          <p className="text-[10px] text-white/40 font-bold">{formatCurrency(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center md:text-left">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {['Cement', 'Timber', 'Steel Rebars', 'Roofing'].map((tag) => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="border border-white/10 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#C75B39] hover:text-[#C75B39] transition-all bg-white/5 hover:bg-white/10"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}