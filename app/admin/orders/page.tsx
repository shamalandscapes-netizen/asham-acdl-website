'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  Loader2, 
  ArrowUpDown 
} from 'lucide-react';

export default function OrdersCatalog() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchAllOrders() {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchAllOrders();
  }, [statusFilter, supabase]);

  // Client-side search filtering
  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Order Ledger</h1>
          <p className="text-sm font-medium text-slate-500">Managing all material transactions for Asham ACDL.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search Ref or Client..."
              className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#06392F] w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#06392F] shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Loader2 className="animate-spin text-[#06392F]" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Records...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50/50 border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                  className="transition-colors cursor-pointer group hover:bg-slate-50/50"
                >
                  <td className="px-8 py-5 text-xs font-bold text-slate-900">
                    {order.order_number || `#${order.id.slice(0, 8)}`}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{order.profiles?.full_name || 'Guest'}</span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase">Registered Customer</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-medium text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-8 py-5 text-xs font-black text-slate-900">
                    KES {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#C75B39] transition-colors inline" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag size={40} className="text-slate-100" />
                      <p className="text-xs font-bold tracking-widest uppercase text-slate-300">No matching orders found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}