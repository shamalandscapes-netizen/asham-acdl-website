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
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
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
    // This creates a URL-friendly version of the name
    const slug = newCategory.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const { error } = await supabase
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

    const { error } = await supabase
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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
          <p className="text-gray-500">Organize your inventory into specific groups for the shop filters.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#06392F] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#0A4D40] transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus size={18} /> Add Category</>}
        </button>
      </div>

      {/* ADD CATEGORY FORM (Conditionally Rendered) */}
      {isAdding && (
        <div className="p-6 border border-green-100 shadow-inner bg-green-50 rounded-xl animate-fade-in-up">
           <h3 className="font-bold text-[#06392F] mb-4 flex items-center gap-2">
             <Tag size={18} /> New Category Details
           </h3>
           <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500 uppercase">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Roofing Materials"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3CB64C] outline-none"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-500 uppercase">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Short description for SEO..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#3CB64C] outline-none"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end md:col-span-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-[#3CB64C] text-white px-6 py-2 rounded font-bold hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-all shadow-sm"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Category
                </button>
              </div>
           </form>
        </div>
      )}

      {/* CATEGORY LIST TABLE */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="flex items-center gap-2 font-bold text-gray-800">
            <Tag size={18} className="text-[#C75B39]" /> Existing Categories
          </h3>
        </div>

        {loading ? (
           <div className="flex flex-col items-center gap-2 p-12 text-center text-gray-500">
              <Loader2 className="animate-spin text-[#06392F]" size={24} />
              Loading categories...
           </div>
        ) : categories.length === 0 ? (
           <div className="p-12 m-4 text-center text-gray-400 border-2 border-gray-100 border-dashed rounded-lg">
              No categories found. Click "Add Category" to start.
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 bg-white border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug / URL</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition-colors hover:bg-gray-50 group">
                    
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-[#06392F]">
                      {cat.name}
                    </td>

                    {/* Slug (Fixed styling) */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 font-mono text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-gray-600">
                      {cat.description || <span className="italic text-gray-300">No description</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
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
      <div className="flex items-start gap-3 p-4 border border-blue-100 rounded-lg bg-blue-50">
         <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
         <div className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> These categories are used in the main shop filters. Keep the names simple (e.g., "Materials", "Plans") so customers can easily find what they are looking for.
         </div>
      </div>
    </div>
  );
}