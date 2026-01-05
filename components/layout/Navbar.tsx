'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Menu, X, ShoppingBag, User, LogIn, ChevronDown,
  Leaf, HardHat, Package, DraftingCompass
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { 
    name: 'Services', 
    href: '/services',
    subServices: [
      { 
        name: 'Environmental Assessment', 
        href: '/services/eia',
      },
      { 
        name: 'Construction Services', 
        href: '/services/construction',
      },
      { 
        name: 'Materials Supply', 
        href: '/products',
      },
      { 
        name: 'Architectural Services', 
        href: '/services/architecture', 
      },
    ]
  },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUserAndCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCartCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) { console.error('Cart error'); }
    };
    checkUserAndCart();
  }, [pathname, supabase]);

  useEffect(() => setIsOpen(false), [pathname]);

  const isTransparent = pathname === '/' && !isScrolled && !isOpen;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent py-5' : 'bg-white shadow-md py-3'}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO - Updated with your path */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden">
              <Image 
                src="/assets/images/logos/navbar icon.png" 
                alt="Asham Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div className={`font-black uppercase tracking-tighter leading-none flex flex-col ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="items-center hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.name} className="relative py-2 group">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[#C75B39]
                    ${pathname.startsWith(link.href) && link.href !== '/' ? 'text-[#C75B39]' : ''}
                    ${isTransparent ? 'text-gray-200' : 'text-[#06392F]'}
                  `}
                >
                  {link.name}
                  {link.subServices && <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />}
                </Link>

                {/* DROPDOWN MENU - Comprehensive Services */}
                {link.subServices && (
                  <div className="absolute -left-4 pt-4 opacity-0 invisible group-hover:opacity-80 group-hover:visible transition-all duration-300 min-w-[270px]">
                    <div className="p-2 overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-2xl">
                      {link.subServices.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-start gap-4 px-4 py-4 transition-all rounded-xl hover:bg-gray-50 group/item"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover/item:bg-[#06392F] group-hover/item:text-white transition-colors">
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#06392F] mb-1">{sub.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium leading-tight"></p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* ACTIONS */}
          <div className="items-center hidden gap-6 md:flex">
            <Link href="/cart" className={`relative ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
              <ShoppingBag size={20} className="hover:text-[#C75B39] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C75B39] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href={user ? "/dashboard" : "/login"} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isTransparent ? 'bg-white text-[#06392F] hover:bg-[#C75B39] hover:text-white' : 'bg-[#06392F] text-white hover:bg-[#C75B39]'}`}>
              {user ? 'Dashboard' : 'Client Login'}
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden ${isTransparent ? 'text-white' : 'text-[#06392F]'}`}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white fixed inset-x-0 top-[70px] h-screen overflow-y-auto p-6">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="mb-4">
              <Link href={link.href} className="text-2xl font-black uppercase tracking-tighter text-[#06392F]">
                {link.name}
              </Link>
              {link.subServices && (
                <div className="grid gap-4 pl-4 mt-4 border-l-2 border-gray-100">
                  {link.subServices.map(sub => (
                    <Link key={sub.name} href={sub.href} className="flex items-center gap-3">
                      <span className="text-sm font-bold tracking-widest text-gray-600 uppercase">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}