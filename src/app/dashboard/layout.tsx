'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { 
  LayoutDashboard, ShoppingBag, User, Settings, 
  HardHat, LogOut, Menu, X, Loader2, Plus, 
  ChevronRight, Bell,
  FileDown
} from 'lucide-react';

const USER_NAVIGATION = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Projects', href: '/dashboard/my-projects', icon: HardHat },
  { name: 'My Orders', href: '/dashboard/my-orders', icon: ShoppingBag },
  { name: 'Downloads', href: '/dashboard/my-downloads', icon: FileDown },
  { name: 'Profile', href: '/dashboard/user', icon: User },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
   
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // FIX: Cast as any to bypass the 'never' type restriction
      const { data } = await (supabase as any)
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // FIX: Cast the result to access the full_name property safely
      if (data) {
        const profile = data as { full_name: string };
        setUserName(profile.full_name || 'User');
      } else {
        setUserName('User');
      }
      
      setLoading(false);
    }
    checkUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-[#06392F]" size={40} />
        <p className="mt-4 font-medium text-gray-500 animate-pulse">Building your space...</p>
      </div>
    );
  }

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || 'Overview';
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* SIDEBAR (Desktop) */}
      {/* FIXED: Using standard property for transition duration to avoid build warnings */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#06392F] text-white [transition-duration:300ms] ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:flex lg:flex-col`}>
        
        {/* Branding */}
        <div className="flex items-center h-20 px-8 border-b border-white/10">
          <Link href="/" className="text-2xl font-black tracking-tighter">
            ASHAM<span className="text-[#C75B39]">.</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {USER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center gap-4 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C75B39] text-white shadow-lg shadow-[#C75B39]/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-white/5">
             <div className="w-10 h-10 rounded-lg bg-[#C75B39] flex items-center justify-center font-bold">
               {userName.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-bold tracking-widest uppercase text-white/40">Client</p>
               <p className="text-sm font-bold truncate">{userName}</p>
             </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-red-400 transition-all rounded-xl hover:bg-red-500/10"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 min-w-0">
        
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 border-b border-gray-200 bg-white/80 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            
            <div className="items-center hidden gap-2 text-sm font-medium md:flex">
              <span className="text-gray-400">Dashboard</span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-[#06392F] capitalize">{getPageTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button type="button" title="Notifications" aria-label="Notifications" className="p-2 text-gray-400 hover:text-[#06392F] transition-colors">
               <Bell size={20} />
             </button>
             <Link 
               href="/products" 
               className="hidden sm:flex items-center gap-2 bg-[#06392F] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#052d25] transition-all shadow-md active:scale-95"
             >
               <Plus size={18} /> New Order
             </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 mx-auto max-w-7xl md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Close Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#06392F]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
