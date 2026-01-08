'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Package, Truck, CheckCircle2, 
  Clock, MapPin, CreditCard, Construction, 
  ReceiptText, AlertCircle, FileDown
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

// In Next.js 14.2.x, params is a plain object, NOT a Promise.
export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const supabase = createClient();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        // Using (supabase as any) to ensure build stability
        const { data, error } = await (supabase as any)
          .from('orders')
          .select(`*, order_items (*)`)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const rawData = data as any;
          const mappedItems: OrderItem[] = (rawData.order_items || []).map((item: any) => ({
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

    if (id) fetchOrderDetails();
  }, [id, supabase]);

  const handleDownload = async (itemId: string) => {
    setDownloadingId(itemId);
    try {
      window.location.href = `/api/download/${itemId}`;
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Construction className="animate-spin text-[#06392F]" size={40} />
      <p className="mt-4 text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Retrieving Order Manifest</p>
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
    <div className="max-w-6xl p-4 pb-20 mx-auto space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Link 
          href="/dashboard/orders" 
          className="flex items-center gap-3 text-[10px] font-black text-gray-400 hover:text-[#C75B39] transition-all group tracking-widest"
        >
          <div className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-[#C75B39] group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={14} />
          </div>
          BACK TO HISTORY
        </Link>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
            TRANSACTION ID: {order.id.split('-')[0].toUpperCase()}
        </span>
      </div>

      {/* --- TIMELINE --- */}
      <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-gray-200/40">
        <div className="relative flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="absolute top-[35%] left-0 w-full h-[2px] bg-gray-100 hidden md:block" />
          <div 
            className="absolute top-[35%] left-0 h-[2px] bg-[#C75B39] hidden md:block transition-all duration-1000 ease-out" 
            style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-5">
                <div className={`
                  w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-xl transition-all duration-700
                  ${isCompleted ? 'bg-[#06392F] text-white' : 'bg-white text-gray-300 border border-gray-100'}
                  ${isCurrent ? 'ring-[12px] ring-orange-50 scale-110 bg-[#C75B39] shadow-[#C75B39]/20' : ''}
                `}>
                  {step.icon}
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isCompleted ? 'text-[#06392F]' : 'text-gray-300'}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* --- ITEMS --- */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-[3rem] shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="flex items-center justify-between p-10 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-xl italic font-black text-[#06392F] flex items-center gap-4 uppercase tracking-tighter">
                <ReceiptText className="text-[#C75B39]" size={24} /> Shipment Summary
              </h3>
            </div>
            
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col items-start justify-between gap-8 p-10 transition-all sm:flex-row sm:items-center group hover:bg-gray-50/40">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#06392F] group-hover:scale-110 transition-all border border-gray-100">
                      <Package size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-[#06392F] text-lg uppercase tracking-tight">{item.product_name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">QUANTITY: {item.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between w-full gap-8 sm:w-auto">
                    <p className="text-lg font-black text-[#06392F]">KES {item.unit_price.toLocaleString()}</p>
                    
                    {item.digital_file_url && (
                      <button 
                        disabled={!isPaid || downloadingId === item.id}
                        onClick={() => handleDownload(item.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all
                          ${isPaid 
                            ? 'bg-[#C75B39] text-white hover:bg-[#06392F] shadow-xl shadow-orange-900/20 hover:-translate-y-1' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {downloadingId === item.id ? (
                          <Construction className="animate-spin" size={14} />
                        ) : (
                          <FileDown size={14} />
                        )}
                        {isPaid ? (downloadingId === item.id ? 'VERIFYING...' : 'GET ASSET') : 'LOCKED'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Valuation</span>
                  <span className="text-3xl font-black text-[#C75B39]">KES {order.total_amount.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </div>

        {/* --- INFO PANELS --- */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-xl shadow-gray-200/20">
            <div className="flex items-center gap-3 mb-8">
                <MapPin className="text-[#C75B39]" size={20} />
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Coordinates</h4>
            </div>
            <p className="text-sm font-black text-[#06392F] leading-relaxed italic border-l-4 border-[#C75B39] pl-6 py-2">
              "{order.shipping_address || 'Collection at Headquarters'}"
            </p>
          </div>

          <div className="bg-[#06392F] text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute w-32 h-32 transition-all rounded-full -right-8 -top-8 bg-white/5 blur-3xl group-hover:bg-white/10" />
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-8">Financial Verification</h4>
            <div className="flex gap-5 mb-10">
              <div className="flex items-center justify-center shadow-inner w-14 h-14 rounded-2xl bg-white/10">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-sm font-black tracking-widest uppercase">M-PESA PORTAL</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2 bg-white/5 px-3 py-1 rounded-md inline-block">
                  REC: {order.mpesa_receipt || 'WAITING'}
                </p>
              </div>
            </div>

            {order.payment_status === 'pending' ? (
              <div className="flex gap-4 p-5 border bg-amber-500/10 border-amber-500/20 rounded-2xl animate-pulse">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[10px] font-black text-amber-200 uppercase tracking-widest leading-normal">Awaiting Payment Confirmation from Gateway</p>
              </div>
            ) : (
              <div className="flex gap-4 p-5 border bg-emerald-500/10 border-emerald-500/20 rounded-2xl">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Asset Unlocked & Payment Cleared</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}