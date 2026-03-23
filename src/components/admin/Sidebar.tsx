import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, CreditCard, HardHat, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'accounts', 'employee'] },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, roles: ['super_admin', 'admin', 'employee'] },
  { name: 'Finance', href: '/admin/finance', icon: CreditCard, roles: ['super_admin', 'accounts'] },
  { name: 'Staff Management', href: '/admin/staff', icon: Users, roles: ['super_admin'] },
  { name: 'Contractors', href: '/admin/contractors', icon: HardHat, roles: ['super_admin', 'admin'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['super_admin'] },
];

export default function AdminSidebar({ userRole }: { userRole: string }) {
  return (
    <aside className="fixed top-0 left-0 w-64 h-screen p-4 text-white bg-slate-900">
      <div className="px-2 mb-8">
        <h2 className="text-xl font-bold text-blue-400">Asham Admin</h2>
        <p className="text-xs capitalize text-slate-400">{userRole.replace('_', ' ')}</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          if (!item.roles.includes(userRole)) return null;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 transition rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}