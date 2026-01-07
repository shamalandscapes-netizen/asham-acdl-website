'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  UploadCloud, 
  ChevronLeft, 
  Save, 
  Image as ImageIcon, 
  Loader2,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: 'Construction',
    sku: ''
  });

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = '';

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        image_url = publicUrl;
      }

      // 2. Save Product Data to Database
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          image_url,
          slug: generateSlug(formData.name),
        } as any]);

      if (dbError) throw dbError;

      toast.success('Material added to catalog!');
      router.push('/admin/inventory');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 duration-700 animate-in fade-in slide-in-from-bottom-4">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#06392F] transition-colors"
      >
        <ChevronLeft size={14} /> Back to Inventory
      </button>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Add New Material</h1>
          <p className="text-sm italic font-medium text-slate-500">Expand the Asham ACDL inventory registry.</p>
        </div>
        <button 
          form="product-form"
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-[#C75B39] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#C75B39]/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {loading ? 'Processing...' : 'Publish Material'}
        </button>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Image Upload */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-4 tracking-widest px-1">Product Media</label>
            
            <div className={`relative group border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center p-6 min-h-[300px] ${imagePreview ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100 bg-slate-50/50 hover:border-[#06392F]/20'}`}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="object-contain w-full h-full rounded-xl" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => {setImageFile(null); setImagePreview(null);}}
                    className="absolute p-2 text-white transition-transform rounded-full shadow-lg top-4 right-4 bg-rose-500 hover:scale-110"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center gap-3 cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-[#06392F] transition-colors">
                    <UploadCloud size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black tracking-tighter uppercase text-slate-900">Upload Thumbnail</p>
                    <p className="text-[9px] font-medium text-slate-400">PNG, JPG or WEBP (Max 2MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </label>
              )}
            </div>
            
            {imageFile && (
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest justify-center">
                <CheckCircle2 size={14} /> Ready for Sync
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Product Title</label>
              <input 
                required
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#06392F]"
                placeholder="e.g. Premium Grade Steel Reinforcement Bar"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Detailed Description</label>
              <textarea 
                rows={4}
                required
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-medium outline-none focus:ring-2 focus:ring-[#06392F] resize-none"
                placeholder="Specify dimensions, material composition, and usage instructions..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Pricing (KES)</label>
              <input 
                type="number" required
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-black outline-none focus:ring-2 focus:ring-[#06392F]"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Stock Level</label>
              <input 
                type="number" required
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-black outline-none focus:ring-2 focus:ring-[#06392F]"
                placeholder="100"
                value={formData.stock_quantity}
                onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Classification</label>
              <select 
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-black uppercase outline-none focus:ring-2 focus:ring-[#06392F] appearance-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Construction">Construction</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Tools">Tools</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1 tracking-widest">Internal SKU</label>
              <input 
                required
                className="w-full px-6 py-4 bg-slate-50/50 rounded-2xl border-none text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-[#06392F]"
                placeholder="ASH-STEEL-001"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}