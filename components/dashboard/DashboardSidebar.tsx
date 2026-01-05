'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  FileText,
  CreditCard
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Digital Downloads', href: '/dashboard/downloads', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    // Redirect to login page
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-gray-200 md:w-64">
      
      {/* User Info / Header */}
      <div className="hidden p-6 border-b border-gray-100 md:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#06392F] text-white flex items-center justify-center font-bold shadow-sm">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">My Account</p>
            <p className="text-xs text-gray-500">Manage your activity</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-[#06392F]/10 text-[#06392F] font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} className={isActive ? 'text-[#06392F]' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      
    </div>
  );
}