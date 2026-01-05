'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  Settings, 
  HardHat, 
  LogOut, 
  Menu, 
  X,
  Loader2
} from 'lucide-react';

const USER_NAVIGATION = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Projects', href: '/dashboard/projects', icon: HardHat },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Profile', href: '/user/profile', icon: User },
  { name: 'Settings', href: '/user/settings', icon: Settings },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
   
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // 1. Check Auth & Get Name
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      // Get name for the sidebar greeting
      const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single();
      if (data) setUserName(data.full_name || 'User');
      
      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-[#06392F]">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex md:flex-col`}>
        
        {/* Header / Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link href="/" className="text-xl font-bold text-[#06392F] tracking-tight">
            ASHAM<span className="text-[#C75B39]">.</span>
          </Link>
          {/* ✅ Fixed: Added aria-label and type */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-gray-400 md:hidden"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info Snippet */}
        <div className="p-6 pb-2">
          <div className="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Welcome</div>
          <div className="font-bold text-gray-800 truncate">{userName}</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {USER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#06392F] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100">
          {/* ✅ Fixed: Added type */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <div className="font-bold text-[#06392F]">My Dashboard</div>
          {/* ✅ Fixed: Added aria-label and type */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-gray-600"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}