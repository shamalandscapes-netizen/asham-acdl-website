'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Loader2, 
  Package, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';

// Define Product Interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'physical' | 'digital';
  stock: number;
  image_url: string;
  file_path?: string; // For digital items
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Product | null>(null);

  // 1. Fetch Product Data on Load
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        alert('Product not found or deleted.');
        router.push('/admin/products');
      } else {
        setFormData(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id, router, supabase]);

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: formData.type === 'physical' ? Number(formData.stock) : 0, // Reset stock if digital
          image_url: formData.image_url,
          // We generally don't change 'type' after creation to avoid breaking file links
        })
        .eq('id', formData.id);

      if (error) throw error;
      
      alert('Product updated successfully!');
      router.push('/admin/products');
      router.refresh();

    } catch (error: any) {
      alert('Error updating product: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to DELETE this product? This cannot be undone.')) return;
    setDeleting(true);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      alert('Failed to delete: ' + error.message);
      setDeleting(false);
    } else {
      router.push('/admin/products');
      router.refresh();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center text-gray-500 h-96">
      <Loader2 className="mr-2 animate-spin" /> Loading Product Details...
    </div>
  );

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-[#06392F] transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Cancel & Go Back
        </button>

        <button 
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 font-bold text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
          Delete Product
        </button>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Edit Product: {formData.name}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${
             formData.type === 'physical' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
          }`}>
             {formData.type === 'physical' ? <Package size={14} /> : <FileText size={14} />}
             {formData.type} Product
          </span>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          
          {/* --- BASIC INFO --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
              <input 
                type="text" 
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C75B39] outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
              <select 
                className="w-full p-3 bg-white border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Materials">Construction Materials</option>
                <option value="Plans">Architectural Plans</option>
                <option value="Tools">Tools & Equipment</option>
                <option value="Finishes">Paints & Finishes</option>
              </select>
            </div>
          </div>

          {/* --- DESCRIPTION --- */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
            <textarea 
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#C75B39] outline-none"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* --- PRICING & STOCK --- */}
          <div className="grid grid-cols-1 gap-6 p-6 border border-gray-100 md:grid-cols-3 bg-gray-50 rounded-xl">
             
             {/* Price */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Price (KES)</label>
                <div className="relative">
                   <span className="absolute font-bold text-gray-400 -translate-y-1/2 left-3 top-1/2">KES</span>
                   <input 
                     type="number" 
                     required
                     min="0"
                     className="w-full p-3 pl-12 border rounded-lg"
                     value={formData.price}
                     onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                   />
                </div>
             </div>

             {/* Stock (Only visible for Physical) */}
             {formData.type === 'physical' && (
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full p-3 border rounded-lg"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
               </div>
             )}

            {/* Read Only Type Display */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Product Type</label>
                <input 
                  type="text" 
                  disabled
                  value={formData.type.toUpperCase()}
                  className="w-full p-3 text-gray-500 bg-gray-200 border rounded-lg cursor-not-allowed"
                />
             </div>
          </div>

          {/* --- IMAGE URL --- */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
              <ImageIcon size={14} /> Product Image URL
            </label>
            <input 
              type="url" 
              placeholder="https://..."
              className="w-full p-3 border rounded-lg"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
            <p className="text-xs text-gray-400">
               Tip: Upload image to Supabase Storage first, then paste the public link here.
            </p>
          </div>

          {/* --- SUBMIT --- */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[#06392F] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0A4D40] transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Saving Changes...' : 'Update Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}