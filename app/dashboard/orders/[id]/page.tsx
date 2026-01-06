'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Package, Truck, CheckCircle2, 
  Clock, MapPin, CreditCard, Construction, 
  ReceiptText, AlertCircle, FileDown, Loader2 as Spinner
} from 'lucide-react';

// --- Interfaces ---
interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  digital_file_url?: string;
  download_key?: string;
}

interface OrderDetail {
  id: string;
  created_at: string;
  total_amount: number;
  payment_status: string;
  shipping_address: string;
  mpesa_receipt: string;
  items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_items (*)`)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const rawData = data as any;
          const mappedItems: OrderItem[] = rawData.order_items.map((item: any) => ({
            id: item.id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            digital_file_url: item.digital_file_url,
            download_key: item.download_key
          }));

          setOrder({
            id: rawData.id,
            created_at: rawData.created_at,
            total_amount: rawData.total_amount,
            payment_status: rawData.payment_status || 'pending',
            shipping_address: rawData.shipping_address,
            mpesa_receipt: rawData.mpesa_receipt,
            items: mappedItems
          });
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id, supabase]);

  const handleDownload = async (itemId: string) => {
    setDownloadingId(itemId);
    try {
      // Directs the browser to our secure API route
      window.location.href = `/api/download/${itemId}`;
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      // Reset loading state after a brief delay
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="mt-4 text-sm font-black tracking-widest text-gray-400 uppercase">Loading Details...</p>
    </div>
  );

  if (!order) return <div className="py-20 italic font-black text-center text-gray-300">ORDER NOT FOUND</div>;

  const steps = [
    { label: 'Pending', status: 'pending', icon: <Clock size={20}/> },
    { label: 'Processing', status: 'paid', icon: <Construction size={20}/> },
    { label: 'In Transit', status: 'shipped', icon: <Truck size={20}/> },
    { label: 'Delivered', status: 'delivered', icon: <CheckCircle2 size={20}/> },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.payment_status.toLowerCase());
  const isPaid = order.payment_status.toLowerCase() === 'paid' || currentStepIndex > 1;

  return (
    <div className="max-w-6xl pb-20 mx-auto space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Link 
          href="/dashboard/orders" 
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#C75B39] transition-all group"
        >
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#C75B39] group-hover:text-white transition-all">
            <ArrowLeft size={14} />
          </div>
          BACK TO HISTORY
        </Link>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            ID: {order.id.split('-')[0].toUpperCase()}
        </span>
      </div>

      {/* --- TIMELINE --- */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-200/30">
        <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="absolute top-[40%] left-0 w-full h-1 bg-gray-100 hidden md:block" />
          <div 
            className="absolute top-[40%] left-0 h-1 bg-[#C75B39] hidden md:block transition-all duration-1000" 
            style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500
                  ${isCompleted ? 'bg-[#06392F] text-white' : 'bg-white text-gray-300 border border-gray-100'}
                  ${isCurrent ? 'ring-8 ring-orange-50 scale-110 shadow-orange-900/20 bg-[#C75B39]' : ''}
                `}>
                  {step.icon}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-[#06392F]' : 'text-gray-300'}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* --- ITEMS --- */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-xl font-black text-[#06392F] flex items-center gap-3">
                <ReceiptText className="text-[#C75B39]" size={22} /> Shipment Summary
              </h3>
            </div>
            
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col items-start justify-between gap-6 p-8 transition-all sm:flex-row sm:items-center group hover:bg-gray-50/50">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-[#06392F] group-hover:scale-110 transition-transform">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#06392F] text-lg">{item.product_name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full gap-6 sm:w-auto">
                    <p className="font-black text-[#06392F]">KES {(item.unit_price * item.quantity).toLocaleString()}</p>
                    
                    {item.digital_file_url && (
                      <button 
                        disabled={!isPaid || downloadingId === item.id}
                        onClick={() => handleDownload(item.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all
                          ${isPaid 
                            ? 'bg-[#C75B39] text-white hover:bg-[#06392F] shadow-lg shadow-orange-900/20' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          }`}
                      >
                        {downloadingId === item.id ? (
                          <Spinner className="animate-spin" size={14} />
                        ) : (
                          <FileDown size={14} />
                        )}
                        {isPaid ? (downloadingId === item.id ? 'PREPARING...' : 'DOWNLOAD PDF') : 'LOCKED'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-[#F8FAFC] border-t border-gray-100">
               <div className="flex justify-between items-center font-black text-[#06392F]">
                 <span className="uppercase tracking-[0.2em] text-xs">Grand Total</span>
                 <span className="text-2xl text-[#C75B39]">KES {order.total_amount.toLocaleString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* --- INFO PANELS --- */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-[#C75B39]" size={20} />
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Site</h4>
            </div>
            <p className="text-sm font-black text-[#06392F] leading-relaxed italic">
              "{order.shipping_address || 'Standard Office Collection'}"
            </p>
          </div>

          <div className="bg-[#06392F] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute w-24 h-24 transition-all rounded-full -right-4 -top-4 bg-white/5 blur-2xl group-hover:bg-white/10" />
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Payment Details</h4>
            <div className="flex gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">Lipa Na M-Pesa</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  REF: {order.mpesa_receipt || 'PROCESSING'}
                </p>
              </div>
            </div>

            {order.payment_status === 'pending' ? (
              <div className="flex gap-3 p-4 border bg-amber-500/10 border-amber-500/20 rounded-2xl animate-pulse">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[10px] font-bold text-amber-200">Verifying M-Pesa payment...</p>
              </div>
            ) : (
              <div className="flex gap-3 p-4 border bg-emerald-500/10 border-emerald-500/20 rounded-2xl">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Confirmed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
    return <Construction className={`${className}`} size={size} />;
}