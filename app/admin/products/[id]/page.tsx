'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Loader2, ImageIcon, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

// interface for our local component state
interface ProductFormState {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  status: string;
  featured_image_url: string;
  image_url: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  
  // Ensure ID is treated as a string even if Next.js thinks it's an array
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormState>({
    name: '',
    slug: '',
    sku: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category: 'General',
    status: 'draft',
    featured_image_url: '',
    image_url: ''
  });

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      // We use 'as any' here because the local types might be out of sync 
      // with the actual columns in your DB (slug, sku, etc.)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error("Fetch error:", error);
        router.push('/admin/products');
        return;
      }

      if (data) {
        const product = data as any; // Bypass TS check for missing properties
        
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          sku: product.sku || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          stock_quantity: product.stock_quantity || 0,
          category: product.category || 'General',
          status: product.status || 'draft',
          featured_image_url: product.featured_image_url || '',
          image_url: product.image_url || ''
        });
        
        // Show existing image in the preview box
        setPreviewUrl(product.featured_image_url || product.image_url || null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [productId, supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // We cast the payload 'as any' so Supabase doesn't block the extra columns (sku, slug, status)
    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        description: formData.description,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
        category: formData.category,
        status: formData.status,
        featured_image_url: formData.featured_image_url,
        image_url: formData.image_url
      } as any)
      .eq('id', productId);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      router.push('/admin/products');
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl p-6 mx-auto space-y-8 duration-500 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="flex items-center text-gray-500 hover:text-gray-900 font-bold text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Products
        </button>
        <div className="text-right">
            <h1 className="text-2xl font-black leading-none text-gray-900">Edit Inventory</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-tighter">ID: {productId}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Main Content Area */}
          <div className="p-8 space-y-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Product Name</label>
              <input 
                required
                type="text"
                value={formData.name}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#06392F]"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Slug (URL)</label>
                    <input 
                        required
                        type="text"
                        value={formData.slug}
                        className="w-full p-4 text-gray-500 bg-gray-100 border border-gray-100 outline-none rounded-2xl"
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">SKU Code</label>
                    <input 
                        type="text"
                        value={formData.sku}
                        className="w-full p-4 border border-gray-100 outline-none bg-gray-50 rounded-2xl"
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    />
                </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description</label>
              <textarea 
                rows={6}
                value={formData.description}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#06392F]"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="grid grid-cols-2 gap-6 p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Price (KES)</label>
              <input 
                required
                type="number"
                value={formData.price}
                className="w-full p-4 font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl"
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Inventory Qty</label>
              <input 
                required
                type="number"
                value={formData.stock_quantity}
                className="w-full p-4 font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl"
                onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <h2 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Current Photo</h2>
            <div className="flex items-center justify-center overflow-hidden border border-gray-100 aspect-square rounded-2xl bg-gray-50">
              {previewUrl ? (
                <img src={previewUrl} className="object-cover w-full h-full" alt="Product" />
              ) : (
                <ImageIcon className="text-gray-200" size={48} />
              )}
            </div>
          </div>

          <div className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
             <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Status</label>
             <select 
                value={formData.status}
                className="w-full p-4 text-sm font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
          </div>

          <Button 
            type="submit" 
            className="w-full py-5 bg-[#C75B39] hover:bg-[#A64A2E] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all" 
            isLoading={saving}
          >
            <RefreshCcw className="mr-2" size={18} /> Update Data
          </Button>
        </div>
      </form>
    </div>
  );
}