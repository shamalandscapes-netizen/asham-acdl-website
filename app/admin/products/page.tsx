'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, Package, Loader2, X, Upload, List, Trash2, Edit3, Search, ImageIcon, AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
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
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
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
      toast.success("Image uploaded to cloud");
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      image_url: product.image_url || '',
      gallery: product.gallery || [],
      features: product.features ? product.features.join(', ') : '',
      is_digital: product.is_digital || false,
      file_path: product.file_path || '',
      stock: (product.stock_quantity || product.stock || 0).toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this item from the public catalog?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(Boolean);
      
      // Creating a clean payload to satisfy strict TS and DB constraints
      const payload: any = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url || null,
        gallery: formData.gallery,
        features: featuresArray,
        is_digital: formData.is_digital,
        file_path: formData.file_path || null,
        stock_quantity: parseInt(formData.stock),
        stock: parseInt(formData.stock),
        slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };

      let error;
      if (editingId) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', editingId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(editingId ? "Update synced" : "Listing published");
      setShowModal(false);
      setEditingId(null);
      setFormData({ name:'', description:'', price:'', category:'', image_url:'', gallery:[], features:'', is_digital: false, file_path:'', stock:'0' });
      fetchProducts();
    } catch (err: any) {
      toast.error(`Database Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Synchronizing Catalog...</p>
    </div>
  );

  return (
    <div className="p-6 mx-auto space-y-8 duration-700 max-w-7xl animate-in fade-in">
      
      {/* Action Bar */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl italic font-black tracking-tighter text-gray-900 uppercase">Inventory</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Material Assets & Digital Plans</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#06392F] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#06392F]/5 transition-all text-sm w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => { setEditingId(null); setShowModal(true); }}
            className="bg-[#06392F] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#06392F]/20 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={18} /> New Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50/50 border-gray-50">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price (KES)</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-gray-50/30 group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 overflow-hidden bg-gray-100 border border-gray-100 rounded-xl">
                      {p.image_url ? <Image src={p.image_url} alt="" fill className="object-cover" /> : <ImageIcon className="m-auto mt-3 text-gray-300" size={20} />}
                    </div>
                    <div>
                       <p className="font-black tracking-tight text-gray-900 uppercase">{p.name}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase">{p.is_digital ? 'Digital Asset' : 'Physical Good'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <span className="text-[9px] font-black uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full tracking-widest">{p.category}</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.stock_quantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-bold text-gray-600">
                        {p.is_digital ? '∞' : `${p.stock_quantity || 0} Units`}
                      </span>
                   </div>
                </td>
                <td className="px-8 py-5 font-black text-right text-gray-900">
                  {p.price.toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleEdit(p)} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-[#06392F] transition-all"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2.5 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-10 py-8 bg-white border-b">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#06392F]">
                  {editingId ? 'Modify Inventory' : 'New Catalog Entry'}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ensure all pricing reflects current market rates</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 transition-colors rounded-full hover:bg-gray-100"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8 p-10 overflow-y-auto">
              {/* Media Section */}
              <div className="grid grid-cols-2 col-span-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Display Image</label>
                  <div className="relative h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-[#06392F]/30 transition-colors group">
                    {formData.image_url ? (
                      <Image src={formData.image_url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 text-gray-300" size={32} />
                        <p className="text-[9px] font-black text-gray-400 uppercase">Click to Upload</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e)} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Gallery Preview ({formData.gallery.length})</label>
                  <div className="h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-4 flex gap-3 overflow-x-auto items-center">
                    {formData.gallery.map((url, i) => (
                      <div key={i} className="relative flex-shrink-0 w-32 h-32 overflow-hidden border shadow-sm rounded-2xl group">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))}
                          className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="w-32 h-32 flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-white transition-all hover:border-[#06392F]/30">
                      <Plus className="text-gray-300" />
                      <input type="file" multiple className="hidden" onChange={e => handleImageUpload(e, true)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Fields */}
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Material Name</label>
                <input required className="w-full px-6 py-4 bg-gray-50 border-gray-100 border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#06392F]/5 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Market Category</label>
                <select required className="w-full px-6 py-4 text-sm font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Global Price (KES)</label>
                <input required type="number" className="w-full px-6 py-4 text-sm font-black border border-gray-100 outline-none bg-gray-50 rounded-2xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Unique Selling Features (Comma Separated)</label>
                <input placeholder="e.g. UV Protected, High Tensile, 50-Year Warranty" className="w-full px-6 py-4 text-sm font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Technical Description</label>
                <textarea rows={4} className="w-full px-6 py-4 text-sm font-medium border border-gray-100 outline-none bg-gray-50 rounded-2xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="col-span-1">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Initial Stock Balance</label>
                <input type="number" className="w-full px-6 py-4 text-sm font-bold border border-gray-100 bg-gray-50 rounded-2xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>

              <div className="flex items-center col-span-1 gap-4 pt-6">
                <input id="is_digital" type="checkbox" className="w-6 h-6 rounded-lg text-[#06392F] cursor-pointer" checked={formData.is_digital} onChange={e => setFormData({...formData, is_digital: e.target.checked})} />
                <label htmlFor="is_digital" className="text-sm font-black tracking-tight text-gray-700 uppercase cursor-pointer">Digital Asset / Plan</label>
              </div>

              {/* Action Buttons */}
              <div className="flex col-span-2 gap-6 pt-10 border-t">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-5 font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 border border-gray-100 rounded-[2rem] hover:bg-gray-50 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || uploading} 
                  className="flex-1 py-5 bg-[#06392F] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-[#06392F]/20 hover:-translate-y-1 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="mx-auto animate-spin" size={18} /> : (editingId ? 'Update Material' : 'Publish Listing')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}