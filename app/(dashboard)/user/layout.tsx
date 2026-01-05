'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  UserCircle
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Logout Logic
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Define Navigation Links
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', href: '/dashboard/projects', icon: FileText },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Profile', href: '/user/profile', icon: UserCircle }, // Updated to match your file structure
    // { name: 'Settings', href: '/dashboard/settings', icon: Settings }, // Commented out until you create this page
  ];

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#06392F] text-white transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">Asham<span className="text-[#C75B39]">.</span> Portal</h2>
            <p className="mt-1 text-xs text-gray-400">Client Dashboard</p>
          </div>
          {/* ✅ FIX: Added aria-label for accessibility */}
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="text-gray-400 md:hidden hover:text-white"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if current path starts with the link href (for active state on subpages)
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)} // Close menu on click (mobile)
                className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white font-bold border-l-4 border-[#C75B39]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} /> 
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full gap-3 px-4 py-3 text-red-400 transition-colors rounded hover:text-red-300 hover:bg-white/5"
          >
            <LogOut size={20} /> 
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        
        {/* Top Header (Mobile Only) */}
        <header className="z-30 flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm md:hidden">
           <div className="font-bold text-[#06392F] text-lg">Asham Dashboard</div>
           {/* ✅ FIX: Added aria-label for accessibility */}
           <button 
             onClick={() => setIsMobileOpen(true)} 
             className="text-gray-600 hover:text-[#C75B39]"
             aria-label="Open menu"
           >
             <Menu size={24} />
           </button>
        </header>

        {/* Page Content Injection */}
        <main className="relative flex-1 p-4 overflow-y-auto md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}