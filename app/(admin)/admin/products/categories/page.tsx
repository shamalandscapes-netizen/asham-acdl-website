'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Save,
  Edit2,
  X,
  Check,
  ChevronRight,
  FolderOpen,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

// Define Category Type matching your database schema
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number | null;
  meta_title: string | null;
  meta_description: string | null;
  color: string | null;
  icon: string | null;
  created_at: string | null;
  updated_at: string | null;
  product_count?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '', 
    description: '', 
    is_active: true,
    meta_title: '',
    meta_description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  // 1. Fetch Categories with product counts
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          if (countError) console.error('Error counting products:', countError);
          
          return {
            ...category,
            description: category.description || '',
            meta_title: category.meta_title || '',
            meta_description: category.meta_description || '',
            product_count: count || 0
          } as Category;
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Handle Add Category
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Auto-generate slug
      const slug = newCategory.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Auto-generate meta title if not provided
      const meta_title = newCategory.meta_title || 
        `${newCategory.name} | Construction Materials | Buy Online`;

      // Auto-generate meta description if not provided
      const meta_description = newCategory.meta_description ||
        `Buy ${newCategory.name} at best prices. Quality construction materials with warranty. Free delivery available in Kenya.`;

      const { error } = await supabase
        .from('product_categories')
        .insert([{
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || null,
          slug: slug,
          is_active: newCategory.is_active,
          meta_title: meta_title,
          meta_description: meta_description,
          sort_order: categories.length, // Add at the end
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('Category added successfully!');
      setNewCategory({ 
        name: '', 
        description: '', 
        is_active: true,
        meta_title: '',
        meta_description: ''
      });
      setIsAdding(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(error.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle Delete Category
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Products in this category will need to be reassigned.`)) return;

    setDeletingId(id);
    try {
      // Check if category has products
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (countError) throw countError;

      if (count && count > 0) {
        const reassign = confirm(
          `This category has ${count} product(s). Deleting it will remove category assignment from these products. Continue?`
        );
        if (!reassign) return;
      }

      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Category deleted successfully');
      setCategories(categories.filter(c => c.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  // 4. Handle Edit Category
  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active ?? true,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || ''
    });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm.name?.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      // Generate slug from name if changed
      let slugUpdate = {};
      const originalCategory = categories.find(c => c.id === id);
      if (editForm.name !== originalCategory?.name) {
        slugUpdate = {
          slug: editForm.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        };
      }

      const { error } = await supabase
        .from('product_categories')
        .update({
          ...editForm,
          ...slugUpdate,
          description: editForm.description?.trim() || null,
          meta_title: editForm.meta_title?.trim() || null,
          meta_description: editForm.meta_description?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Category updated successfully');
      setEditingId(null);
      setEditForm({});
      fetchCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // 5. Toggle Active Status
  const toggleActiveStatus = async (id: string, currentStatus: boolean | null) => {
    const newStatus = !(currentStatus ?? true);
    
    try {
      const { error } = await supabase
        .from('product_categories')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, is_active: newStatus } : cat
      ));
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b shadow-sm bg-white/90 backdrop-blur-xl border-slate-200">
        <div className="flex flex-col gap-6 p-6 mx-auto max-w-7xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 hover:text-emerald-600"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Products
            </Link>
            <div className="w-px h-6 bg-slate-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Product Categories</h1>
              <p className="text-sm text-slate-500">Organize your inventory with categories</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Category
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Search and Filters */}
        <div className="p-6 mb-8 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories by name, description, or slug..."
                  className="w-full py-3 pl-12 pr-4 bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                {filteredCategories.length} of {categories.length} categories
              </span>
              <button className="flex items-center gap-2 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:border-slate-400">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Add Category Form */}
        {isAdding && (
          <div className="p-6 mb-8 duration-300 bg-white border shadow-sm rounded-2xl border-slate-200 animate-in slide-in-from-top-4">
            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-slate-900">
              <Plus className="w-5 h-5 text-emerald-600" />
              Add New Category
            </h2>
            
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Roofing Materials"
                    className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNewCategory({...newCategory, is_active: true})}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${newCategory.is_active ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'}`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCategory({...newCategory, is_active: false})}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${!newCategory.is_active ? 'bg-slate-100 text-slate-700 border border-slate-300' : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'}`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description for SEO and internal reference..."
                  className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated from name"
                    className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={newCategory.meta_title}
                    onChange={(e) => setNewCategory({...newCategory, meta_title: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-slate-500">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Auto-generated from description"
                    className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    value={newCategory.meta_description}
                    onChange={(e) => setNewCategory({...newCategory, meta_description: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-slate-500">Recommended: 150-160 characters</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:border-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newCategory.name.trim()}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Create Category
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FolderOpen className="w-5 h-5 text-emerald-600" />
              All Categories
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:border-slate-400">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:border-slate-400">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
              <p className="text-slate-600">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed rounded-xl border-slate-200">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">No categories found</p>
              <p className="mt-1 text-sm text-slate-500">
                {searchQuery ? 'Try a different search term' : 'Start by adding your first category'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50 border-slate-200">
                    <th className="px-6 py-4 text-sm font-medium text-left text-slate-700">Category</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-slate-700">Products</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-slate-700">Status</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-slate-700">Last Updated</th>
                    <th className="px-6 py-4 text-sm font-medium text-left text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm bg-white border rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            />
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span className="font-mono">/{category.slug}</span>
                              {editForm.name !== category.name && (
                                <span className="text-xs text-amber-600">(Slug will be regenerated)</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-slate-900">{category.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-sm text-slate-500">/{category.slug}</span>
                              {category.parent_id && (
                                <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                                  Sub-category
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products?category=${category.id}`}
                          className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-800"
                        >
                          {category.product_count || 0} products
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                      
                      <td className="px-6 py-4">
                        {editingId === category.id ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditForm({...editForm, is_active: true})}
                              className={`px-3 py-1.5 text-xs font-medium rounded ${editForm.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                            >
                              Active
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditForm({...editForm, is_active: false})}
                              className={`px-3 py-1.5 text-xs font-medium rounded ${editForm.is_active === false ? 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600'}`}
                            >
                              Inactive
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleActiveStatus(category.id, category.is_active)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {(category.is_active ?? true) ? (
                              <>
                                <Eye className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </button>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(category.updated_at)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingId === category.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(category.id)}
                                className="p-2 transition-colors rounded-lg text-emerald-600 hover:bg-emerald-50"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-2 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id, category.name)}
                                disabled={deletingId === category.id}
                                className="p-2 transition-colors rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === category.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Showing {filteredCategories.length} of {categories.length} categories
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600">
                    {categories.filter(c => c.is_active).length} active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-slate-600">
                    {categories.filter(c => !c.is_active).length} inactive
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-600">
                    {categories.reduce((acc, c) => acc + (c.product_count || 0), 0)} total products
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips & Guidelines */}
        <div className="p-6 mt-8 border shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-emerald-200">
          <h3 className="flex items-center gap-2 mb-4 font-bold text-emerald-900">
            <AlertCircle className="w-5 h-5" />
            Category Management Tips
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-2 text-sm font-medium text-emerald-800">Best Practices</h4>
              <ul className="space-y-1 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Keep category names short and descriptive</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Use consistent naming conventions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Add SEO descriptions for better search visibility</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-emerald-800">SEO Guidelines</h4>
              <ul className="space-y-1 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Meta titles: 50-60 characters optimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Meta descriptions: 150-160 characters optimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Include location keywords (Kenya, Nairobi)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-emerald-800">Management</h4>
              <ul className="space-y-1 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Deactivate instead of deleting when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Reassign products before deleting categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 mt-2 rounded-full bg-emerald-500"></div>
                  <span>Regularly review and update categories</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}