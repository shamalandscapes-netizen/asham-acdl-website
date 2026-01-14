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
  Home,
  Search,
  ShieldCheck,
  Truck,
  Percent,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------
   CATEGORY CONFIG (DIGITAL FIRST)
-------------------------------------------------- */
const CATEGORIES = [
  {
    name: 'Digital Design Products',
    href: '/products/category/digital-plans',
    icon: FileText,
    hot: true,
    description: 'Architectural drawings, BOQs & landscape plans',
  },
  { name: 'All Products', href: '/products', icon: Package },
  { name: 'Cement & Binders', href: '/products/category/cement-binders', icon: Layers },
  { name: 'Steel & Reinforcement', href: '/products/category/steel-reinforcement', icon: Zap },
  { name: 'Roofing Materials', href: '/products/category/roofing-materials', icon: Layout },
  { name: 'Finishes & Paints', href: '/products/category/finishes-paints', icon: ChevronRight },
  { name: 'Plumbing & Water', href: '/products/category/plumbing-water', icon: Droplets },
  { name: 'Furniture', href: '/products/category/furniture', icon: Home },
];

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#F6F8F7] flex flex-col md:flex-row">

      {/* ───────────────── MOBILE HEADER ───────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-white border-b md:hidden">
        <Link href="/products" className="flex items-center gap-2 font-black text-[#06392F]">
          <Package className="text-[#C75B39]" size={20} />
          ASHAM STORE
        </Link>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gray-100 rounded-xl text-[#06392F]"
        >
          <Filter size={14} />
          Categories
        </button>
      </div>

      {/* ───────────────── SIDEBAR ───────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-80 bg-[#FAFBFA] border-r transition-transform duration-300',
          'md:sticky md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">

          {/* Brand */}
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-xl font-black text-[#06392F]">
              <Package className="text-[#C75B39]" />
              ASHAM STORE
            </h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Digital-first construction products
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drawings, BOQs, materials..."
              className="w-full py-3 pl-10 pr-4 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-[#06392F]/20"
            />
          </div>

          {/* Categories */}
          <nav className="flex-1">
            <p className="mb-4 ml-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Categories
            </p>

            <div className="space-y-1">
              {CATEGORIES.map(({ name, href, icon: Icon, hot, description }) => {
                const isActive =
                  pathname === href || (href !== '/products' && pathname.startsWith(href));

                return (
                  <Link
                    key={name}
                    href={href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'group relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      hot
                        ? 'bg-gradient-to-r from-[#06392F] to-[#0A4D40] text-white shadow-lg'
                        : isActive
                        ? 'bg-[#06392F] text-white'
                        : 'text-gray-500 hover:bg-white hover:text-[#C75B39]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <div className="flex flex-col">
                        <span>{name}</span>
                        {description && (
                          <span className="text-[10px] font-medium opacity-70">
                            {description}
                          </span>
                        )}
                      </div>
                    </div>

                    {hot && (
                      <span className="absolute -top-2 -right-2 flex items-center gap-1 bg-[#C75B39] text-white text-[9px] px-2 py-0.5 rounded-full shadow">
                        <Flame size={10} /> HOT
                      </span>
                    )}

                    {isActive && <ChevronRight size={14} className="opacity-70" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Trust */}
          <div className="mt-6 space-y-2 text-xs font-bold text-gray-600">
            <TrustItem icon={<ShieldCheck size={14} />} text="Professional-grade documents" />
            <TrustItem icon={<Truck size={14} />} text="Instant digital delivery" />
            <TrustItem icon={<Percent size={14} />} text="Bulk & custom pricing" />
          </div>

          {/* CTA */}
          <div className="relative p-6 mt-6 bg-white border rounded-3xl">
            <Hammer className="absolute text-gray-100 top-4 right-4" size={40} />
            <h3 className="mb-2 text-sm font-black text-[#06392F]">
              Need Custom Drawings?
            </h3>
            <p className="mb-4 text-[11px] text-gray-500">
              Tailored architectural, BOQ & landscape designs.
            </p>
            <Link
              href="/contact"
              className="block px-4 py-3 text-xs font-black text-center text-white rounded-xl bg-[#06392F] hover:bg-[#C75B39]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ───────────────── MAIN CONTENT ───────────────── */}
      <main className="flex-1 min-w-0">
        <div className="bg-white border-b">
          <div className="px-4 py-10 md:px-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#06392F]">
              Digital Design & Construction Store
            </h1>
            <p className="max-w-2xl mt-2 text-sm text-gray-500">
              Premium architectural drawings, BOQs, landscape plans and certified
              construction materials.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}

/* -------------------------------------------------
   Helpers
-------------------------------------------------- */
function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#C75B39]">{icon}</span>
      {text}
    </div>
  );
}
