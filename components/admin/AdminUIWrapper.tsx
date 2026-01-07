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
  ShieldCheck
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
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Inventory & Catalog', href: '/admin/products', icon: Package },
    { name: 'Project Estimator', href: '/admin/calculator', icon: Calculator },
    { name: 'Saved Quotes', href: '/admin/quotes', icon: FileText },
    { name: 'Order Ledger', href: '/admin/orders', icon: ShoppingCart },
    { name: 'User Registry', href: '/admin/users', icon: Users },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#06392F] text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Section */}
          <div className="px-2 mb-10">
            <h1 className="text-2xl italic font-black leading-none tracking-tighter uppercase">
              Asham <span className="text-[#C75B39]">ACDL</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">Admin Headquarters</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group
                  ${isActive(item.href) 
                    ? 'bg-white text-[#06392F] shadow-lg' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive(item.href) ? 'text-[#06392F]' : ''} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive(item.href) && <ChevronRight size={14} />}
              </Link>
            ))}
          </nav>

          {/* User Profile Summary (Sidebar Footer) */}
          <div className="pt-6 mt-auto border-t border-white/10">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C75B39] to-[#E87E5D] flex items-center justify-center font-black">
                {userName[0]}
              </div>
              <div>
                <p className="text-xs font-black tracking-tight uppercase">{userName}</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-400" />
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-8 bg-white border-b border-gray-100">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:block">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Operational Pulse</p>
            <h2 className="text-lg italic font-black tracking-tighter text-gray-900 uppercase">
              {navigation.find(n => n.href === pathname)?.name || 'Command Center'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors">
              Settings
            </button>
            <button className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}