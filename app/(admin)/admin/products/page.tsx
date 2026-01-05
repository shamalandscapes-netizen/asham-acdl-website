'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, Package, Loader2, X, Upload, List
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

const CATEGORIES = [
  "Cement & Binders",
  "Steel & Reinforcement",
  "Roofing Materials",
  "Finishes & Paints",
  "Plumbing & Water",
  "Digital Plans",
  "Furniture"
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    gallery: [] as string[],
    features: '',
    is_digital: false,
    file_path: '',
    stock: '0',
  });

  const supabase = createClient();

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }

      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...uploadedUrls] }));
      } else {
        setFormData(prev => ({ ...prev, image_url: uploadedUrls[0] }));
      }
    } catch (error: any) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(Boolean);
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url || null,
        gallery: formData.gallery,
        features: featuresArray,
        is_digital: formData.is_digital,
        file_path: formData.file_path || null,
        stock: parseInt(formData.stock),
        stock_quantity: parseInt(formData.stock)
      }]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ name:'', description:'', price:'', category:'', image_url:'', gallery:[], features:'', is_digital: false, file_path:'', stock:'0' });
      fetchProducts();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#C75B39]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Inventory</h1>
        <button 
          type="button"
          title="Open product creation modal"
          onClick={() => setShowModal(true)}
          className="bg-[#06392F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {p.is_digital ? 'DIGITAL' : `${p.stock} UNIT(S)`}
                   </span>
                </td>
                <td className="px-6 py-4 text-right font-black">KES {p.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-white border-b flex items-center justify-between">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">New Catalog Entry</h2>
              <button type="button" title="Close modal" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6">
              {/* Image Inputs */}
              <div className="col-span-2 flex gap-6">
                <div className="flex-1">
                  <label htmlFor="main-img" className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Main Thumbnail</label>
                  <div className="relative h-32 bg-gray-50 border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden group">
                    {formData.image_url ? <Image src={formData.image_url} alt="" fill className="object-cover" /> : <Upload className="text-gray-300" />}
                    <input id="main-img" type="file" title="Upload main product image" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e)} />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="gal-img" className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Gallery ({formData.gallery.length})</label>
                  <div className="relative h-32 bg-gray-50 border-2 border-dashed rounded-2xl flex items-center justify-center">
                    <Plus className="text-gray-300" />
                    <input id="gal-img" type="file" multiple title="Upload gallery images" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, true)} />
                  </div>
                </div>
              </div>

              {/* Standard Fields */}
              <div className="col-span-2">
                <label htmlFor="p-name" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Product Name</label>
                <input id="p-name" required placeholder="e.g. Bamburi Portland Cement" title="Enter product name" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#C75B39] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="p-cat" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Category</label>
                <select id="p-cat" required title="Select category" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="p-price" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Price (KES)</label>
                <input id="p-price" required type="number" placeholder="0.00" title="Enter price" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label htmlFor="p-features" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Features (Comma Separated)</label>
                <input id="p-features" placeholder="e.g. UV Resistant, High Tensile, 50kg" title="Enter features" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label htmlFor="p-desc" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Full Description</label>
                <textarea id="p-desc" placeholder="Enter product details..." title="Enter description" rows={3} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="col-span-1">
                <label htmlFor="p-stock" className="text-[10px] font-black uppercase text-gray-400 mb-1 block tracking-widest">Stock Count</label>
                <input id="p-stock" type="number" title="Enter stock count" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>

              <div className="col-span-1 flex items-center gap-3 pt-6">
                <input id="p-digi" type="checkbox" title="Is this a digital product?" className="h-5 w-5 rounded text-[#C75B39]" checked={formData.is_digital} onChange={e => setFormData({...formData, is_digital: e.target.checked})} />
                <label htmlFor="p-digi" className="text-sm font-bold text-gray-700">Digital Asset</label>
              </div>

              <div className="col-span-2 pt-6 border-t flex gap-4">
                <button type="button" title="Cancel creation" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest text-gray-400 border rounded-2xl hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" title="Publish product" disabled={isSubmitting || uploading} className="flex-1 py-4 bg-[#06392F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:-translate-y-1 disabled:opacity-50 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}