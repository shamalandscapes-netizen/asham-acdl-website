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
  Calendar
} from 'lucide-react';

// Define Order Type (Matches UI needs)
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string; // We will map payment_status to this
  items: any[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      // 1. Get Logged In User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Stop loading so we don't hang, Middleware handles the redirect
        setLoading(false);
        return; 
      }

      // 2. Fetch User's Orders with Items Count
      // We join 'order_items' just to get the IDs so we can count them
      const { data: rawOrders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items ( id )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rawOrders) {
        // 3. Map Database Columns to UI Interface
        const mappedOrders: Order[] = rawOrders.map((order: any) => ({
          id: order.id,
          created_at: order.created_at,
          total_amount: order.total_amount,
          status: order.payment_status || 'pending', // Map payment_status -> status
          items: order.order_items || []             // Map order_items -> items
        }));
        
        setOrders(mappedOrders);
      }
      
      setLoading(false);
    }
    fetchOrders();
  }, [router]);

  // Status Badge Logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
       <Loader2 className="animate-spin text-[#06392F]" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <ShoppingBag className="text-[#C75B39]" /> My Order History
          </h1>
          <p className="text-gray-500">View details and track the status of your purchases.</p>
        </div>
        
        {/* Simple Search Placeholder */}
        <div className="relative">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={16} />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06392F]"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        // Empty State
        <div className="p-16 text-center bg-white border-2 border-gray-200 border-dashed rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50">
            <ShoppingBag className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
          <p className="mb-6 text-gray-500">Looks like you haven't bought anything yet.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[#06392F] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0A4D40] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        // Order List
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Order Details</th>
                  <th className="px-6 py-4 font-medium">Date Placed</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Total Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50 group">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#06392F]">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <div className="mt-1 text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </div>
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
                        href={`/dashboard/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#06392F] hover:text-[#C75B39] transition-colors"
                      >
                        Details <ArrowRight size={16} />
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