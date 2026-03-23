'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import { 
  FileText, Search, ExternalLink, Clock, CheckCircle, 
  MoreHorizontal, ArrowUpRight, Loader2, X, Trash2,
  Download, Mail, Building2, User2, MapPin, Printer
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QuoteArchive() {
  const supabase = createClient();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  async function fetchQuotes() {
    const { data, error } = await (supabase as any)
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) toast.error("Database sync failed");
    else setQuotes(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchQuotes(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase as any)
      .from('quotes')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) toast.error("Update failed");
    else {
      toast.success(`Marked as ${newStatus}`);
      fetchQuotes();
      setSelectedQuote(null);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Permanently delete this record?")) return;
    const { error } = await (supabase as any).from('quotes').delete().eq('id', id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Quote removed");
      fetchQuotes();
    }
  };

  const handleSendEmail = async (quote: any) => {
    setSendingEmail(true);
    try {
      // Note: This calls a Next.js API route we will create in the next step
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        body: JSON.stringify({ quote }),
      });
      if (response.ok) toast.success(`Quote sent to ${quote.client_name}`);
      else throw new Error();
    } catch (err) {
      toast.error("Email service unavailable");
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.quote_reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Accessing Sales Vault...</p>
    </div>
  );

  return (
    <div className="relative">
      {/* --- SCREEN VIEW (HIDDEN ON PRINT) --- */}
      <div className="p-6 mx-auto space-y-8 duration-700 max-w-7xl animate-in fade-in print:hidden">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">Sales Pipeline</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Estimates & Revenue Forecasting</p>
          </div>
          <div className="relative">
            <Search className="absolute text-gray-300 -translate-y-1/2 left-4 top-1/2" size={18} />
            <input 
              type="text" 
              placeholder="Filter quotes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none text-sm w-72 shadow-sm"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="bg-white p-6 border border-gray-50 rounded-[2rem] shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Total Volume</span>
            <p className="text-2xl font-black">{quotes.length}</p>
          </div>
          <div className="bg-white p-6 border border-gray-50 rounded-[2rem] shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Pipeline Value</span>
            <p className="text-2xl font-black text-[#C75B39]">KES {quotes.reduce((a, b) => a + Number(b.total_amount), 0).toLocaleString()}</p>
          </div>
          {/* Add more stats as needed */}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50/50 border-gray-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="transition-colors hover:bg-gray-50/30 group">
                  <td className="px-8 py-5">
                    <p className="font-black tracking-tight text-gray-900 uppercase">{quote.client_name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{quote.quote_reference}</p>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-900">KES {Number(quote.total_amount).toLocaleString()}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      quote.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2 px-8 py-5 mt-1 text-right">
                    <button onClick={() => setSelectedQuote(quote)} className="p-3 bg-gray-50 text-gray-400 hover:text-[#06392F] rounded-xl transition-all">
                      <ExternalLink size={18} />
                    </button>
                    <button onClick={() => deleteQuote(quote.id)} className="p-3 text-gray-300 transition-all hover:text-rose-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DRAWER (HIDDEN ON PRINT) --- */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[70] flex justify-end print:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedQuote(null)} />
          <div className="relative flex flex-col w-full max-w-lg p-10 duration-300 bg-white shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#06392F]">Quote Details</h2>
              <button onClick={() => setSelectedQuote(null)} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto">
               <div className="p-6 bg-gray-50 rounded-3xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Name</p>
                  <p className="text-xl font-black text-gray-900 uppercase">{selectedQuote.client_name}</p>
               </div>

               <div className="space-y-3">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Line Items</h3>
                 {selectedQuote.items.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between p-4 text-sm font-bold uppercase bg-white border border-gray-100 rounded-2xl">
                     <span>{item.name} (x{item.quantity})</span>
                     <span className="font-black">KES {(item.quantity * item.unitPrice).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="pt-8 mt-8 space-y-3 border-t">
              <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <Printer size={16} /> Print / Save as PDF
              </button>
              <button 
                onClick={() => handleSendEmail(selectedQuote)} 
                disabled={sendingEmail}
                className="w-full py-4 border-2 border-[#06392F] text-[#06392F] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {sendingEmail ? <Loader2 className="animate-spin" size={16}/> : <Mail size={16} />} 
                Email to Client
              </button>
              <button onClick={() => updateStatus(selectedQuote.id, 'approved')} className="w-full py-4 bg-[#06392F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">
                Approve Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PRINT TEMPLATE (HIDDEN ON SCREEN, VISIBLE ON PRINT) --- */}
      {selectedQuote && (
        <div className="hidden min-h-screen p-12 bg-white print:block">
          <div className="flex justify-between items-start border-b-4 border-[#06392F] pb-8">
            <div>
              <h1 className="text-4xl italic font-black tracking-tighter uppercase">Asham <span className="text-[#C75B39]">ACDL</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Construction & Building Materials</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black uppercase">Estimate</p>
              <p className="text-sm font-bold text-slate-500">#{selectedQuote.quote_reference}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 my-12">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Prepared For</p>
              <p className="text-xl font-black uppercase">{selectedQuote.client_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Issue Date</p>
              <p className="text-sm font-bold">{new Date(selectedQuote.created_at).toLocaleDateString('en-KE')}</p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead>
              <tr className="text-left border-b-2 border-slate-900">
                <th className="py-4 text-[10px] font-black uppercase">Description</th>
                <th className="py-4 text-[10px] font-black uppercase text-center">Qty</th>
                <th className="py-4 text-[10px] font-black uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedQuote.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-4 text-sm font-bold uppercase">{item.name}</td>
                  <td className="py-4 text-sm font-bold text-center">{item.quantity}</td>
                  <td className="py-4 text-sm font-black text-right">KES {(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-400"><span>Subtotal</span><span>KES {Number(selectedQuote.subtotal).toLocaleString()}</span></div>
              <div className="flex items-end justify-between pt-4 border-t-2 border-slate-900">
                <span className="text-xs font-black uppercase">Total Amount</span>
                <span className="text-2xl font-black">KES {Number(selectedQuote.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PRINT CSS --- */}
      <style jsx global>{`
        @media print {
          nav, aside, header, .print\:hidden { display: none !important; }
          body, main { background: white !important; padding: 0 !important; margin: 0 !important; }
          .print\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}