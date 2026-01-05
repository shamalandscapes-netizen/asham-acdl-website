'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, Upload, Save, FileText, 
  Loader2, AlertCircle, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Materials',
    is_digital: false,
    stock_quantity: '0',
    image_url: '',
    file_path: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        setError("Product not found.");
      } else if (data) {
        const p = data as any;
        setFormData({
          name: p.name,
          description: p.description || '',
          price: p.price.toString(),
          category: p.category || 'Materials',
          is_digital: p.is_digital || false,
          stock_quantity: (p.stock_quantity || 0).toString(),
          image_url: p.image_url || '',
          file_path: p.file_path || ''
        });
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, supabase]);

  const handleUpload = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `edit-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

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
    setError(null);

    try {
      let updatedImageUrl = formData.image_url;
      let updatedFilePath = formData.file_path;

      if (imageFile) updatedImageUrl = await handleUpload(imageFile, 'product-images');
      if (formData.is_digital && blueprintFile) updatedFilePath = await handleUpload(blueprintFile, 'blueprints');

      const { error: dbError } = await supabase.from('products').update({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        is_digital: formData.is_digital,
        stock_quantity: parseInt(formData.stock_quantity),
        image_url: updatedImageUrl,
        file_path: updatedFilePath
      }).eq('id', id);

      if (dbError) throw dbError;
      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#06392F]" size={40} /></div>;

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500">
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="text-3xl font-black text-gray-900">Edit Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-8 space-y-5 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div>
              <label htmlFor="name" className="block mb-2 text-xs font-black text-gray-400 uppercase">Name</label>
              <input id="name" required type="text" className="w-full p-4 border border-gray-100 bg-gray-50 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label htmlFor="desc" className="block mb-2 text-xs font-black text-gray-400 uppercase">Description</label>
              <textarea id="desc" rows={4} className="w-full p-4 border border-gray-100 bg-gray-50 rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          {formData.is_digital && (
            <div className="p-8 space-y-4 border border-indigo-100 bg-indigo-50 rounded-3xl">
              <label htmlFor="blueprint" className="flex items-center gap-3 font-bold text-indigo-700"><FileText size={24} /> Blueprint</label>
              <input id="blueprint" type="file" onChange={e => setBlueprintFile(e.target.files?.[0] || null)} className="w-full" />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <label htmlFor="image" className="block mb-4 text-xs font-black text-gray-400">Image</label>
            <div className="relative flex items-center justify-center h-32 border-2 border-dashed rounded-2xl bg-gray-50">
               {formData.image_url && !imageFile && <img src={formData.image_url} className="absolute inset-0 object-cover w-full h-full opacity-20" alt="Current" />}
               <input id="image" type="file" className="absolute inset-0 z-10 opacity-0 cursor-pointer" onChange={e => setImageFile(e.target.files?.[0] || null)} />
               <Upload className="text-gray-300" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="w-full py-4 rounded-2xl bg-[#06392F] text-white font-bold">
            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />} Update
          </button>
        </div>
      </form>
    </div>
  );
}