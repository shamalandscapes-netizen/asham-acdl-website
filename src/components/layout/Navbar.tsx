'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { Menu, X, ShoppingBag, Search, User, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui-store';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
  { name: 'About', href: '/about' },
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const isTransparent = pathname === '/' && !isScrolled && !isOpen;
  const isAdmin = user?.email === 'dappah865@gmail.com';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
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

  const textColor = isTransparent ? 'text-white' : 'text-[#06392F]';
  const hoverBg = isTransparent ? 'hover:bg-white/10' : 'hover:bg-[#06392F]/5';

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/90 backdrop-blur-xl border-b border-[#06392F]/5'
        }`}
      >
        <div className="px-6 lg:px-12 mx-auto max-w-7xl">
          <div className="h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/images/logos/navbar icon.png"
                  alt="Asham"
                  fill
                  className="object-contain"
                />
              </div>
              <div className={textColor}>
                <p className="text-lg font-bold leading-none tracking-tight">
                  Asham
                </p>
                <p className="text-[8px] font-medium tracking-[0.25em] uppercase opacity-50 mt-0.5">
                  Design & Construction
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 rounded-full ${textColor} ${hoverBg} ${
                      isActive(link.href)
                        ? isTransparent
                          ? 'bg-white/10'
                          : 'text-[#C75B39]'
                        : ''
                    }`}
                  >
                    {link.name}
                    {isActive(link.href) && !isTransparent && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C75B39]" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={toggleSearch}
                className={`p-2.5 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              >
                <Search size={16} strokeWidth={1.5} />
              </button>

              <button
                onClick={toggleCart}
                className={`p-2.5 rounded-full transition-colors duration-300 ${textColor} ${hoverBg}`}
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
              </button>

              <Link
                href={isAdmin ? '/admin/posts' : user ? '/dashboard' : '/login'}
                className={`ml-2 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                  isTransparent
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white hover:text-[#06392F]'
                    : 'bg-[#06392F] text-white hover:bg-[#C75B39]'
                }`}
              >
                {user ? (isAdmin ? 'Admin' : 'Account') : 'Login'}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className={`lg:hidden p-2.5 rounded-full transition-colors ${textColor} ${hoverBg}`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[99] px-8 pt-24"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#06392F] hover:text-[#C75B39] transition-colors"
              >
                <X size={20} />
              </button>

              <nav className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-3 text-sm font-medium tracking-wide ${
                        isActive(link.href)
                          ? 'text-[#C75B39]'
                          : 'text-[#06392F]/70 hover:text-[#06392F]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-10 pt-8 border-t border-[#06392F]/10 space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center py-3.5 bg-[#06392F] text-white text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-[#C75B39] transition-colors"
                >
                  {user ? 'Account' : 'Client Login'}
                </Link>

                <button
                  onClick={() => {
                    toggleSearch();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center w-full gap-2 py-3.5 border border-[#06392F]/20 text-[#06392F] text-xs font-semibold uppercase tracking-widest rounded-lg hover:border-[#C75B39] hover:text-[#C75B39] transition-colors"
                >
                  <Search size={14} />
                  Search
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}