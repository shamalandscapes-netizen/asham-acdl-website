'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Package, ShoppingBag, User, Clock, ArrowRight, 
  Download, Loader2, MapPin, CreditCard, ShieldCheck,
  TrendingUp, HardHat, FileText
} from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string; 
  mpesa_ref: string | null;
}

interface UserProfile {
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
}

export default function UserDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalSpent: 0, activeOrders: 0 });

  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        // Fetch Profile & Orders in parallel for performance
        const [profileRes, ordersRes] = await Promise.all([
          (supabase as any).from('user_profiles').select('*').eq('id', user.id).single(),
          (supabase as any).from('orders').select('*').eq('customer_id', user.id).order('created_at', { ascending: false })
          ]);

        if (profileRes.data) setProfile(profileRes.data);
        
        if (ordersRes.data) {
          const mappedOrders = ordersRes.data.map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            total_amount: order.total_amount,
            status: order.payment_status || 'pending',
            mpesa_ref: order.mpesa_receipt || null,
          }));
          
          setOrders(mappedOrders);

          // Calculate KPIs
          const spent = mappedOrders.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0);
          const active = mappedOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length;
          setStats({ totalSpent: spent, activeOrders: active });
        }
      } catch (error) {
        console.error('Dashboard Load Error:', error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'paid' || s === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'delivered') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'cancelled') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin h-10 w-10 text-[#06392F] mb-4" />
      <p className="font-medium text-gray-400">Loading your project data...</p>
    </div>
  );

  return (
    <div className="pb-12 space-y-8">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#06392F] text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            {profile?.role === 'super_admin' && (
              <span className="bg-[#C75B39] text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 tracking-widest shadow-lg">
                <ShieldCheck size={12} /> SUPER ADMIN
              </span>
            )}
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
            Hello, {profile?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-green-50/70">
            Your construction portal is up to date. You have <span className="text-[#C75B39] font-bold">{stats.activeOrders} active material orders</span> in progress.
          </p>
        </div>
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full bg-white/5 blur-3xl" />
        <HardHat className="absolute text-white transition-transform duration-700 w-80 h-80 -bottom-20 -right-20 opacity-5 -rotate-12 group-hover:rotate-0" />
      </div>

      {/* --- KPI STATS GRID --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard 
          title="Total Investment" 
          value={`KES ${stats.totalSpent.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-500" />} 
          subtitle="Lifetime spend on Asham"
        />
        <KPICard 
          title="Active Orders" 
          value={stats.activeOrders.toString()} 
          icon={<Package className="text-[#C75B39]" />} 
          subtitle="Materials in transit/pending"
        />
        <KPICard 
          title="Documents" 
          value="4" 
          icon={<FileText className="text-blue-500" />} 
          subtitle="Blueprints & invoices"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* --- RECENT ORDERS --- */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#06392F] tracking-tight">Recent Orders</h2>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm font-bold text-[#C75B39] hover:gap-2 transition-all">
              View Order History <ArrowRight size={16} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center bg-white border-2 border-gray-100 border-dashed rounded-3xl">
              <ShoppingBag className="mx-auto mb-4 text-gray-200" size={64} />
              <p className="mb-6 text-xl font-bold text-gray-400">No orders found</p>
              <Link href="/products" className="bg-[#06392F] text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                Browse Materials
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-gray-400 uppercase text-[11px] font-black tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5">Order Reference</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((order) => (
                      <tr 
                        key={order.id} 
                        className="transition-all cursor-pointer group hover:bg-gray-50/80"
                        onClick={() => window.location.href = `/dashboard/orders/${order.id}`}
                      >
                        <td className="px-8 py-6 font-mono font-bold text-[#06392F]">#{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6 font-medium text-gray-500">{new Date(order.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-right text-gray-900">KES {order.total_amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- PROFILE & TOOLS --- */}
        <div className="space-y-8">
          <div className="p-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-3xl">
            <h3 className="text-xl font-black text-[#06392F] mb-8 tracking-tight">My Profile</h3>
            
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-[#06392F] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-[#06392F]/20">
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-[#06392F] text-lg truncate">{profile?.full_name}</p>
                <p className="text-sm font-medium text-gray-400 truncate">{profile?.email}</p>
              </div>
            </div>

            <div className="pt-6 space-y-4 border-t border-gray-50">
              <ProfileItem icon={<MapPin size={18}/>} label={profile?.address || 'Set delivery address'} />
              <ProfileItem icon={<CreditCard size={18}/>} label={profile?.phone || 'Add phone number'} />
            </div>

            <Link href="/dashboard/user" className="block w-full mt-8 py-4 text-center text-sm font-black text-[#06392F] bg-gray-50 rounded-2xl hover:bg-[#06392F] hover:text-white transition-all duration-300">
              Account Settings
            </Link>
          </div>

          {/* Downloads Card */}
          <div className="bg-gradient-to-br from-[#C75B39] to-[#A64828] text-white rounded-3xl p-8 shadow-2xl shadow-orange-900/20 group relative overflow-hidden">
            <Download className="absolute w-32 h-32 transition-transform duration-500 -top-4 -right-4 opacity-10 group-hover:scale-110" />
            <h3 className="relative z-10 mb-2 text-2xl font-black">My Blueprints</h3>
            <p className="relative z-10 mb-8 font-medium text-orange-100/80">Instant access to your purchased architectural plans.</p>
            <Link href="/dashboard/downloads" className="inline-flex items-center gap-2 bg-white text-[#C75B39] px-6 py-3 rounded-xl font-black text-sm shadow-lg hover:shadow-white/20 transition-all active:scale-95 relative z-10">
              Open Library <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function KPICard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 transition-transform bg-gray-50 rounded-2xl group-hover:scale-110">{icon}</div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active</span>
      </div>
      <p className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">{title}</p>
      <h4 className="text-2xl font-black text-[#06392F] mb-1">{value}</h4>
      <p className="text-[10px] font-medium text-gray-400">{subtitle}</p>
    </div>
  );
}

function ProfileItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
      <div className="text-gray-300">{icon}</div>
      <span className="truncate">{label}</span>
    </div>
  );
}
