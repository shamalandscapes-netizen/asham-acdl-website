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
  PackageX
} from 'lucide-react';

// --- Interfaces ---
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string; // payment_status from DB
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
          // Allow middleware to handle redirect, just stop loading
          setLoading(false); 
          return;
        }

        // Fetch Orders and count items
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
          // Map DB columns to UI state
          const formattedOrders = rawOrders.map((order: any) => ({
            id: order.id,
            created_at: order.created_at,
            total_amount: order.total_amount,
            status: order.payment_status || 'pending',
            // Supabase returns count as an array like [{count: 3}] usually
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
  }, [router]);

  // Helper: Status Colors
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
       <Loader2 className="animate-spin text-[#06392F]" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <ShoppingBag className="text-[#C75B39]" /> My Order History
          </h1>
          <p className="text-gray-500">View details and track the status of your purchases.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={16} />
          <input 
            type="text" 
            placeholder="Search Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06392F]"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        // --- Empty State ---
        <div className="flex flex-col items-center justify-center p-16 text-center bg-white border-2 border-gray-200 border-dashed rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-50">
            <PackageX className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
          <p className="max-w-xs mx-auto mb-6 text-gray-500">
            You haven't placed any orders yet. Visit our shop to find materials and plans.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#06392F] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors shadow-lg shadow-green-900/10"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // --- Order List Table ---
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date Placed</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Total Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-gray-50 group">
                      
                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[#06392F]">#{order.id.slice(0, 8).toUpperCase()}</span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 font-bold text-right text-gray-800">
                        KES {order.total_amount.toLocaleString()}
                      </td>

                      {/* Button */}
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/dashboard/orders/${order.id}`} // Links to the detail page we made earlier
                          className="inline-flex items-center gap-1 text-sm font-bold text-[#06392F] hover:text-[#C75B39] transition-colors"
                        >
                          Details <ArrowRight size={16} />
                        </Link>
                      </td>

                    </tr>
                  ))
                ) : (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-gray-500">
                       No orders match your search.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}