'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Printer, Mail, Phone, MapPin, 
  CreditCard, CheckCircle, Package, Calendar
} from 'lucide-react';

// --- 1. LOOSE INTERFACES (Matches what DB actually gives us) ---
interface UiOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// The 'Status' type for our UI logic
type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderDetail {
  id: string;
  // ✅ FIX: Allow created_at to be null
  created_at: string | null;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  phone: string; 
  total_amount: number;
  mpesa_ref: string | null;
  items: UiOrderItem[]; 
  shipping_address: any; 
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const supabase = createClient();

  // --- 2. ROBUST FETCH LOGIC (Manual Joins) ---
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // A. Fetch the Main Order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id)
          .single();

        if (orderError || !orderData) throw new Error('Order not found');

        // B. Fetch User Details (using user_id from order)
        let userData = null;
        if (orderData.user_id) {
          const { data: uData } = await supabase
            .from('users')
            .select('full_name, email, phone')
            .eq('id', orderData.user_id)
            .single();
          userData = uData;
        }

        // C. Fetch Order Items
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*') // This returns product_id, price, quantity
          .eq('order_id', params.id);

        // D. Fetch Product Names (for the items)
        let finalItems: UiOrderItem[] = [];
        
        if (itemsData && itemsData.length > 0) {
            // Get all product IDs from the items
            const productIds = itemsData.map((item: any) => item.product_id);
            
            // Fetch product names
            const { data: productsData } = await supabase
                .from('products')
                .select('id, name')
                .in('id', productIds);

            // Create a lookup map for product names
            const productMap = (productsData || []).reduce((acc: any, curr: any) => {
                acc[curr.id] = curr.name;
                return acc;
            }, {});

            // Combine everything into UI Items
            finalItems = itemsData.map((item: any) => ({
                id: item.id,
                name: productMap[item.product_id] || 'Unknown Product',
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity // Calculate total manually
            }));
        }

        // --- 3. ASSEMBLE DATA ---
        // We cast types carefully here to silence TypeScript errors
        const statusFromDb = (orderData.payment_status as string)?.toLowerCase();
        // Check if DB status is valid, otherwise default to 'pending'
        const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
        const finalStatus = validStatuses.includes(statusFromDb) ? statusFromDb : 'pending';

        const formattedOrder: OrderDetail = {
          id: orderData.id,
          // ✅ FIX: No more error here because Interface allows null
          created_at: orderData.created_at,
          status: finalStatus as OrderStatus,
          total_amount: orderData.total_amount,
          mpesa_ref: orderData.mpesa_receipt || null, // Handle null explicitly
          shipping_address: typeof orderData.shipping_address === 'string' 
            ? JSON.parse(orderData.shipping_address) 
            : orderData.shipping_address,
          
          // User Fallbacks
          customer_name: userData?.full_name || 'Guest',
          customer_email: userData?.email || 'N/A',
          phone: userData?.phone || orderData.payment_phone || 'N/A',

          items: finalItems
        };

        setOrder(formattedOrder);

      } catch (err) {
        console.error(err);
        // alert('Error loading order'); 
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params.id]);

  // --- 4. STATUS UPDATE HANDLER ---
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);

    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus }) 
      .eq('id', order.id);

    if (error) {
      alert('Failed to update status');
    } else {
      // Cast the string to OrderStatus to satisfy TypeScript
      setOrder({ ...order, status: newStatus as OrderStatus });
    }
    setUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const formatAddress = (addr: any) => {
    if (!addr) return 'No address provided';
    if (typeof addr === 'string') return addr;
    // Assuming JSON structure: { city: '...', street: '...' }
    const parts = [addr.street, addr.city, addr.postal_code].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Address available (See JSON)'; 
  };

  if (loading) return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* --- TOP BAR --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-[#06392F] transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Orders
        </button>

        <div className="flex gap-2">
           <button 
             onClick={() => window.print()}
             className="flex items-center gap-2 px-4 py-2 font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 print:hidden"
           >
             <Printer size={18} /> Print Invoice
           </button>
           
           {/* Status Changer */}
           <div className="relative inline-block print:hidden">
              {/* FIX: Added aria-label for accessibility error */}
              <select
                aria-label="Change Order Status"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className={`appearance-none pl-4 pr-10 py-2 rounded-lg font-bold capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06392F] ${getStatusColor(order.status)}`}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
           </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* LEFT COLUMN: Order Items */}
        <div className="space-y-6 lg:col-span-2">
           
           <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-start justify-between mb-6">
                 <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                       Order <span className="text-gray-400">#{order.id.slice(0,8)}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                       <Calendar size={14} /> 
                       {/* ✅ FIX: Add check for null created_at */}
                       Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : 'Unknown Date'}
                    </div>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-sm font-bold capitalize border ${getStatusColor(order.status)}`}>
                    {order.status}
                 </div>
              </div>

              {/* Items Table */}
              <div className="pt-6 border-t border-gray-100">
                 <h3 className="mb-4 font-bold text-gray-800">Items Ordered</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="font-medium text-gray-500 bg-gray-50">
                          <tr>
                             <th className="px-4 py-2 rounded-l-lg">Product</th>
                             <th className="px-4 py-2 text-center">Qty</th>
                             <th className="px-4 py-2 text-right">Price</th>
                             <th className="px-4 py-2 text-right rounded-r-lg">Total</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {order.items?.map((item, index) => (
                             <tr key={index}>
                                <td className="px-4 py-3 font-medium text-[#06392F]">{item.name}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right">KES {item.price?.toLocaleString() || 0}</td>
                                <td className="px-4 py-3 font-bold text-right">KES {item.total?.toLocaleString() || 0}</td>
                             </tr>
                          ))}
                          {(!order.items || order.items.length === 0) && (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-gray-500">No items found for this order.</td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>

                 {/* Totals */}
                 <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
                    <div className="w-64 space-y-2">
                       <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>KES {order.total_amount.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-lg font-bold text-[#06392F] pt-2 border-t border-gray-100">
                          <span>Grand Total</span>
                          <span>KES {order.total_amount.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Customer & Payment Details */}
        <div className="space-y-6">
           
           {/* Customer Details */}
           <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="pb-2 mb-4 font-bold text-gray-800 border-b border-gray-100">Customer Details</h3>
              
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="p-2 text-gray-600 bg-gray-100 rounded-full">
                       <Package size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Name</p>
                       <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 text-gray-600 bg-gray-100 rounded-full">
                       <Mail size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                       <a href={`mailto:${order.customer_email}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {order.customer_email}
                       </a>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 text-gray-600 bg-gray-100 rounded-full">
                       <Phone size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Phone</p>
                       <p className="text-sm font-medium text-gray-900">{order.phone}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 text-gray-600 bg-gray-100 rounded-full">
                       <MapPin size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Delivery Address</p>
                       <p className="text-sm font-medium text-gray-900">
                          {formatAddress(order.shipping_address)}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Payment Information */}
           <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="pb-2 mb-4 font-bold text-gray-800 border-b border-gray-100">Payment Info</h3>
              
              <div className="flex items-center justify-between mb-4">
                 <span className="text-sm text-gray-500">Method</span>
                 <span className="flex items-center gap-1 text-sm font-bold">
                    <CreditCard size={14} className="text-green-600" /> M-Pesa
                 </span>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                 <p className="mb-1 text-xs font-bold text-gray-500 uppercase">Transaction Ref</p>
                 {order.mpesa_ref ? (
                    <p className="text-lg font-mono font-bold text-[#06392F]">{order.mpesa_ref}</p>
                 ) : (
                    <p className="text-sm italic font-bold text-red-500">Not Paid Yet</p>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}