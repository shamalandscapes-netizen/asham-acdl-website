'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import {
  Search,
  ChevronRight,
  ShoppingBag,
  Loader2,
  ArrowUpDown
} from 'lucide-react';

/* ----------------------------------------
   Status normalization (important)
----------------------------------------- */
const STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  processing: 'processing',
  paid: 'completed',
  completed: 'completed',
  failed: 'cancelled',
  cancelled: 'cancelled',
};

export default function OrdersCatalog() {
  const router = useRouter();

  // ? Create supabase client ONCE
  const supabase = useMemo(() => createClient(), []);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  /* ----------------------------------------
     Fetch orders
  ----------------------------------------- */
  useEffect(() => {
    async function fetchAllOrders() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          profiles:user_id (full_name)
        `);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      query = query.order(
        sortBy === 'amount' ? 'total_amount' : 'created_at',
        { ascending: sortDir === 'asc' }
      );

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setError('Failed to load orders');
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    }

    fetchAllOrders();
  }, [statusFilter, sortBy, sortDir, supabase]);

  /* ----------------------------------------
     Client-side search (debounced)
  ----------------------------------------- */
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    const q = searchTerm.toLowerCase();
    return orders.filter(order =>
      order.order_number?.toLowerCase().includes(q) ||
      order.profiles?.full_name?.toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  /* ----------------------------------------
     UI helpers
  ----------------------------------------- */
  const getStatusStyle = (status: string) => {
    switch (STATUS_MAP[status]?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const toggleSort = (key: 'date' | 'amount') => {
    if (sortBy === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  /* ----------------------------------------
     Render
  ----------------------------------------- */
  return (
    <div className="space-y-8 duration-500 animate-in fade-in">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Order Ledger
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Managing all material transactions for Asham ACDL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search Ref or Client..."
              className="w-64 pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#06392F] shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select
            className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#06392F] shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Loader2 className="animate-spin text-[#06392F]" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Loading Records...
            </span>
          </div>
        ) : error ? (
          <div className="py-24 text-xs font-bold text-center text-rose-500">
            {error}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Order Ref
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Client
                </th>

                <th
                  onClick={() => toggleSort('date')}
                  className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    Date <ArrowUpDown size={12} />
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('amount')}
                  className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    Amount <ArrowUpDown size={12} />
                  </div>
                </th>

                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length ? (
                filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    tabIndex={0}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    onKeyDown={e =>
                      e.key === 'Enter' &&
                      router.push(`/admin/orders/${order.id}`)
                    }
                    className="transition-colors cursor-pointer group hover:bg-slate-50/50"
                  >
                    <td className="px-8 py-5 text-xs font-bold text-slate-900">
                      {order.order_number || `#${order.id.slice(0, 8)}`}
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {order.profiles?.full_name || 'Guest'}
                        </span>
                        <span className="text-[9px] uppercase text-slate-400 font-medium">
                          Registered Customer
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-xs font-medium text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </td>

                    <td className="px-8 py-5 text-xs font-black text-slate-900">
                      KES {Number(order.total_amount).toLocaleString()}
                    </td>

                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-tighter ${getStatusStyle(order.status)}`}
                      >
                        {STATUS_MAP[order.status] || 'pending'}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <ChevronRight
                        size={16}
                        className="inline text-slate-300 transition-colors group-hover:text-[#C75B39]"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <ShoppingBag size={40} className="mx-auto text-slate-100" />
                    <p className="mt-3 text-xs font-bold tracking-widest uppercase text-slate-300">
                      No matching orders found
                    </p>
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
