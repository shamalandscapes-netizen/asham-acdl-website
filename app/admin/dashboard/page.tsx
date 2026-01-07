'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, Wallet, Receipt, AlertCircle, 
  BarChart3, Loader2, FileText, Download
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AccountantDashboard() {
  const [loading, setLoading] = useState(true);
  const [finStats, setFinStats] = useState({
    totalSettled: 0,
    totalPending: 0,
    categoryRevenue: {} as Record<string, number>,
    recentTransactions: [] as any[]
  });

  const supabase = createClient();

  async function fetchFinancialData() {
    setLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, products(name, category)')
        .order('created_at', { ascending: false });

      if (!error && orders) {
        let settled = 0;
        let pending = 0;
        const catRev: Record<string, number> = {};

        orders.forEach((order: any) => {
          const amount = order.total_amount || 0;
          
          // Track Payment Status
          if (order.payment_status === 'Completed') settled += amount;
          else if (order.payment_status === 'Pending') pending += amount;

          // Safe check for products (handling both object and array response)
          const productData = Array.isArray(order.products) ? order.products[0] : order.products;
          const cat = productData?.category || 'Uncategorized';
          
          catRev[cat] = (catRev[cat] || 0) + amount;
        });

        setFinStats({
          totalSettled: settled,
          totalPending: pending,
          categoryRevenue: catRev,
          recentTransactions: orders.slice(0, 8)
        });
      }
    } catch (err) {
      console.error("Finance fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFinancialData(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-[#C75B39] mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Auditing Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Financial Ledger</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue Reporting & Asset tracking</p>
        </div>
        <button 
          type="button"
          title="Download statement"
          className="bg-white border-2 border-gray-100 text-gray-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#C75B39] hover:text-[#C75B39] transition-all flex items-center gap-2"
        >
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* --- REVENUE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#06392F] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Realized Revenue</p>
            <p className="text-3xl font-black italic">KES {finStats.totalSettled.toLocaleString()}</p>
          </div>
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-white/5 group-hover:scale-110 transition-transform" size={120} />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Sync</p>
            <p className="text-2xl font-black text-gray-900 italic tracking-tight">KES {finStats.totalPending.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Receipt size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Invoices</p>
            <p className="text-2xl font-black text-gray-900 italic tracking-tight">{finStats.recentTransactions.length} Items</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- CATEGORY PERFORMANCE --- */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#C75B39]" /> Revenue Allocation
            </h3>
          </div>
          <div className="space-y-6">
            {Object.entries(finStats.categoryRevenue).length > 0 ? (
              Object.entries(finStats.categoryRevenue).map(([cat, val]) => (
                <div key={cat} className="group">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-gray-500">{cat}</span>
                    <span className="text-gray-900">KES {val.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#06392F] rounded-full group-hover:bg-[#C75B39] transition-colors" 
                      style={{ width: `${(val / (finStats.totalSettled + finStats.totalPending || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No category data available yet.</p>
            )}
          </div>
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={16} className="text-[#C75B39]" /> Recent Ledger
          </h3>
          <div className="space-y-3">
            {finStats.recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="max-w-[150px]">
                  <p className="text-xs font-bold text-gray-900 truncate">{t.products?.name || 'Project Item'}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${t.payment_status === 'Completed' ? 'text-green-600' : 'text-amber-500'}`}>
                    KES {t.total_amount?.toLocaleString()}
                  </p>
                  <p className="text-[8px] font-black uppercase opacity-40">{t.payment_status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}