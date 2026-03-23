'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/supabase/client';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';

/* -------------------- DATA -------------------- */
const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Journal', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const { toggleCart, toggleSearch } = useUIStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  /* -------------------- LOGIC -------------------- */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const isTransparent = pathname === '/' && !isScrolled && !isOpen;

  const isAdmin = user?.email === 'dappah865@gmail.com';

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [pathname, supabase]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* -------------------- RENDER -------------------- */
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`
          fixed top50 inset-x-0 z-[100]
          transition-all duration-500 ease-out
          ${
            isTransparent
              ? 'bg-transparent backdrop-blur-none'
              : 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
          }
          border-b ${isTransparent ? 'border-transparent' : 'border-zinc-100'}
          pt-[env(safe-area-inset-top)]
        `}
      >
        <div className="px-6 mx-auto max-w-7xl">
          <div className="h-[80px] flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 group z-[101]">
              <div className="relative w-12 h-12 transition-transform duration-500 group-hover:rotate-12">
                <Image
                  src="/assets/images/logos/navbar icon.png"
                  alt="Asham Logo"
                  sizes="48px"
                  fill
                  className="object-contain"
                />
              </div>
              <div
                className={`transition-colors duration-500 ${
                  isTransparent ? 'text-white' : 'text-[#06392F]'
                }`}
              >
                <p className="text-2xl font-black leading-none tracking-tighter uppercase">
                  Asham
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">
                  Design & Construction
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <ul className="items-center hidden gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      flex items-center
                      text-xs font-bold uppercase tracking-[0.2em]
                      transition-all duration-300
                      px-3 py-2 rounded-full
                      ${
                        isActive(link.href)
                          ? isTransparent
                            ? 'text-white bg-white/10'
                            : 'text-[#C75B39] bg-[#C75B39]/10'
                          : isTransparent
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-[#06392F]/80 hover:text-[#06392F] hover:bg-[#06392F]/5'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ACTIONS */}
            <div className="items-center hidden gap-3 lg:flex">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className={`
                  p-3 rounded-full transition-all duration-300 hover:scale-105
                  ${
                    isTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-[#06392F] hover:bg-[#06392F]/5'
                  }
                  hover:text-[#C75B39]
                `}
              >
                <Search size={18} strokeWidth={2} />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`
                  p-3 rounded-full transition-all duration-300 hover:scale-105
                  ${
                    isTransparent
                      ? 'text-white hover:bg-white/10'
                      : 'text-[#06392F] hover:bg-[#06392F]/5'
                  }
                  hover:text-[#C75B39]
                `}
              >
                <ShoppingBag size={18} strokeWidth={2} />
              </button>

              {/* Account/Login */}
              <Link
                href={isAdmin ? '/admin/posts' : user ? '/dashboard' : '/login'}
                className={`
                  relative overflow-hidden group
                  px-7 py-3 text-xs font-black uppercase tracking-[0.2em]
                  transition-all duration-500 hover:scale-105
                  rounded-full
                  ${
                    isTransparent
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-[#06392F]'
                      : 'bg-[#06392F] text-white hover:bg-[#C75B39]'
                  }
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {user ? (
                    <>
                      <User size={14} />
                      {isAdmin ? 'Admin' : 'Account'}
                    </>
                  ) : (
                    <>
                      <LogIn size={14} />
                      Login
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ mixBlendMode: 'overlay' }}
                />
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsOpen(true)}
              className={`
                lg:hidden p-3 rounded-full transition-all duration-300
                ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-[#06392F] hover:bg-[#06392F]/5'
                }
              `}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="
                fixed top-0 right-0 h-full w-[85%] max-w-sm
                bg-white z-[99]
                pt-[calc(env(safe-area-inset-top)+88px)]
                px-8 rounded-l-3xl shadow-2xl
              "
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#C75B39]/10 hover:text-[#C75B39] transition-colors"
              >
                <X size={24} />
              </button>

              <nav className="space-y-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-2xl font-black uppercase text-[#06392F] hover:text-[#C75B39] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-5 bg-[#06392F] text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 hover:bg-[#C75B39]"
                >
                  Client Portal
                </Link>

                <button
                  onClick={() => {
                    toggleSearch();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center w-full gap-2 py-5 border-2 border-[#06392F] text-[#06392F] font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 hover:border-[#C75B39] hover:text-[#C75B39]"
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
