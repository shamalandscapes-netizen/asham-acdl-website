'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Upload, Save, FileText, 
  Loader2, Trash2, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Materials',
    is_digital: false,
    stock_quantity: '0',
    image_url: '',
    digital_file_url: '' 
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id || id === 'new') {
        setLoading(false);
        return;
      }

      try {
        // FIX: Cast supabase as any to bypass 'never' type result
        const { data, error } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          const p = data as any;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            price: (p.price || 0).toString(),
            category: p.category || 'Materials',
            is_digital: p.is_digital || false,
            stock_quantity: (p.stock_quantity ?? p.stock ?? 0).toString(),
            image_url: p.image_url || '',
            digital_file_url: p.digital_file_url || ''
          });
        }
      } catch (err: any) {
        setError("Product not found.");
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, supabase]);

  const handleUpload = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw new Error(`${bucket}: ${uploadError.message}`);
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updatedImageUrl = formData.image_url;
      let updatedFilePath = formData.digital_file_url;

      if (imageFile) updatedImageUrl = await handleUpload(imageFile, 'product-images');
      if (formData.is_digital && blueprintFile) updatedFilePath = await handleUpload(blueprintFile, 'blueprints');

      // FIX: Cast supabase as any to allow updating unknown schema
      const { error: dbError } = await (supabase as any).from('products').update({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_digital: formData.is_digital,
        stock_quantity: parseInt(formData.stock_quantity),
        stock: parseInt(formData.stock_quantity),
        image_url: updatedImageUrl,
        digital_file_url: updatedFilePath,
        updated_at: new Date().toISOString()
      }).eq('id', id);

      if (dbError) throw dbError;
      toast.success("Asset updated");
      router.refresh();
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // FIX: Cast supabase as any for deletion
      const { error } = await (supabase as any).from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success("Asset permanently removed");
      router.push('/admin/products');
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Asset...</p>
    </div>
  );

  return (
    // FIXED: Explicit duration for Tailwind build
    <div className="max-w-4xl p-4 mx-auto space-y-6 [transition-duration:500ms] animate-in fade-in">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#06392F]">
        <ArrowLeft size={14} /> Back to Catalog
      </Link>
      
      <div className="flex items-end justify-between">
        <h1 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">Edit Asset</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-8 space-y-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material Name</label>
              <input required type="text" className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (KES)</label>
                <input required type="number" className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</label>
                <input required type="number" className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea rows={4} className="w-full p-4 outline-none bg-gray-50 rounded-2xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {formData.is_digital && (
            <div className="p-8 space-y-4 border border-indigo-100 bg-indigo-50/30 rounded-[2rem]">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-indigo-700"><FileText size={18} /> Blueprint File</label>
                {formData.digital_file_url && (
                  <a href={formData.digital_file_url} target="_blank" className="text-[10px] font-bold flex items-center gap-1 text-indigo-500 underline">
                    <ExternalLink size={12} /> View Current
                  </a>
                )}
              </div>
              <input type="file" onChange={e => setBlueprintFile(e.target.files?.[0] || null)} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <label className="block mb-4 text-[10px] font-black text-gray-400 uppercase text-center tracking-widest">Primary Image</label>
            <div className="relative flex items-center justify-center overflow-hidden border-2 border-dashed aspect-square rounded-2xl bg-gray-50">
               {formData.image_url && !imageFile && (
                 <img src={formData.image_url} className="absolute inset-0 object-cover w-full h-full" alt="Current" />
               )}
               <input type="file" className="absolute inset-0 z-10 opacity-0 cursor-pointer" onChange={e => setImageFile(e.target.files?.[0] || null)} />
               <Upload className="text-gray-300" />
            </div>
          </div>

          <button type="submit" disabled={saving || deleting} className="w-full py-5 rounded-[2rem] bg-[#06392F] text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Commit Update
          </button>

          <div className="pt-4 border-t border-gray-100">
            {!confirmDelete ? (
              <button 
                type="button" 
                onClick={() => setConfirmDelete(true)}
                className="w-full py-4 text-gray-400 hover:text-red-500 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Remove from Inventory
              </button>
            ) : (
              <div className="space-y-2 animate-in slide-in-from-bottom-2">
                <p className="text-[8px] font-black text-red-500 uppercase text-center tracking-tighter">Are you absolutely sure?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setConfirmDelete(false)}
                    className="py-3 bg-gray-100 text-gray-600 rounded-xl text-[9px] font-black uppercase"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="py-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center"
                  >
                    {deleting ? <Loader2 className="animate-spin" size={12} /> : "Confirm Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}