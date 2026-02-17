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
  ChevronDown,
  Leaf,
  HardHat,
  Package,
  DraftingCompass,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';

/* -------------------- DATA -------------------- */
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
        desc: 'NEMA licensing & audits',
      },
      {
        name: 'Construction Services',
        href: '/services/construction',
        icon: <HardHat size={16} />,
        desc: 'Residential & Commercial',
      },
      {
        name: 'Architectural Services',
        href: '/services/architecture',
        icon: <DraftingCompass size={16} />,
        desc: 'Blueprints & 3D Renders',
      },
      {
        name: 'Materials Supply',
        href: '/products',
        icon: <Package size={16} />,
        desc: 'Quality building hardware',
      },
    ],
  },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
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

  const isTransparentDesktop =
    pathname === '/' && !isScrolled && !isOpen;

  const isAdmin = user?.email === 'jmuli758@gmail.com';

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
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
          fixed top-0 inset-x-0 z-[100]
          transition-[background-color,backdrop-filter] duration-500 ease-out
          bg-white/90 backdrop-blur-xl
          lg:${isTransparentDesktop ? 'bg-transparent' : ''}
          border-b border-zinc-100
          pt-[env(safe-area-inset-top)]
        `}
      >
        <div className="px-6 mx-auto max-w-7xl">
          <div className="h-[72px] flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 group z-[101]">
              <div className="relative w-10 h-10 transition-transform duration-500 group-hover:rotate-45">
                <Image
                  src="/assets/images/logos/navbar icon.png"
                  alt="Asham Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div
                className={`transition-colors ${
                  isTransparentDesktop
                    ? 'text-white'
                    : 'text-[#06392F]'
                }`}
              >
                <p className="text-xl font-black leading-none uppercase">
                  Asham
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] opacity-60">
                  Design & Build
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <ul className="items-center hidden gap-10 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`
                      flex items-center gap-1
                      text-xs font-black uppercase tracking-[0.25em]
                      transition-colors
                      ${
                        isActive(link.href)
                          ? 'text-[#C75B39]'
                          : isTransparentDesktop
                          ? 'text-white'
                          : 'text-[#06392F]'
                      }
                      hover:text-[#C75B39]
                    `}
                  >
                    {link.name}
                    {link.subServices && (
                      <ChevronDown
                        size={12}
                        className="transition-transform duration-300 group-hover:rotate-180"
                      />
                    )}
                  </Link>

                  {/* DESKTOP DROPDOWN */}
                  {link.subServices && (
                    <div className="absolute invisible pt-8 transition-all duration-300 -translate-x-1/2 opacity-0 left-1/2 group-hover:opacity-100 group-hover:visible">
                      <div className="w-[340px] bg-white/95 backdrop-blur-xl border border-zinc-100 rounded-3xl shadow-2xl p-2">
                        {link.subServices.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="flex gap-4 px-5 py-4 rounded-2xl transition hover:bg-[#06392F] hover:text-white"
                          >
                            <div className="p-2 rounded-xl bg-zinc-50">
                              {sub.icon}
                            </div>
                            <div>
                              <p className="text-xs font-black tracking-widest uppercase">
                                {sub.name}
                              </p>
                              <p className="text-[11px] opacity-60 mt-1">
                                {sub.desc}
                              </p>
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
            <div className="items-center hidden gap-5 lg:flex">
              <button
                onClick={toggleSearch}
                className={`p-2 rounded-full transition hover:scale-110 hover:text-[#C75B39]
                ${isTransparentDesktop ? 'text-white' : 'text-[#06392F]'}`}
              >
                <Search size={18} strokeWidth={2.5} />
              </button>

              <button
                onClick={toggleCart}
                className={`p-2 rounded-full transition hover:scale-110 hover:text-[#C75B39]
                ${isTransparentDesktop ? 'text-white' : 'text-[#06392F]'}`}
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
              </button>

              <Link
                href={isAdmin ? '/admin/posts' : user ? '/dashboard' : '/login'}
                className={`
                  px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em]
                  transition shadow-lg
                  ${
                    isTransparentDesktop
                      ? 'bg-white text-[#06392F] hover:bg-[#C75B39] hover:text-white'
                      : 'bg-[#06392F] text-white hover:bg-[#C75B39]'
                  }
                `}
              >
                {isAdmin ? 'Admin Portal' : user ? 'Account' : 'Login'}
              </Link>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 text-[#06392F] z-[101]"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="
                fixed top-0 right-0 h-full w-[85%] max-w-sm
                bg-white z-[99]
                pt-[calc(env(safe-area-inset-top)+88px)]
                px-8
              "
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6"
              >
                <X size={26} />
              </button>

              <nav className="space-y-8">
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      className="block text-2xl font-black uppercase text-[#06392F] hover:text-[#C75B39]"
                    >
                      {link.name}
                    </Link>

                    {link.subServices && (
                      <div className="pl-4 mt-3 ml-3 space-y-3 border-l border-zinc-200">
                        {link.subServices.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block text-xs uppercase tracking-widest text-zinc-500 hover:text-[#06392F]"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-12">
                <Link
                  href="/login"
                  className="block text-center py-5 rounded-2xl bg-[#06392F] text-white font-black uppercase tracking-widest text-xs"
                >
                  Client Portal
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
