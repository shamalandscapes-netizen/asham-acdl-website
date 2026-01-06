'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ShoppingBag, ArrowRight, Loader2, Search,
  Calendar, Filter, CreditCard, ChevronRight,
  PackageCheck, Truck, AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string; 
  items: any[];
}

export default function MyOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: rawOrders } = await supabase
        .from('orders')
        .select(`*, order_items ( id )`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rawOrders) {
        const mapped = rawOrders.map((order: any) => ({
          id: order.id,
          created_at: order.created_at,
          total_amount: order.total_amount,
          status: order.payment_status || 'pending',
          items: order.order_items || []
        }));
        setOrders(mapped);
        setFilteredOrders(mapped);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  // Handle Search
  useEffect(() => {
    const filtered = orders.filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'paid': 
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CreditCard size={12}/> };
      case 'shipped': 
        return { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Truck size={12}/> };
      case 'delivered': 
        return { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: <PackageCheck size={12}/> };
      case 'cancelled': 
        return { color: 'bg-rose-50 text-rose-700 border-rose-100', icon: <AlertCircle size={12}/> };
      default: 
        return { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Clock size={12}/> };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-[#06392F] mb-4" size={40} />
      <p className="font-medium tracking-wide text-gray-400">Fetching transaction history...</p>
    </div>
  );

  return (
    <div className="max-w-6xl pb-20 mx-auto space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black text-[#06392F] tracking-tight mb-2">Order History</h1>
          <p className="font-medium text-gray-500">Manage receipts and track material fulfillment.</p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row md:w-auto">
          <div className="relative group">
            <Search className="absolute text-gray-400 left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#C75B39]" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID..." 
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#06392F]/5 w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-gray-600 transition-all bg-white border border-gray-100 shadow-sm rounded-2xl hover:bg-gray-50">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* --- ORDER TABLE --- */}
      {filteredOrders.length === 0 ? (
        <EmptyOrdersState hasSearch={searchQuery.length > 0} />
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Ref</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Total</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <tr key={order.id} className="group hover:bg-[#F8FAFC] transition-all duration-300">
                      <td className="px-8 py-6">
                        <span className="font-mono font-black text-[#06392F] text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                          {order.items?.length || 0} Products
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 text-gray-400 transition-colors bg-gray-100 rounded-lg group-hover:bg-white">
                            <Calendar size={16} />
                          </div>
                          <div className="text-sm font-bold text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-KE', { 
                              day: '2-digit', month: 'short', year: 'numeric' 
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                          {config.icon}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-sm font-black text-[#06392F]">
                          KES {order.total_amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Paid via M-Pesa</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#06392F] hover:text-white transition-all group-hover:shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Clock({ size }: { size: number }) {
  return <AlertCircle size={size} />; // Fallback for clock
}

function EmptyOrdersState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center bg-white border-2 border-dashed border-gray-100 rounded-[3rem]">
      <div className="flex items-center justify-center w-20 h-20 mb-6 text-gray-300 rounded-3xl bg-gray-50">
        <ShoppingBag size={40} />
      </div>
      <h3 className="text-2xl font-black text-[#06392F] mb-2">
        {hasSearch ? 'No matches found' : 'No purchases yet'}
      </h3>
      <p className="max-w-xs mx-auto mb-8 font-medium text-gray-500">
        {hasSearch ? 'Try a different order reference ID.' : 'Your building supplies and blueprint orders will appear here.'}
      </p>
      {!hasSearch && (
        <Link 
          href="/products" 
          className="bg-[#C75B39] text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-orange-900/20 hover:scale-105 transition-all"
        >
          Go to Material Shop
        </Link>
      )}
    </div>
  );
}