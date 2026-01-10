'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Package, User, Loader2, RefreshCcw, 
  Printer, CreditCard, Phone, MapPin, CheckCircle2, Mail, Send
} from 'lucide-react';
import PrintableInvoice from '../PrintableInvoice'; 
import { sendInvoiceEmail } from '@/app/actions/email-invoice';
import { toast } from 'react-hot-toast';

interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_status: string;
  mpesa_receipt: string | null;
  guest_phone: string | null;
  guest_email: string | null;
  delivery_address: string | null;
  profiles: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    products: {
      name: string;
      image_url: string;
    } | null;
  }[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [printMode, setPrintMode] = useState<'invoice' | 'dispatch'>('invoice');

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const { data, error } = await supabase
        .from('orders')
        .select(`*, profiles:user_id (full_name, email, phone), order_items (id, quantity, unit_price, products:product_id (name, image_url))`)
        .eq('id', orderId)
        .single();

      if (error) router.push('/admin/orders');
      else setOrder(data as any);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId, supabase, router]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    const { error } = await (supabase as any)
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    if (!error) setOrder(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  };

  const handleEmailInvoice = async () => {
    if (!order?.profiles?.email && !order?.guest_email) {
      toast.error("No client email found");
      return;
    }
    setIsEmailing(true);
    const result = await sendInvoiceEmail(order);
    if (result.success) toast.success("Invoice emailed successfully");
    else toast.error("Email failed to send");
    setIsEmailing(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[600px] gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Syncing Records...</p>
    </div>
  );

  if (!order) return null;

  return (
    <>
      <div className="max-w-6xl p-6 mx-auto space-y-10 duration-700 no-print animate-in fade-in slide-in-from-bottom-4">
        
        {/* Action Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <button onClick={() => router.back()} className="flex items-center text-slate-400 hover:text-[#06392F] font-black text-[10px] uppercase tracking-[0.2em] transition-all">
              <ArrowLeft size={14} className="mr-2" /> Ledger
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {order.order_number || `#${order.id.slice(0, 8)}`}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Print & Dispatch Toggle Group */}
            <div className="flex overflow-hidden border shadow-sm border-slate-200 rounded-2xl">
              <button 
                onClick={() => { setPrintMode('invoice'); setTimeout(() => window.print(), 100); }}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${printMode === 'invoice' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <Printer size={14} /> Invoice
              </button>
              <button 
                onClick={() => { setPrintMode('dispatch'); setTimeout(() => window.print(), 100); }}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest border-l border-slate-200 transition-all flex items-center gap-2 ${printMode === 'dispatch' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                <Package size={14} /> Dispatch
              </button>
            </div>

            {/* Email Button */}
            <button 
              onClick={handleEmailInvoice}
              disabled={isEmailing}
              className="flex items-center gap-2 px-6 py-3 bg-[#C75B39] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#C75B39]/20 disabled:opacity-50"
            >
              {isEmailing ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />}
              Email Client
            </button>
            
            {/* Status Select */}
            <div className="relative">
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="appearance-none bg-[#06392F] text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl outline-none cursor-pointer pr-12"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-white/50">
                 {updating ? <RefreshCcw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Table Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden bg-white border border-slate-100 shadow-sm rounded-[2.5rem]">
              <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/30">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Package size={14} /> Material Manifest
                  </h2>
                  <span className="text-[10px] font-black text-[#C75B39] px-3 py-1 bg-[#C75B39]/5 rounded-full uppercase">
                    {order.order_items.length} Line Items
                  </span>
              </div>
              
              <div className="divide-y divide-slate-50">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 p-8 transition-colors group hover:bg-slate-50/50">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden border shadow-inner border-slate-100 rounded-xl bg-slate-50">
                      <img src={item.products?.image_url || ''} alt="" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-slate-900">{item.products?.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">KES {(item.unit_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Black Total Bar */}
              <div className="flex items-center justify-between p-12 text-white bg-slate-900">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Gross Settlement</p>
                    <p className="text-4xl font-black tracking-tighter">KES {order.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                      <div className={`px-4 py-1.5 border rounded-full ${order.payment_status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                          {order.payment_status === 'Completed' ? 'Verified' : 'Unpaid'}
                        </p>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">{order.mpesa_receipt || 'WAITING_CALLBACK'}</p>
                  </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-8 space-y-6 bg-white border border-slate-100 shadow-sm rounded-[2.5rem]">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <User size={14} /> Consignee Details
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-300"><User size={14}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Full Name</p>
                      <p className="text-sm font-bold text-slate-900">{order.profiles?.full_name || 'Guest'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-300"><MapPin size={14}/></div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Site Address</p>
                      <p className="text-xs font-bold leading-relaxed text-slate-600">{order.delivery_address || 'Collection'}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRINT LAYER (Stamps are inside this component) */}
      <PrintableInvoice order={order} type={printMode} />
    </>
  );
}