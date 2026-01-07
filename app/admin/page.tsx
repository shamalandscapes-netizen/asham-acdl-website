'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  Banknote, 
  Loader2, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatsCard from './StatsCard';
import SalesChart from './dashboard/components/SalesChart';
import Link from 'next/link';

interface OrderRow {
  id: string;
  order_number: string | null;
  created_at: string;
  total_amount: number | null;
  status: string | null;
  profiles?: { full_name: string | null } | null;
  user_profiles?: { full_name: string | null } | null;
}

export default function AdminOverview() {
  const router = useRouter();
  const supabase = createClient();
  
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0, // New metric for inventory alerts
    loading: true
  });
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setError(null);

        // 1. Fetch Stats & Aggregates
        const { data: allOrdersData, error: ordersErr } = await supabase
          .from('orders')
          .select('total_amount, status');

        if (ordersErr) throw ordersErr;

        const allOrders = (allOrdersData as any[]) || [];
        const totalRevenue = allOrders
          .filter(o => o.status === 'completed')
          .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0);
          
        const activeOrders = allOrders.filter(o => 
          o.status !== 'completed' && o.status !== 'cancelled'
        ).length;

        // 2. Fetch Recent Transactions
        const { data: recentData, error: recentErr } = await supabase
          .from('orders')
          .select(`
            id, order_number, created_at, total_amount, status,
            profiles (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentErr) {
          const { data: fallbackData } = await supabase
            .from('orders')
            .select('id, order_number, created_at, total_amount, status, user_profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5);
          if (fallbackData) setRecentOrders(fallbackData as any);
        } else {
          setRecentOrders((recentData as any) || []);
        }

        // 3. Product Count & Low Stock Detection
        const { data: inventoryData, count: productCount } = await supabase
          .from('products')
          .select('stock_quantity', { count: 'exact' });
        
        // Items with stock < 10 but > 0
        const lowStockCount = (inventoryData as any[])?.filter(
          p => p.stock_quantity !== null && p.stock_quantity < 10
        ).length || 0;
        
        // 4. Count Customer Registry
        const { count: customerCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          revenue: totalRevenue,
          orders: activeOrders,
          products: productCount || 0,
          customers: customerCount || 0,
          lowStock: lowStockCount,
          loading: false
        });

      } catch (err: any) {
        console.error("Dashboard error:", err.message);
        setError(err.message);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchDashboardData();
  }, [supabase]);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#06392F]" />
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">Processing Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 duration-700 animate-in fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Intelligence Briefing</h1>
        <p className="text-sm italic font-medium text-slate-500">Asham ACDL Operational Headquarters</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-xs font-bold border bg-rose-50 border-rose-100 rounded-2xl text-rose-800">
          <AlertCircle size={16} />
          System Notice: {error}
        </div>
      )}

      {/* Main Analytics: Chart + Primary KPIs */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <SalesChart />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
            <StatsCard 
              title="Gross Revenue" 
              value={`KES ${stats.revenue.toLocaleString()}`} 
              icon={Banknote} 
              description="Realized earnings" 
            />
            <StatsCard 
              title="Active Queue" 
              value={stats.orders} 
              icon={ShoppingBag} 
              description="Orders in fulfillment" 
            />
        </div>
      </div>

      {/* Secondary Stats: Inventory with Low Stock Badge */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative group">
            <StatsCard 
              title="Product Catalog" 
              value={stats.products} 
              icon={Package} 
              description="Live material listings" 
            />
            {stats.lowStock > 0 && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-full shadow-lg shadow-rose-200 animate-in zoom-in duration-300">
                    <AlertCircle size={12} className="animate-pulse" />
                    <span className="text-[9px] font-black tracking-tighter uppercase">{stats.lowStock} Low Stock Items</span>
                </div>
            )}
        </div>
        
        <StatsCard 
          title="User Registry" 
          value={stats.customers} 
          icon={Users} 
          description="Total client profiles" 
        />
      </div>

      {/* Transactions Table Section */}
      <div className="overflow-hidden bg-white border shadow-sm border-slate-100 rounded-[2.5rem]">
        <div className="flex items-center justify-between p-10 border-b border-slate-50">
          <h2 className="text-lg font-black tracking-tight uppercase text-slate-900">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-[10px] font-black text-[#C75B39] flex items-center gap-1 hover:opacity-70 transition-opacity uppercase tracking-[0.2em]">
            Access Ledger <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ref Code</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Value</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="transition-colors cursor-pointer hover:bg-slate-50/50 group"
                >
                  <td className="px-10 py-6 text-xs font-bold text-slate-900">
                    {order.order_number || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-slate-600">
                    {order.profiles?.full_name || order.user_profiles?.full_name || 'Guest Customer'}
                  </td>
                  <td className="px-10 py-6 text-xs font-medium text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-10 py-6 text-xs font-black text-slate-900">
                    KES {Number(order.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border ${getStatusColor(order.status)} uppercase tracking-widest`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-xs font-black tracking-[0.3em] text-center uppercase text-slate-200">
                    Database empty. No recent activity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}