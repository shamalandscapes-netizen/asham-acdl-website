'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ShoppingBag, 
  ArrowRight, 
  Loader2, 
  Search,
  Calendar,
  PackageX,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items_count: number;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false); 
          return;
        }

        const { data: rawOrders, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total_amount,
            payment_status,
            order_items ( count )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else if (rawOrders) {
          const formattedOrders = rawOrders.map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            total_amount: order.total_amount,
            status: order.payment_status || 'pending',
            items_count: order.order_items?.[0]?.count || 0 
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router, supabase]);

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-100';
      case 'delivered': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-orange-50 text-[#C75B39] border-orange-100';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
       <Loader2 className="animate-spin text-[#06392F]" size={40} />
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Acquisitions...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 duration-700 animate-in fade-in">
      
      {/* Header & Stats */}
      <div className="flex flex-col justify-between gap-8 pb-10 border-b border-gray-100 md:flex-row md:items-end">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-[#06392F] tracking-tighter uppercase leading-none">
            Acquisition History
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={14} className="text-[#C75B39]" /> Portfolio Management
            </p>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <p className="text-[#06392F] text-[10px] font-black uppercase tracking-widest">
              {orders.length} TOTAL RECORDS
            </p>
          </div>
        </div>
        
        {/* Search Bar - Asham Styled */}
        <div className="relative w-full md:w-80">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-5 top-1/2" size={18} />
          <input 
            type="text" 
            placeholder="FILTER BY REFERENCE ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black tracking-widest focus:ring-2 focus:ring-[#06392F] transition-all outline-none uppercase"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white border border-gray-100 rounded-[3.5rem] shadow-2xl shadow-gray-200/50">
          <PackageX className="mb-6 text-gray-200" size={60} />
          <h3 className="text-xl font-black text-[#06392F] uppercase tracking-tighter">No History Detected</h3>
          <p className="max-w-xs mx-auto mt-4 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
            Your acquisition repository is currently empty. Visit the marketplace to begin.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 bg-[#06392F] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl"
          >
            Start Acquisition <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[3.5rem] relative">
           <div className="absolute top-0 left-0 right-0 h-2 bg-[#06392F]" />
           
          <div className="p-4 overflow-x-auto md:p-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference ID</th>
                  <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Logged</th>
                  <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valuation</th>
                  <th className="px-6 py-8 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-all hover:bg-gray-50/50 group">
                    <td className="px-6 py-8">
                      <span className="font-mono text-xs font-black text-[#06392F] tracking-tighter">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                        <Calendar size={14} className="text-[#C75B39]" />
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-8">
                      <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-8 text-right">
                      <p className="text-sm font-black text-[#06392F]">KES {order.total_amount.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{order.items_count} Units</p>
                    </td>

                    <td className="px-6 py-8 text-right">
                      <Link 
                        href={`/dashboard/user/orders/${order.id}`} 
                        className="inline-flex items-center gap-2 text-[10px] font-black text-[#C75B39] uppercase opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      >
                        Details <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}