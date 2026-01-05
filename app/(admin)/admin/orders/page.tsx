'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, ShoppingBag, Loader2, X, 
  TrendingUp, Clock, CreditCard, UserPlus, UserCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [stats, setStats] = useState({ totalRevenue: 0, pendingCount: 0, totalOrders: 0 });

  const [formData, setFormData] = useState({
    user_id: '',
    guest_name: '',
    guest_phone: '',
    product_id: '',
    quantity: 1,
    payment_status: 'Pending'
  });

  const supabase = createClient();

  async function fetchData() {
    setLoading(true);
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, users(full_name, email), products(name, price)')
        .order('created_at', { ascending: false });
      
      const { data: productData } = await supabase.from('products').select('id, name, price');
      const { data: userData } = await supabase.from('users').select('id, full_name');

      if (orderData) {
        setOrders(orderData);
        const revenue = orderData.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
        const pending = orderData.filter(o => o.payment_status === 'Pending').length;
        setStats({ totalRevenue: revenue, pendingCount: pending, totalOrders: orderData.length });
      }
      if (productData) setProducts(productData);
      if (userData) setUsers(userData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedProduct = products.find(p => p.id === formData.product_id);
      const totalAmount = (selectedProduct?.price || 0) * formData.quantity;

      const insertData: any = {
        product_id: formData.product_id,
        quantity: formData.quantity,
        total_amount: totalAmount,
        payment_status: 'Pending',
        guest_phone: formData.guest_phone,
      };

      if (isGuest) {
        insertData.guest_name = formData.guest_name;
        insertData.user_id = null;
      } else {
        insertData.user_id = formData.user_id;
        insertData.guest_name = null;
      }

      // 1. Save order to DB
      const { data: order, error } = await supabase
        .from('orders')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // 2. Trigger M-Pesa STK Push
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          phone: formData.guest_phone,
          amount: totalAmount,
        }),
      });

      const paymentResult = await response.json();

      // 3. Handle Response
      if (response.ok) {
        alert(`✅ Success! STK Push sent to ${formData.guest_phone}.`);
        setShowModal(false);
        fetchData();
      } else {
        alert(`⚠️ Order logged, but M-Pesa failed: ${paymentResult.error || 'Check API'}`);
        setShowModal(false);
        fetchData();
      }
    } catch (err: any) {
      alert(`❌ System Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('id', orderId);
    if (!error) fetchData();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-[#C75B39] mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Accessing Pipeline...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Orders Pipeline</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time fulfillment & payments</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowModal(true)}
          title="Create a new manual order"
          aria-label="Create a new manual order"
          className="bg-[#06392F] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center"
        >
          <Plus size={16} className="mr-2" /> Log Order
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Settled Revenue</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">KES {stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Clock size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Sync</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">{stats.pendingCount} Action Required</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-[#06392F]/5 rounded-2xl flex items-center justify-center text-[#06392F]"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Volume</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">{stats.totalOrders} Entries</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900">{o.products?.name || 'Unknown Item'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      {new Date(o.created_at).toLocaleDateString()} • QTY: {o.quantity}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-700">{o.guest_name || o.users?.full_name || 'Guest User'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{o.guest_phone || o.users?.email}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <select 
                      title="Update pipeline status"
                      aria-label="Update pipeline status"
                      className={`bg-gray-100 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 cursor-pointer focus:ring-2 
                        ${o.payment_status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          o.payment_status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}
                      value={o.payment_status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-[#06392F]">
                    KES {o.total_amount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Manual Pipeline Entry</h2>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                title="Close modal"
                aria-label="Close modal"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-8 space-y-5">
              <div className="flex gap-4 p-1 bg-gray-50 rounded-xl mb-4">
                <button 
                  type="button" 
                  onClick={() => setIsGuest(false)}
                  title="Registered user entry"
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${!isGuest ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <UserCheck size={14} /> Registered User
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsGuest(true)}
                  title="Guest user entry"
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${isGuest ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                >
                  <UserPlus size={14} /> Guest / Manual
                </button>
              </div>

              {isGuest ? (
                <div>
                  <label htmlFor="customer-name" className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Customer Name</label>
                  <input id="customer-name" required placeholder="Full Name" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" onChange={e => setFormData({...formData, guest_name: e.target.value})} />
                </div>
              ) : (
                <div>
                  <label htmlFor="user-select" className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Select Customer</label>
                  <select id="user-select" required className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                    <option value="">Select User</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="phone-input" className="text-[10px] font-black uppercase text-gray-400 mb-1 block">M-Pesa Number</label>
                <input id="phone-input" required placeholder="0712345678" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.guest_phone} onChange={e => setFormData({...formData, guest_phone: e.target.value})} />
              </div>

              <div>
                <label htmlFor="material-select" className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Material</label>
                <select id="material-select" required className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                  <option value="">Select Material</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} — KES {p.price}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input title="Quantity" aria-label="Quantity" type="number" min="1" placeholder="Qty" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                <div className="bg-gray-100 flex items-center justify-center rounded-xl font-black text-[#06392F] text-xs uppercase">
                  TOTAL: {(products.find(p => p.id === formData.product_id)?.price || 0) * formData.quantity}
                </div>
              </div>

              <div className="pt-6 border-t flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} title="Cancel" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest text-gray-400 border rounded-2xl">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  title="Initiate STK Push"
                  className="flex-1 py-4 bg-[#C75B39] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <><CreditCard size={14} /> Initiate STK Push</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}