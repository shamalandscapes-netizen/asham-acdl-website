'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Upload, Save, FileText, 
  Loader2, AlertCircle, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Materials',
    is_digital: false,
    stock_quantity: '0',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);

  const handleUpload = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    // SAFE FILENAME: Prevents 400 error by adding a text prefix and timestamp
    const fileName = `prod-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) throw new Error(`${bucket}: ${uploadError.message}`);
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let image_url = null;
      let file_path = null;

      if (imageFile) image_url = await handleUpload(imageFile, 'product-images');
      if (formData.is_digital && blueprintFile) {
        file_path = await handleUpload(blueprintFile, 'blueprints');
      }

      const { error: dbError } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_digital: formData.is_digital,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url,
        file_path
      }]);

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#06392F]">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <h1 className="text-3xl font-black tracking-tight text-gray-900">Add New Product</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-8 space-y-5 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div>
              <label htmlFor="name" className="block mb-2 text-xs font-black text-gray-400 uppercase">Product Name</label>
              <input id="name" required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#06392F]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label htmlFor="desc" className="block mb-2 text-xs font-black text-gray-400 uppercase">Description</label>
              <textarea id="desc" rows={4} className="w-full p-4 border border-gray-100 outline-none bg-gray-50 rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block mb-2 text-xs font-black text-gray-400 uppercase">Price (KES)</label>
                <input id="price" required type="number" className="w-full p-4 border border-gray-100 bg-gray-50 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label htmlFor="cat" className="block mb-2 text-xs font-black text-gray-400 uppercase">Category</label>
                <select id="cat" className="w-full p-4 border border-gray-100 bg-gray-50 rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Materials</option>
                  <option>Architectural Plans</option>
                  <option>Interior Designs</option>
                </select>
              </div>
            </div>
          </div>

          {formData.is_digital && (
            <div className="p-8 space-y-4 border border-indigo-100 bg-indigo-50 rounded-3xl">
              <label htmlFor="blueprint" className="flex items-center gap-3 font-bold text-indigo-700 cursor-pointer"><FileText size={24} /> Upload Blueprint</label>
              <input id="blueprint" type="file" required={formData.is_digital} accept=".pdf,.zip" onChange={e => setBlueprintFile(e.target.files?.[0] || null)} className="w-full" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div>
              <label htmlFor="image" className="block mb-4 text-xs font-black text-gray-400 uppercase">Product Image</label>
              <input id="image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <label htmlFor="digital" className="text-sm font-bold">Digital Product</label>
              <input id="digital" type="checkbox" checked={formData.is_digital} onChange={e => setFormData({...formData, is_digital: e.target.checked})} className="w-5 h-5 accent-[#06392F]" />
            </div>
            {!formData.is_digital && (
              <div>
                <label htmlFor="stock" className="block mb-2 text-xs font-black text-gray-400 uppercase">Stock</label>
                <input id="stock" type="number" className="w-full p-3 rounded-lg bg-gray-50" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
              </div>
            )}
          </div>

          {error && <div className="flex gap-2 p-4 text-sm font-bold text-red-700 bg-red-50 rounded-xl"><AlertCircle size={18}/>{error}</div>}
          {success && <div className="flex gap-2 p-4 text-sm font-bold text-green-700 bg-green-50 rounded-xl"><CheckCircle size={18}/>Created!</div>}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-[#06392F] text-white font-bold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Create Product
          </button>
        </div>
      </form>
    </div>
  );
}