'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { ArrowLeft, Loader2, ImageIcon, Save, Plus, X, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductFormState {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  status: string;
  image_url: string;
  gallery: string[];
  download_url: string;
  features: string;
  is_digital: boolean;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = params.id;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormState>({
    name: '', slug: '', sku: '', description: '',
    price: 0, stock_quantity: 0, category: 'General',
    status: 'draft', image_url: '', gallery: [],
    download_url: '', features: '', is_digital: false
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // FIX: Cast supabase as any to avoid 'never' type result
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('id', productId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast.error("Asset not found");
          router.push('/admin/products');
          return;
        }

        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          sku: data.sku || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          stock_quantity: data.stock_quantity ?? data.stock ?? 0,
          category: data.category || 'General',
          status: data.status || 'draft',
          image_url: data.image_url || data.featured_image_url || '',
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          download_url: data.digital_file_url || '',
          features: Array.isArray(data.features) ? data.features.join(', ') : (data.features || ''),
          is_digital: !!data.is_digital
        });
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId, supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      name: formData.name,
      slug: formData.slug,
      sku: formData.sku,
      description: formData.description,
      price: formData.price,
      stock_quantity: formData.stock_quantity,
      stock: formData.stock_quantity,
      category: formData.category,
      status: formData.status,
      image_url: formData.image_url,
      gallery: formData.gallery,
      digital_file_url: formData.download_url,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      is_digital: formData.is_digital,
      updated_at: new Date().toISOString()
    };

    // FIX: Cast supabase as any to bypass the 'never' type restriction on .update()
    const { error } = await (supabase as any)
      .from('products')
      .update(payload)
      .eq('id', productId);

    if (error) {
      toast.error("Update failed: " + error.message);
    } else {
      toast.success("Inventory updated");
      router.refresh();
      router.push('/admin/products');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Syncing Asham Asset...</p>
    </div>
  );

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-8 [transition-duration:500ms] animate-in fade-in">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/admin/products')} 
          className="flex items-center text-gray-400 hover:text-gray-900 font-bold text-[10px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Products
        </button>
        <div className="text-right">
          <h1 className="text-2xl italic font-black tracking-tighter text-gray-900 uppercase">Edit Material</h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">UUID: {productId}</p>
        </div>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <div className="space-y-6 lg:col-span-2">
          <section className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Material Name</label>
              <input 
                required type="text" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold focus:ring-2 ring-[#06392F]/10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-4 font-mono text-xs bg-gray-100 outline-none rounded-2xl" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">SKU</label>
                <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description</label>
              <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 outline-none bg-gray-50 rounded-2xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Price ($)</label>
                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Stock Inventory</label>
                <input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value)})} className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" />
              </div>
            </div>
          </section>

          <section className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Gallery</h2>
              <button 
                type="button" 
                onClick={() => {
                  const url = prompt("Enter Image URL:");
                  if(url) setFormData({...formData, gallery: [...formData.gallery, url]});
                }}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-[#06392F]"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {formData.gallery.map((url, i) => (
                <div key={i} className="relative overflow-hidden bg-gray-100 border group aspect-square rounded-2xl border-gray-50">
                  <img src={url} alt="Gallery item" className="object-cover w-full h-full" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Featured Cover</label>
            <div className="flex items-center justify-center overflow-hidden border aspect-square bg-gray-50 rounded-2xl border-gray-50">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Cover" className="object-cover w-full h-full" />
              ) : (
                <ImageIcon className="text-gray-200" size={40} />
              )}
            </div>
            <input 
              type="text" placeholder="Cover Image URL" value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full mt-4 p-3 bg-gray-50 rounded-xl text-[10px] font-mono outline-none"
            />
          </div>

          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-[#06392F]" />
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Asset (PDF)</label>
            </div>
            <input 
              type="text" placeholder="digital_file_url" value={formData.download_url}
              onChange={e => setFormData({...formData, download_url: e.target.value})}
              className="w-full p-3 bg-gray-50 rounded-xl text-[10px] font-mono outline-none"
            />
            {formData.download_url && (
              <a href={formData.download_url} target="_blank" className="flex items-center justify-center gap-1 text-[9px] font-bold text-[#06392F] uppercase border py-2 rounded-lg">
                <ExternalLink size={10} /> Test File Link
              </a>
            )}
          </div>

          <div className="p-6 bg-[#06392F] rounded-[2rem] space-y-4">
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full p-4 bg-white/10 text-white rounded-2xl outline-none font-black uppercase text-[10px] tracking-widest appearance-none"
            >
              <option value="draft" className="text-black">Draft</option>
              <option value="active" className="text-black">Active (Live)</option>
              <option value="archived" className="text-black">Archived</option>
            </select>
            
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-5 bg-white text-[#06392F] rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gray-100 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {saving ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Save className="mr-2" size={18} />}
              Commit Changes
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}