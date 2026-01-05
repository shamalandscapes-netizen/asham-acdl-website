'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Users, Package, Banknote, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StatsCard from './StatsCard';
import Link from 'next/link';

interface OrderRow {
  id: string;
  created_at: string;
  total_price: number | null;
  status: string | null;
  users: { full_name: string | null } | null;
}

export default function AdminOverview() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    loading: true
  });
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Stats (All Orders)
        const { data: allOrdersData } = await supabase
          .from('orders')
          .select('total_price, status');

        const allOrders = (allOrdersData as any[]) || [];
        const totalRevenue = allOrders.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
        const activeOrders = allOrders.filter(o => o.status !== 'completed').length;

        // 2. Fetch Recent Orders (Last 5 with User details)
        const { data: recentData } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total_price,
            status,
            users (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // 3. Product & User Counts
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo);

        setRecentOrders((recentData as unknown as OrderRow[]) || []);
        setStats({
          revenue: totalRevenue,
          orders: activeOrders,
          products: productCount || 0,
          customers: userCount || 0,
          loading: false
        });
      } catch (error: any) {
        console.error("Dashboard error:", error.message);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchDashboardData();
  }, [supabase]);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-100';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#C75B39]" />
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Syncing Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 duration-700 animate-in fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-sm font-medium text-gray-500">Monitoring Asham performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value={`KES ${stats.revenue.toLocaleString()}`} icon={Banknote} description="Gross earnings" />
        <StatsCard title="Active Orders" value={stats.orders} icon={ShoppingBag} description="Needs fulfillment" />
        <StatsCard title="Inventory" value={stats.products} icon={Package} description="Active listings" />
        <StatsCard title="New Users" value={stats.customers} icon={Users} description="Registered this week" />
      </div>

      {/* Recent Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/admin/orders">
            <button type="button" className="text-xs font-bold text-[#C75B39] flex items-center gap-1 hover:underline">
              All Orders <ArrowRight size={14} />
            </button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-xs font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">{order.users?.full_name || 'Guest Customer'}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-xs font-black text-gray-900">KES {order.total_price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-sm italic font-medium text-center text-gray-400">
                    No transactions recorded yet.
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