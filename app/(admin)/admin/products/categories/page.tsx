'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Save
} from 'lucide-react';

// Define Category Type
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  // 1. Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    // FIX: Added (supabase as any) to bypass strict build-time type checking
    const { data, error } = await (supabase as any)
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } else {
      // Transform data to ensure description is never null
      const formattedCategories = (data || []).map((category: any) => ({
        ...category,
        description: category.description || '', // Convert null to empty string
      }));
      setCategories(formattedCategories);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. Handle Add Category
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Auto-generate slug (e.g. "Roofing Tiles" -> "roofing-tiles")
    const slug = newCategory.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // FIX: Added (supabase as any) here as well
    const { error } = await (supabase as any)
      .from('categories')
      .insert([{
        name: newCategory.name,
        description: newCategory.description,
        slug: slug
      }]);

    if (error) {
      alert('Error adding category (Name might be duplicate): ' + error.message);
    } else {
      setNewCategory({ name: '', description: '' }); // Reset form
      setIsAdding(false); // Close the form
      fetchCategories(); // Refresh list
    }
    setSubmitting(false);
  };

  // 3. Handle Delete Category
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? If products use this category, they might lose their categorization.')) return;

    // FIX: Added (supabase as any) here as well
    const { error } = await (supabase as any)
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      // Optimistic update: remove from list immediately
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800 uppercase">Product Categories</h1>
          <p className="mt-1 text-xs font-medium tracking-widest text-gray-400 uppercase">Organize your inventory for the shop filters</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#06392F] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add Category</>}
        </button>
      </div>

      {/* ADD CATEGORY FORM */}
      {isAdding && (
        <div className="p-8 border border-gray-100 shadow-xl bg-white rounded-[2rem] animate-in slide-in-from-top-4 duration-300">
           <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#06392F] mb-6 flex items-center gap-2">
             <Tag size={16} /> New Category Details
           </h3>
           <form onSubmit={handleAdd} className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Roofing Materials"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#06392F]/5 outline-none font-bold text-sm transition-all"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Short description for SEO..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#06392F]/5 outline-none font-bold text-sm transition-all"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
             </div>
             <div className="flex justify-end pt-4 md:col-span-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#3CB64C] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-green-200"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Category
                </button>
             </div>
           </form>
        </div>
      )}

      {/* CATEGORY LIST TABLE */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-[2.5rem]">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Tag size={16} className="text-[#C75B39]" /> Existing Categories
          </h3>
        </div>

        {loading ? (
           <div className="flex flex-col items-center gap-4 p-20 text-center">
              <Loader2 className="animate-spin text-[#06392F]" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing...</p>
           </div>
        ) : categories.length === 0 ? (
           <div className="p-20 m-8 text-center text-gray-400 border-2 border-gray-100 border-dashed rounded-[2rem]">
             <p className="text-[10px] font-black uppercase tracking-widest">No categories found. Click "Add Category" to start.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-50">
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5">Slug / URL</th>
                  <th className="px-8 py-5">Description</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-gray-50/50 group">
                    <td className="px-8 py-5 font-black text-[#06392F] uppercase tracking-tight text-sm">
                      {cat.name}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 font-mono text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-full">
                        /{cat.slug}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                      {cat.description || <span className="italic text-gray-300">No description provided</span>}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-3 text-gray-300 transition-all rounded-xl hover:text-red-600 hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tip Box */}
      <div className="flex items-start gap-4 p-6 border border-blue-100 rounded-[2rem] bg-blue-50/50">
         <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
         <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Pro Tip</p>
            <p className="text-sm font-medium leading-relaxed text-blue-800">
              These categories are used in the main shop filters. Keep names simple (e.g., "Materials", "Plans") so customers can find assets quickly.
            </p>
         </div>
      </div>
    </div>
  );
}