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
  AlertCircle,
  MousePointer2,
  Newspaper,
  TrendingUp
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatsCard from './StatsCard';
import SalesChart from './dashboard/components/SalesChart';
import Link from 'next/link';

export default function AdminOverview() {
  const router = useRouter();
  const supabase = createClient();
  
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    lowStock: 0,
    leads: 0, 
    posts: 0, 
    loading: true
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setError(null);

        // Parallel execution for better performance
        const [
          { data: allOrdersData },
          { data: recentData },
          { data: inventoryData, count: productCount },
          { count: customerCount },
          { count: postsCount },
          { count: leadsCount }
        ] = await Promise.all([
          supabase.from('orders' as any).select('total_amount, status'),
          supabase.from('orders' as any).select(`id, order_number, created_at, total_amount, status, profiles (full_name)`).order('created_at', { ascending: false }).limit(5),
          supabase.from('products' as any).select('stock_quantity', { count: 'exact' }),
          supabase.from('profiles' as any).select('*', { count: 'exact', head: true }),
          supabase.from('posts' as any).select('*', { count: 'exact', head: true }),
          supabase.from('lead_events' as any).select('*', { count: 'exact', head: true })
        ]);

        const allOrders = allOrdersData || [];
        const totalRevenue = allOrders
          .filter((o: any) => o.status === 'completed')
          .reduce((acc: number, curr: any) => acc + (Number(curr.total_amount) || 0), 0);
          
        const activeOrders = allOrders.filter((o: any) => 
          o.status !== 'completed' && o.status !== 'cancelled'
        ).length;

        const lowStockCount = inventoryData?.filter(
          (p: any) => p.stock_quantity !== null && p.stock_quantity < 10
        ).length || 0;
        
        setRecentOrders(recentData || []);
        setStats({
          revenue: totalRevenue,
          orders: activeOrders,
          products: productCount || 0,
          customers: customerCount || 0,
          lowStock: lowStockCount,
          leads: leadsCount || 0,
          posts: postsCount || 0,
          loading: false
        });

      } catch (err: any) {
        setError(err.message);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchDashboardData();
  }, [supabase]);

  const getStatusColor = (status: string | null) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'processing') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (s === 'cancelled') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#06392F]" />
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Syncing HQ Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-10 duration-700 animate-in fade-in">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl italic font-black leading-none tracking-tighter uppercase text-[#06392F]">Intelligence Briefing</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">Operational Pulse • 2026 Season</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/posts/new" className="px-6 py-3 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
            Draft Story
          </Link>
          <Link href="/admin/products/new" className="px-6 py-3 bg-[#06392F] text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all shadow-lg shadow-[#06392F]/20">
            Upload Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-xs font-bold border bg-rose-50 border-rose-100 rounded-2xl text-rose-800">
          <AlertCircle size={16} /> System Notice: {error}
        </div>
      )}

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          description="Pending fulfillment" 
        />
        <div className="relative">
          <StatsCard 
            title="WhatsApp Leads" 
            value={stats.leads} 
            icon={MousePointer2} 
            description="Interaction conversions" 
          />
          {stats.leads > 0 && <span className="absolute flex w-2 h-2 top-4 right-4">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
          </span>}
        </div>
        <StatsCard 
          title="Journal Posts" 
          value={stats.posts} 
          icon={Newspaper} 
          description="Published content" 
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
             <div className="flex items-center justify-between mb-8">
                <h3 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-slate-900">
                  <TrendingUp size={16} className="text-[#C75B39]" /> Revenue Performance
                </h3>
             </div>
             <SalesChart />
           </div>
        </div>
        
        <div className="space-y-6">
          <div className="relative group">
            <StatsCard 
              title="Catalog" 
              value={stats.products} 
              icon={Package} 
              description="Live house plans" 
            />
            {stats.lowStock > 0 && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#C75B39] text-white rounded-full shadow-lg animate-in zoom-in duration-300">
                <AlertCircle size={12} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase">{stats.lowStock} Limited Stock</span>
              </div>
            )}
          </div>
          
          <StatsCard 
            title="User Registry" 
            value={stats.customers} 
            icon={Users} 
            description="Client base" 
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-[3rem] overflow-hidden">
        <div className="flex items-center justify-between p-10 border-b border-slate-50">
          <div className="space-y-1">
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-900">Recent Transactions</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latest activities from the digital store</p>
          </div>
          <Link href="/admin/orders" className="px-6 py-3 border border-slate-100 rounded-full text-[9px] font-black text-[#06392F] flex items-center gap-2 hover:bg-slate-50 transition-all uppercase tracking-widest">
            Full Ledger <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="transition-all cursor-pointer hover:bg-slate-50 group"
                >
                  <td className="px-10 py-6 text-xs font-bold text-[#06392F]">
                    {order.order_number || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-slate-600">
                    {order.profiles?.full_name || 'Guest User'}
                  </td>
                  <td className="px-10 py-6 text-xs font-black text-slate-900">
                    KES {Number(order.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black border ${getStatusColor(order.status)} uppercase tracking-widest`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <ShoppingBag size={48} />
                      <p className="text-[10px] font-black tracking-[0.4em] uppercase">Archive Empty</p>
                    </div>
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
