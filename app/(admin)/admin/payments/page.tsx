'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/supabase/client';
import { 
  Receipt, Search, Filter, RefreshCcw, 
  FileText, Download, Loader2, ArrowUpRight, 
  TrendingUp, X, Calendar, User, Hash, Info,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPermissions } from '@/lib/permissions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- TYPES ---
// Updated to match exactly what your database/query provides
interface Transaction {
  id: string;
  reference_code: string;
  customer_name: string;
  amount: number;
  category: 'house_plans' | 'consultations' | 'construction' | 'custom_designs';
  status: 'completed' | 'refunded' | 'pending';
  created_at: string;
  items?: string;
}

export default function PaymentLedgerPage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showAura, setShowAura] = useState(true);

  const { canManageFinances, roleLabel } = getPermissions(userRole);

  useEffect(() => {
    const auraTimer = setTimeout(() => setShowAura(false), 3000);

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserRole(user?.user_metadata?.role || 'employee');
      
      // Explicitly select the columns to ensure they match our Transaction interface
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          id,
          reference_code,
          customer_name,
          amount,
          category,
          status,
          created_at,
          items
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase Error:", error);
        toast.error("Sync Error");
      } else {
        // Use type assertion to satisfy the compiler
        setTransactions((data as unknown as Transaction[]) || []);
      }
      setLoading(false);
    }
    init();

    return () => clearTimeout(auraTimer);
  }, [supabase]);

  // --- ANALYTICS LOGIC ---
  const stats = useMemo(() => {
    const categories: Record<string, { label: string; color: string; total: number }> = {
      house_plans: { label: 'Plans', color: 'bg-[#C75B39]', total: 0 },
      consultations: { label: 'Consults', color: 'bg-[#06392F]', total: 0 },
      construction: { label: 'Builds', color: 'bg-amber-500', total: 0 },
      custom_designs: { label: 'Custom', color: 'bg-blue-500', total: 0 },
    };

    transactions.forEach(tx => {
      if (categories[tx.category]) categories[tx.category].total += tx.amount;
    });

    return Object.values(categories);
  }, [transactions]);

  const grandTotal = stats.reduce((sum, s) => sum + s.total, 0);

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = (tx.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.reference_code?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = activeCategory === 'all' || tx.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory, transactions]);

  const exportLedgerToPDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    doc.setFillColor(6, 57, 47);
    doc.roundedRect(14, 15, 12, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('A', 18.5, 23.5);

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.text('REVENUE INTELLIGENCE LEDGER', 30, 21);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text(`REPORT GENERATED: ${timestamp} | HQ 2026`, 30, 26);

    autoTable(doc, {
      startY: 35,
      head: [['REF CODE', 'CUSTOMER', 'CATEGORY', 'DATE', 'AMOUNT (KES)']],
      body: filteredData.map(tx => [
        tx.reference_code.toUpperCase(),
        tx.customer_name.toUpperCase(),
        tx.category.replace('_', ' ').toUpperCase(),
        new Date(tx.created_at).toLocaleDateString(),
        tx.amount.toLocaleString()
      ]),
      theme: 'striped',
      headStyles: { fillColor: [6, 57, 47], fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' } 
      }
    });

    doc.save(`ASHAM_LEDGER_${new Date().getTime()}.pdf`);
    toast.success("Financial Ledger Exported");
  };

  return (
    <div className="relative pb-20 space-y-8 duration-700 animate-in fade-in">
      
      {showAura && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="bg-[#06392F]/90 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-[0_20px_50px_rgba(6,57,47,0.3)]">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <ShieldCheck size={14} className="relative text-emerald-400" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.25em] whitespace-nowrap">
              Secure Ledger Session Active
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase text-slate-900">
            <Receipt className="text-[#C75B39]" /> Revenue <span className="text-[#C75B39]">Intelligence</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase text-slate-500">Access: {roleLabel}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live HQ Ledger • 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportLedgerToPDF}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all shadow-lg active:scale-95"
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <TrendingUp size={14} /> Revenue Distribution
          </h3>
          <div className="flex w-full h-3 mb-8 overflow-hidden rounded-full bg-slate-50">
            {stats.map((s, i) => (
              <div key={i} className={`${s.color} transition-all duration-1000`} style={{ width: `${grandTotal > 0 ? (s.total/grandTotal)*100 : 0}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{s.label}</p>
                <p className="text-xs font-black text-slate-900">KES {s.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#06392F] p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-center text-white relative overflow-hidden group">
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Settled Volume</p>
          <h2 className="mt-2 text-4xl font-black tracking-tighter">KES {grandTotal.toLocaleString()}</h2>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM VITALITY: OPTIMAL
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute -translate-y-1/2 left-5 top-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by reference or customer name..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-xs font-bold focus:ring-4 focus:ring-[#C75B39]/5 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pb-2 overflow-x-auto md:pb-0 scrollbar-hide">
          {['all', 'house_plans', 'consultations', 'construction'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCategory === cat ? 'bg-[#C75B39] text-white border-[#C75B39]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b bg-slate-50/50 border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Detail</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Entity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (KES)</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#C75B39]" /></td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No transactions found</td></tr>
            ) : filteredData.map((tx) => (
              <tr key={tx.id} className="transition-all group hover:bg-slate-50/80">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-[#C75B39] group-hover:text-white transition-colors">
                      <Hash size={14} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-bold text-slate-400">{tx.reference_code}</p>
                      <p className="text-[9px] text-slate-300 font-bold uppercase mt-0.5">{new Date(tx.created_at).toDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-black tracking-tight uppercase text-slate-800">{tx.customer_name}</p>
                  <span className="text-[8px] font-black text-[#C75B39] uppercase tracking-widest">{tx.category.replace('_', ' ')}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-slate-900">{tx.amount.toLocaleString()}</span>
                    {tx.status === 'completed' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-amber-500" />}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 transition-all translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                    <button 
                      onClick={() => setSelectedTx(tx)}
                      className="p-3 transition-all text-slate-400 hover:bg-slate-100 rounded-xl"
                    >
                      <FileText size={16} />
                    </button>
                    {canManageFinances && (
                      <button className="p-3 transition-all text-amber-500 hover:bg-amber-50 rounded-xl">
                        <RefreshCcw size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-[#06392F] text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl italic font-black tracking-tighter uppercase">Receipt Detail</h2>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Asham ACDH Finance Audit</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-3 text-white transition-all bg-white/10 hover:bg-white/20 rounded-2xl">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex items-start justify-between pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={10}/> Customer</p>
                  <p className="text-sm font-black uppercase text-slate-900">{selectedTx.customer_name}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2"><Calendar size={10}/> Date</p>
                  <p className="text-sm font-black uppercase text-slate-900">{new Date(selectedTx.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction Ref</span>
                    <span className="text-[10px] font-mono font-bold text-slate-900">{selectedTx.reference_code}</span>
                 </div>
                 <div className="flex justify-between p-4 border border-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Type</span>
                    <span className="text-[10px] font-black text-[#C75B39] uppercase">{selectedTx.category}</span>
                 </div>
              </div>

              <div className="flex items-end justify-between pt-8 border-t border-slate-100">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                   <h3 className="text-3xl font-black text-[#06392F]">KES {selectedTx.amount.toLocaleString()}</h3>
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {selectedTx.status}
                </div>
              </div>

              <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#C75B39] transition-all">
                <Download size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CheckCircle2 = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
