'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, DraftingCompass } from 'lucide-react';

interface DigitalProduct {
  id: string;
  name: string;
  file_path: string | null;
  category: string;
}

export default function DigitalDownloadsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const supabase = createClient();

  const fetchProducts = async () => {
    try {
      // FIX 1: Cast supabase as any to prevent the .from('products') returning 'never'
      const { data } = await (supabase as any)
        .from('products')
        .select('id, name, file_path, category')
        .eq('type', 'digital')
        .order('name');
      
      if (data) setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProduct) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedProduct}-${Date.now()}.${fileExt}`;
      const filePath = `blueprints/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // FIX 2: Cast supabase as any here. This is the exact spot causing your build failure.
      // This bypasses the strict schema check entirely.
      const { error: dbError } = await (supabase as any)
        .from('products')
        .update({ file_path: filePath })
        .eq('id', selectedProduct);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Technical file linked successfully!' });
      setFile(null);
      setSelectedProduct('');
      fetchProducts();

    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({ type: 'error', text: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white selection:bg-[#C75B39] selection:text-white">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 mx-auto mb-12 md:flex-row max-w-7xl">
        <div>
          <h1 className="text-4xl font-black text-[#06392F] uppercase tracking-tighter">
            Digital <span className="text-zinc-300">Assets</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-[0.3em]">
            Authorized Blueprint Management System
          </p>
        </div>
        <div className="items-center hidden gap-3 px-5 py-3 border md:flex border-zinc-100 rounded-2xl bg-zinc-50/50">
          <DraftingCompass size={20} className="text-[#C75B39]" />
          <span className="text-[9px] font-black text-[#06392F] uppercase tracking-widest">
            Registry Status: Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 mx-auto lg:grid-cols-12 max-w-7xl">
        
        {/* LEFT: UPLOAD FORM */}
        <div className="lg:col-span-4 p-8 bg-white border border-zinc-100 shadow-2xl shadow-[#06392F]/5 rounded-[2.5rem] h-fit">
          <h2 className="flex items-center gap-3 mb-8 text-xl font-black text-[#06392F] uppercase tracking-tighter">
            <UploadCloud size={24} className="text-[#C75B39]" /> New Transmission
          </h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="product-select" className="block text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                Target Digital Product
              </label>
              <select 
                id="product-select"
                className="w-full p-4 border border-zinc-100 rounded-2xl bg-zinc-50 font-bold text-[#06392F] text-xs focus:ring-2 focus:ring-[#C75B39] outline-none"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">-- SELECT ASSET --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.toUpperCase()} {p.file_path ? '?' : '!!'}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".pdf,.zip,.dwg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center p-12 border-2 border-zinc-100 border-dashed rounded-[2rem] cursor-pointer hover:border-[#C75B39] hover:bg-zinc-50/50 transition-all group"
              >
                {file ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="text-[10px] font-black text-[#06392F] uppercase tracking-widest break-all px-4">{file.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-200 group-hover:text-[#C75B39] transition-colors" />
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Click to Attach Technical PDF</p>
                  </div>
                )}
              </label>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {message.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !file || !selectedProduct}
              className="w-full bg-[#06392F] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#C75B39] disabled:opacity-30 transition-all shadow-xl"
            >
              {uploading ? <Loader2 className="mx-auto animate-spin" size={16} /> : 'Authorize & Link Asset'}
            </button>
          </form>
        </div>

        {/* RIGHT: LIST */}
        <div className="lg:col-span-8 overflow-hidden bg-white border border-zinc-100 shadow-2xl shadow-[#06392F]/5 rounded-[2.5rem]">
          <div className="p-8 border-b border-zinc-50 bg-zinc-50/50">
            <h3 className="text-[11px] font-black text-[#06392F] uppercase tracking-[0.2em]">Active Technical Inventory</h3>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
               <div className="p-20 text-center text-zinc-300 font-black uppercase tracking-[0.3em]">Loading Rows...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-50">
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Architectural Label</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-right">Identifier Path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {products.map((product) => (
                    <tr key={product.id} className="transition-colors group hover:bg-zinc-50/50">
                      <td className="px-8 py-7">
                        <div className="text-[13px] font-black text-[#06392F] uppercase tracking-tighter">{product.name}</div>
                        <div className="text-[8px] font-black text-[#C75B39] uppercase tracking-[0.2em] mt-1">{product.category}</div>
                      </td>
                      <td className="px-8 py-7">
                        {product.file_path ? (
                          <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Linked</span>
                        ) : (
                          <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Pending</span>
                        )}
                      </td>
                      <td className="px-8 py-7 font-mono text-[9px] text-right text-zinc-400">
                        {product.file_path ? product.file_path.split('/').pop() : 'VOID'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
