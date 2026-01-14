'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Upload, Save, FileText, 
  Loader2, Plus, X, Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
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

  // Helper to generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleUpload = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw new Error(`${bucket}: ${uploadError.message}`);
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = formData.image_url;
      let finalDigitalUrl = formData.digital_file_url;

      // 1. Upload Files if present
      if (imageFile) {
        finalImageUrl = await handleUpload(imageFile, 'product-images');
      }
      if (formData.is_digital && blueprintFile) {
        finalDigitalUrl = await handleUpload(blueprintFile, 'blueprints');
      }

      // 2. Insert into Database
      // FIX: Cast supabase as any to bypass the 'never' type restriction on .insert()
      const { error: dbError } = await (supabase as any)
        .from('products')
        .insert({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          is_digital: formData.is_digital,
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          stock: parseInt(formData.stock_quantity) || 0, // Syncing both columns
          image_url: finalImageUrl,
          digital_file_url: finalDigitalUrl,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast.success("New Asset Published");
      router.refresh();
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    // FIXED: Explicit duration property for Tailwind build stability
    <div className="max-w-4xl p-4 mx-auto space-y-6 [transition-duration:500ms] animate-in fade-in">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#06392F]">
        <ArrowLeft size={14} /> Back to Catalog
      </Link>
      
      <h1 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">Upload New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="p-8 space-y-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Name</label>
              <input 
                required type="text" 
                className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" 
                placeholder="e.g. Modern Villa Blueprint"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (KES)</label>
                <input required type="number" className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Stock</label>
                <input required type="number" className="w-full p-4 font-bold outline-none bg-gray-50 rounded-2xl" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea rows={4} className="w-full p-4 outline-none bg-gray-50 rounded-2xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {/* Digital Toggle */}
          <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black tracking-widest uppercase">Digital Asset</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Does this include a downloadable PDF?</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_digital: !formData.is_digital})}
                className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_digital ? 'bg-[#06392F]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_digital ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {formData.is_digital && (
              <div className="p-4 mt-4 space-y-3 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
                <label className="flex items-center gap-2 text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                  <FileText size={14} /> Upload Blueprint (PDF)
                </label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={e => setBlueprintFile(e.target.files?.[0] || null)}
                  className="text-[10px] font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-[2rem]">
            <label className="block mb-4 text-[10px] font-black text-gray-400 uppercase text-center tracking-widest">Cover Image</label>
            <div className="relative flex items-center justify-center overflow-hidden border-2 border-dashed aspect-square rounded-2xl bg-gray-50 group">
               {imageFile ? (
                 <div className="p-4 text-center">
                    <p className="text-[10px] font-black text-[#06392F] uppercase">{imageFile.name}</p>
                    <button type="button" onClick={() => setImageFile(null)} className="mt-2 text-[8px] text-red-500 font-bold uppercase underline">Remove</button>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-2">
                    <Upload className="text-gray-300" />
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Click to upload</span>
                 </div>
               )}
               <input type="file" accept="image/*" className="absolute inset-0 z-10 opacity-0 cursor-pointer" onChange={e => setImageFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            className="w-full py-5 rounded-[2rem] bg-[#06392F] text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
            Publish Asset
          </button>

          <p className="text-[8px] text-center text-gray-400 uppercase font-bold tracking-widest">
            By publishing, this asset will be immediately <br /> visible in the store catalog.
          </p>
        </div>
      </form>
    </div>
  );
}