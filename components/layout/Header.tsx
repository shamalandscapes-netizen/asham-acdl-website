'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  ChevronDown 
} from 'lucide-react';
import { createClient } from '@/supabase/client';

// Navigation Links Configuration
const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Store', href: '/products' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const supabase = createClient();

  // 1. Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Fetch Cart Count (Simple Poll or you can use a Context)
  useEffect(() => {
    // This is a simple fetch. For real-time updates, consider a Cart Context provider.
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          // Assuming API returns array of items
          setCartCount(data.length || 0);
        }
      } catch (e) {
        console.error('Failed to fetch cart count');
      }
    };
    fetchCartCount();
  }, [pathname]); // Refresh count on page navigation

  // 3. Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled || isOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}
      `}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#06392F] text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-[#C75B39] transition-colors">
              A
            </div>
            <div className={`font-bold text-lg leading-tight ${isScrolled || isOpen ? 'text-gray-900' : 'text-white'}`}>
              Asham <br/>
              <span className={`text-xs font-normal ${isScrolled || isOpen ? 'text-gray-500' : 'text-gray-200'}`}>Construction</span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="items-center hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  text-sm font-medium transition-colors hover:text-[#C75B39]
                  ${pathname === link.href 
                    ? 'text-[#C75B39] font-bold' 
                    : (isScrolled ? 'text-gray-600' : 'text-gray-100 hover:text-white')
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT ICONS (Cart & User) */}
          <div className="items-center hidden gap-6 md:flex">
            {/* Cart Icon */}
            <Link href="/cart" className={`relative group ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
              <ShoppingBag size={22} className="group-hover:text-[#C75B39] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C75B39] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link 
              href="/dashboard" 
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
                ${isScrolled 
                  ? 'bg-[#06392F] text-white hover:bg-[#0A4D40]' 
                  : 'bg-white text-[#06392F] hover:bg-gray-100'
                }
              `}
            >
              <User size={16} /> Account
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className={`md:hidden ${isScrolled || isOpen ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  block px-4 py-3 rounded-lg text-base font-medium
                  ${pathname === link.href 
                    ? 'bg-[#06392F]/10 text-[#06392F] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-2 my-2 border-t border-gray-100">
              <Link 
                href="/cart"
                className="flex items-center justify-between px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={18} /> Cart
                </span>
                <span className="bg-[#C75B39] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount} Items
                </span>
              </Link>
              
              <Link 
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                <User size={18} /> My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}