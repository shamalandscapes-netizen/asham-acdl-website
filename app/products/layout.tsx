'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, 
  Filter, 
  ChevronRight, 
  Package, 
  FileText,
  Hammer,
  Droplets,
  Zap,
  Layout,
  Layers,
  Home
} from 'lucide-react';

// Updated categories to match your Storefront structure
const CATEGORIES = [
  { name: 'All Products', href: '/products', icon: Package },
  { name: 'Cement & Binders', href: '/products/cement-binders', icon: Layers },
  { name: 'Steel & Reinforcement', href: '/products/steel-reinforcement', icon: Zap },
  { name: 'Roofing Materials', href: '/products/roofing-materials', icon: Layout },
  { name: 'Finishes & Paints', href: '/products/finishes-paints', icon: ChevronRight },
  { name: 'Plumbing & Water', href: '/products/plumbing-water', icon: Droplets },
  { name: 'Furniture', href: '/products/furniture', icon: Home },
  { name: 'Digital Plans', href: '/products/digital-plans', icon: FileText },
];

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gray-50">
      
      {/* MOBILE FILTER BAR */}
      <div className="sticky z-30 flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm md:hidden top-16">
        <span className="flex items-center gap-2 font-bold text-gray-700">
           <Package size={18} /> Browse Store
        </span>
        <button 
          type="button"
          title={isSidebarOpen ? 'Close Menu' : 'Open Categories'}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-sm font-bold text-[#06392F] bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isSidebarOpen ? <X size={18} /> : <Filter size={18} />}
          {isSidebarOpen ? 'Close' : 'Categories'}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out
          md:translate-x-0 md:sticky md:top-20 md:h-[calc(100vh-5rem)] shrink-0
          ${isSidebarOpen ? 'translate-x-0 pt-20 md:pt-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6">
          <h2 className="text-lg font-black text-[#06392F] mb-6 hidden md:flex items-center gap-2">
            <Filter size={20} /> Categories
          </h2>
          
          <nav className="space-y-1">
            {CATEGORIES.map((category) => {
              const isActive = pathname === category.href || (category.href !== '/products' && pathname.startsWith(category.href));
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                    ${isActive 
                      ? 'bg-[#06392F] text-white shadow-lg' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#C75B39]'
                    }
                  `}
                >
                  <Icon 
                    size={18} 
                    className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#C75B39]'}`} 
                  />
                  {category.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar CTA */}
          <div className="mt-10 bg-[#06392F]/5 p-5 rounded-2xl border border-[#06392F]/10 text-center">
            <Hammer className="mx-auto text-[#C75B39] mb-3" size={24} />
            <h3 className="font-black text-[#06392F] text-sm mb-2">Bulk Pricing?</h3>
            <p className="mb-4 text-[11px] leading-relaxed text-gray-500 font-medium">
              Uploading a Bill of Quantities? Contact us for custom rates.
            </p>
            <Link 
              href="/contact"
              className="text-xs font-bold bg-white text-[#06392F] px-4 py-2.5 rounded-xl border border-gray-100 hover:border-[#06392F] hover:shadow-md transition-all block"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </aside>

      {/* OVERLAY for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 duration-300 bg-black/50 md:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-w-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}