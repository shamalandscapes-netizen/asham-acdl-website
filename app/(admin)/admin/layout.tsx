'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Settings, LogOut, Menu, X, Bell, Search, ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string>('staff');
  const [userName, setUserName] = useState<string>('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role, full_name')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setRole(data.role || 'staff');
          setUserName(data.full_name || 'Admin');
        }
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; // Hard redirect to clear all states
  };

  const isSuper = ['super_admin', 'it'].includes(role);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, show: true },
    { name: 'Products', href: '/admin/products', icon: Package, show: true },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, show: true },
    { name: 'Team Management', href: '/admin/users', icon: Users, show: isSuper },
    { name: 'Settings', href: '/admin/settings', icon: Settings, show: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#06392F] text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out border-r border-white/5 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo Section */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="h-9 w-9 bg-[#C75B39] rounded-lg flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black leading-none tracking-tighter uppercase">Asham</span>
                  <span className="text-[10px] text-[#C75B39] font-bold tracking-[0.2em] uppercase mt-0.5">Control Panel</span>
                </div>
              </Link>
              <button 
                type="button" 
                className="transition-colors lg:hidden text-white/50 hover:text-white" 
                onClick={() => setSidebarOpen(false)}
                aria-label="Close Sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-3 pb-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">Main Menu</p>
            {navigation.map((item) => item.show && (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                  pathname === item.href 
                    ? 'bg-white/10 text-[#C75B39] border border-white/5 shadow-inner' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={pathname === item.href ? 'text-[#C75B39]' : 'group-hover:text-white transition-colors'} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                {pathname === item.href && <ChevronRight size={14} className="animate-pulse" />}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 m-4 border bg-black/10 rounded-2xl border-white/5">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Online</span>
            </div>
            <button 
              type="button" 
              onClick={handleSignOut} 
              className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex flex-col flex-1 min-h-screen lg:ml-64">
        {/* Modern Top Header with Blur Effect */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-xl lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              className="p-2 text-gray-500 transition-colors rounded-lg lg:hidden hover:bg-gray-100" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 group focus-within:border-[#C75B39] transition-all">
              <Search size={16} className="text-gray-400 group-focus-within:text-[#C75B39]" />
              <input 
                type="text" 
                placeholder="Search products, orders..." 
                className="bg-transparent border-none text-[13px] focus:ring-0 w-64 text-gray-600 placeholder:text-gray-400" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              className="relative p-2 text-gray-400 transition-all hover:bg-gray-50 rounded-xl active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#C75B39] rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="w-px h-6 mx-1 bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-black leading-none text-gray-900">{userName}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <ShieldCheck size={10} className="text-[#C75B39]" />
                  <p className="text-[10px] text-[#C75B39] font-black uppercase tracking-tighter">
                    {role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-[#06392F] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#06392F]/20 border border-white/10">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-6 lg:p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-[#C75B39] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 bg-[#06392F] rounded-full"></div>
                </div>
              </div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase animate-pulse">Initializing Dashboard</p>
            </div>
          ) : (
            <div className="duration-700 ease-out animate-in fade-in slide-in-from-bottom-2">
              {children}
            </div>
          )}
        </div>
      </main>

      {/* Modern Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 transition-all duration-300 bg-gray-900/40 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
}