'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Calculator, 
  FileText, 
  ShoppingCart, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  PenTool
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  role: string;
  userName: string;
}

export default function AdminUIWrapper({ children, role, userName }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Inventory & Plans', href: '/admin/products', icon: Package },
    { name: 'The Journal', href: '/admin/posts', icon: PenTool }, // Added Blog Management
    { name: 'Project Estimator', href: '/admin/calculator', icon: Calculator },
    { name: 'Saved Quotes', href: '/admin/quotes', icon: FileText },
    { name: 'Order Ledger', href: '/admin/orders', icon: ShoppingCart },
    { name: 'User Registry', href: '/admin/users', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      {/* --- SIDEBAR: SAFARICOM DARK MODE STYLE --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#06392F] text-white transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-8 pb-12">
            <h1 className="text-2xl italic font-black leading-none tracking-tighter uppercase">
              Asham <span className="text-[#C75B39]">ACDL</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="h-[1px] w-4 bg-[#C75B39]"></span>
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">HQ Command</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group
                  ${isActive(item.href) 
                    ? 'bg-[#C75B39] text-white shadow-xl shadow-[#C75B39]/20' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} strokeWidth={isActive(item.href) ? 3 : 2} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                </div>
                {isActive(item.href) && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 mt-auto">
            <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C75B39] flex items-center justify-center font-black text-white shadow-lg">
                  {userName[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black tracking-tight uppercase truncate">{userName}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-24 px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-[#06392F] bg-gray-50 rounded-2xl lg:hidden hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl italic font-black tracking-tighter text-[#06392F] uppercase">
                {navigation.find(n => isActive(n.href))?.name || 'Operations'}
              </h2>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em]">System Active • 0.04ms latency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-5 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
              <Settings size={14} /> System
            </button>
            <button className="flex items-center gap-2 px-5 py-3 text-red-600 transition-all duration-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white group">
              <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest">Terminate Session</span>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}