'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Calculator, Receipt, 
  FileText, Download, User, HardHat,
  Save, Loader2, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 1. Define the types outside the component
interface Product {
  id: string;
  name: string;
  price: number;
}

interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

// 2. Ensure the function is EXPORTED DEFAULT
export default function CostCalculatorPage() {
  const supabase = createClient();
  const [inventory, setInventory] = useState<Product[]>([]);
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('Residential');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      const { data } = await supabase.from('products').select('id, name, price').order('name');
      if (data) setInventory(data);
      setLoading(false);
    }
    fetchInventory();
  }, [supabase]);

  // Calculation Logic
  const subtotal = quoteItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  const quoteRef = `AS-QT-${Math.floor(Date.now()/10000)}`;

  const addItem = () => {
    if (inventory.length === 0) return;
    const firstItem = inventory[0];
    setQuoteItems([...quoteItems, { 
      productId: firstItem.id, 
      name: firstItem.name, 
      quantity: 1, 
      unitPrice: firstItem.price 
    }]);
  };

  const handleSaveQuote = async () => {
    if (!clientName) return toast.error("Please enter a Client Name");
    if (quoteItems.length === 0) return toast.error("Quote is empty");

    setIsSaving(true);
    try {
      const { error } = await (supabase as any).from('quotes').insert([{
        client_name: clientName,
        project_type: projectType,
        items: quoteItems,
        subtotal,
        tax,
        total_amount: total,
        quote_reference: quoteRef,
        status: 'pending'
      }]);

      if (error) throw error;
      toast.success("Quote saved to records");
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center uppercase font-black text-[10px] tracking-widest text-gray-400">Loading Inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 duration-700 animate-in fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl italic font-black tracking-tighter text-gray-900 uppercase">
            <Calculator className="text-[#06392F]" /> Project Estimator
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Inventory Quoting System</p>
        </div>
        
        <div className="flex gap-3 no-print">
          <button 
            onClick={handleSaveQuote}
            disabled={isSaving}
            className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-100 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            Save Estimate
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-[#06392F] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[#06392F]/20"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Client Name</label>
                  <input 
                    className="w-full px-4 py-3 text-sm font-bold border-none outline-none bg-gray-50 rounded-xl"
                    value={clientName}
                    placeholder="Enter client name"
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</label>
                  <select 
                    className="w-full px-4 py-3 text-sm font-bold border-none outline-none bg-gray-50 rounded-xl"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bill of Quantities</h3>
                   <button onClick={addItem} className="text-[10px] font-black text-[#06392F] uppercase border-b-2 border-[#06392F]">+ Add Line</button>
                </div>
                {quoteItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50 rounded-xl">
                    <select 
                      className="flex-1 px-3 py-2 text-sm font-bold bg-white border-none rounded-lg outline-none"
                      value={item.productId}
                      onChange={(e) => {
                        const product = inventory.find(p => p.id === e.target.value);
                        if (product) {
                          const updated = [...quoteItems];
                          updated[idx] = { ...updated[idx], productId: product.id, name: product.name, unitPrice: product.price };
                          setQuoteItems(updated);
                        }
                      }}
                    >
                      {inventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input 
                      type="number" 
                      className="w-20 p-2 text-sm font-bold text-center border-none rounded-lg" 
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...quoteItems];
                        updated[idx].quantity = Number(e.target.value);
                        setQuoteItems(updated);
                      }}
                    />
                    <span className="text-xs font-black min-w-[100px] text-right">KES {(item.unitPrice * item.quantity).toLocaleString()}</span>
                    <button onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== idx))} className="p-2 text-gray-300 transition-colors hover:text-red-500">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-[#06392F] text-white p-8 rounded-[2.5rem] h-fit sticky top-6 shadow-2xl shadow-[#06392F]/20">
           <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Quote Summary</p>
           <div className="space-y-4">
              <div className="flex justify-between font-bold"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-white/60"><span>Tax (16%)</span><span>KES {tax.toLocaleString()}</span></div>
              <div className="pt-4 border-t border-white/10">
                 <p className="text-[10px] font-black text-[#C75B39] uppercase tracking-[0.2em]">Project Total</p>
                 <p className="mt-1 text-3xl font-black tracking-tighter">KES {total.toLocaleString()}</p>
              </div>
           </div>
           <div className="flex items-center gap-2 pt-8 mt-8 border-t border-white/10">
              <CheckCircle2 className="text-emerald-400" size={16}/>
              <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Ref: {quoteRef}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
