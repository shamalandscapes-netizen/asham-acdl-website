'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
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
          stock_quantity: data.stock_quantity ?? 0,
          category: data.category || 'General',
          status: data.status || 'draft',
          image_url: data.image_url || '',
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          download_url: data.download_url || '',
          features: Array.isArray(data.features) ? data.features.join(', ') : (data.features || ''),
          is_digital: !!data.is_digital
        });
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId, supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    };

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
    <div className="flex flex-col items-center justify-center h-screen gap-4" role="alert" aria-busy="true">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Syncing Asham Asset...</p>
    </div>
  );

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-8 duration-500 animate-in fade-in">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-400 hover:text-gray-900 font-bold text-[10px] uppercase tracking-widest transition-colors"
          aria-label="Go back to products list"
        >
          <ArrowLeft size={14} className="mr-2" /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl italic font-black tracking-tighter text-gray-900 uppercase">Edit Material</h1>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">UUID: {productId}</p>
        </div>
      </header>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Core Info */}
        <div className="space-y-6 lg:col-span-2">
          <section className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-6">
            <div>
              <label htmlFor="material-name" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Material Name</label>
              <input 
                id="material-name"
                required type="text" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold focus:ring-2 ring-[#06392F]/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Slug</label>
                <input id="slug" type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-4 font-mono text-xs bg-gray-100 outline-none rounded-2xl" />
              </div>
              <div>
                <label htmlFor="sku" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">SKU</label>
                <input id="sku" type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description</label>
              <textarea id="description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 outline-none bg-gray-50 rounded-2xl" />
            </div>
          </section>

          {/* ACCESSIBLE GALLERY SECTION */}
          <section className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image Gallery</h2>
              <button 
                type="button" 
                title="Add new gallery image"
                aria-label="Add new gallery image"
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
                  <img 
                    src={url} 
                    alt={`${formData.name} gallery image ${i + 1}`} 
                    className="object-cover w-full h-full" 
                  />
                  <button 
                    type="button"
                    title="Remove this image"
                    aria-label={`Remove gallery image ${i + 1}`}
                    onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx) => idx !== i)})}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {formData.gallery.length === 0 && (
                <div className="col-span-4 py-12 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No gallery images added</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Assets & Status */}
        <aside className="space-y-6">
          {/* MAIN IMAGE */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <label htmlFor="cover-url" className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Featured Cover</label>
            <div className="flex items-center justify-center overflow-hidden border aspect-square bg-gray-50 rounded-2xl border-gray-50">
              {formData.image_url ? (
                <img src={formData.image_url} alt={`${formData.name} featured cover`} className="object-cover w-full h-full" />
              ) : (
                <ImageIcon className="text-gray-200" size={40} aria-hidden="true" />
              )}
            </div>
            <input 
              id="cover-url"
              type="text" placeholder="Cover Image URL" value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full mt-4 p-3 bg-gray-50 rounded-xl text-[10px] font-mono outline-none border border-transparent focus:border-gray-200"
            />
          </div>

          {/* DIGITAL ASSET / PDF */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-[#06392F]" aria-hidden="true" />
              <label htmlFor="pdf-url" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blueprint / PDF</label>
            </div>
            <input 
              id="pdf-url"
              type="text" placeholder="Downloadable PDF URL" value={formData.download_url}
              onChange={e => setFormData({...formData, download_url: e.target.value})}
              className="w-full p-3 bg-gray-50 rounded-xl text-[10px] font-mono outline-none"
            />
            {formData.download_url && (
              <a 
                href={formData.download_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 text-[9px] font-black text-[#06392F] uppercase border border-[#06392F]/10 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink size={12} /> Test PDF Link
              </a>
            )}
          </div>

          {/* STATUS & SAVE */}
          <div className="p-6 bg-[#06392F] rounded-[2rem] space-y-4">
            <label htmlFor="status-select" className="sr-only">Product Status</label>
            <select 
              id="status-select"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full p-4 bg-white/10 text-white rounded-2xl outline-none font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer"
            >
              <option value="draft" className="text-black">Draft</option>
              <option value="active" className="text-black">Active (Live)</option>
              <option value="archived" className="text-black">Archived</option>
            </select>
            
            <button 
              type="submit" 
              disabled={saving}
              title="Save all changes to database"
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