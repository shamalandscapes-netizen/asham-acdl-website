'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Menu, X, ShoppingBag, ChevronDown,
  Leaf, HardHat, Package, DraftingCompass, Search
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { 
    name: 'Services', 
    href: '/services',
    subServices: [
      { 
        name: 'Environmental Assessment', 
        href: '/services/eia',
        icon: <Leaf size={16} />,
        desc: 'NEMA licensing & audits'
      },
      { 
        name: 'Construction Services', 
        href: '/services/construction',
        icon: <HardHat size={16} />,
        desc: 'Residential & Commercial'
      },
      { 
        name: 'Architectural Services', 
        href: '/services/architecture', 
        icon: <DraftingCompass size={16} />,
        desc: 'Blueprints & 3D Renders'
      },
      { 
        name: 'Materials Supply', 
        href: '/products',
        icon: <Package size={16} />,
        desc: 'Quality building hardware'
      },
    ]
  },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
  { name: 'Journal', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const { toggleSearch, toggleCart } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [pathname, supabase]);

  useEffect(() => setIsOpen(false), [pathname]);

  const isTransparent = pathname === '/' && !isScrolled && !isOpen;
  const isAdmin = user?.email === 'jmuli758@gmail.com';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      isTransparent 
        ? 'bg-transparent py-8' 
        : 'bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-4 shadow-sm'
    }`}>
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <Link href="/" className="flex items-center gap-4 group relative z-[101]">
            <div className="relative w-10 h-10 transition-transform duration-500 group-hover:rotate-90">
              <Image 
                src="/assets/images/logos/navbar icon.png" 
                alt="Asham Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div className={`flex flex-col transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
               <span className="text-xl font-black leading-none tracking-tighter uppercase">Asham</span>
               <span className={`text-[8px] font-bold uppercase tracking-[0.4em] opacity-60`}>Design & Build</span>
            </div>
          </Link>

          {/* DESKTOP NAV - BLUEPRINT STYLE */}
          <ul className="items-center hidden gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.name} className="relative py-2 group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#C75B39]
                    ${pathname === link.href ? 'text-[#C75B39]' : (isTransparent ? 'text-zinc-100' : 'text-[#06392F]')}
                  `}
                >
                  {link.name}
                  {link.subServices && <ChevronDown size={10} className="transition-transform duration-500 group-hover:rotate-180" />}
                </Link>

                {/* Sub-services Dropdown */}
                {link.subServices && (
                  <div className="absolute -left-10 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 min-w-[320px]">
                    <div className="p-2 overflow-hidden bg-white/95 backdrop-blur-md border border-zinc-100 shadow-2xl rounded-[2rem] bg-blueprint">
                      {link.subServices.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center gap-4 px-5 py-4 transition-all rounded-2xl hover:bg-[#06392F] hover:text-white group/item"
                        >
                          <div className="p-2.5 bg-zinc-50 rounded-xl group-hover/item:bg-white/10 transition-colors">
                            {sub.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">{sub.name}</p>
                            <p className="text-[8px] opacity-60 font-bold uppercase tracking-tighter mt-1">{sub.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Indicator Line */}
                {pathname === link.href && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C75B39]" />
                )}
              </li>
            ))}
          </ul>

          {/* ACTIONS & AUTH */}
          <div className="items-center hidden gap-6 lg:flex">
            <div className="flex items-center gap-4 pr-6 border-r border-zinc-200/20">
              <button onClick={toggleSearch} className={`transition-all hover:scale-110 hover:text-[#C75B39] ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
                <Search size={18} strokeWidth={2.5} />
              </button>
              <button onClick={toggleCart} className={`relative transition-all hover:scale-110 hover:text-[#C75B39] ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
                <ShoppingBag size={18} strokeWidth={2.5} />
              </button>
            </div>

            <Link 
              href={isAdmin ? "/admin/posts" : (user ? "/dashboard" : "/login")} 
              className={`px-7 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-lg ${
                isTransparent 
                  ? 'bg-white text-[#06392F] hover:bg-[#C75B39] hover:text-white' 
                  : 'bg-[#06392F] text-white hover:bg-[#C75B39] shadow-[#06392F]/20'
              }`}
            >
              {isAdmin ? 'Admin Portal' : (user ? 'Account' : 'Login')}
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`lg:hidden relative z-[101] p-2 transition-colors ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 bg-white z-[100] p-8 pt-32 bg-blueprint"
          >
            <div className="grid gap-10">
              {NAV_LINKS.map((link) => (
                <div key={link.name} className="space-y-6">
                  <Link 
                    href={link.href} 
                    className="text-5xl font-black uppercase tracking-tighter text-[#06392F] hover:text-[#C75B39] transition-colors"
                  >
                    {link.name}
                  </Link>
                  {link.subServices && (
                    <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-zinc-100">
                      {link.subServices.map(sub => (
                        <Link key={sub.name} href={sub.href} className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase hover:text-[#06392F]">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute space-y-4 bottom-12 left-8 right-8">
              <Link href="/login" className="block w-full text-center py-5 bg-[#06392F] text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                Client Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}