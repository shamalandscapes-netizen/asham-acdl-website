'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Plus, Package, Loader2, X, Upload, List, Trash2, Edit3, 
  Search, ImageIcon, AlertCircle, ExternalLink, Box, Layers,
  ChevronRight, Filter, ChevronLeft, MoreVertical, Grid, 
  Star, Tag, Hash, Globe, Calendar, DollarSign, Package2,
  BarChart3, CheckCircle, XCircle, AlertTriangle, Info,
  FolderOpen,
  FolderTree,
  Eye
} from 'lucide-react';
import { createClient } from '@/supabase/client';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/supabase';

// Use the proper type from your supabase.ts
type Product = Tables<'products'>;

const CATEGORIES = [
  "Cement & Binders", "Steel & Reinforcement", "Roofing Materials",
  "Finishes & Paints", "Plumbing & Water", "Digital Plans", "Furniture"
] as const;

type StockStatus = {
  label: string;
  dot: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
};

type ViewMode = 'list' | 'grid';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = viewMode === 'list' ? 12 : 9;

  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getStockStatus = useCallback((stock: number | null, isDigital: boolean | null): StockStatus => {
    const stockValue = stock || 0;
    
    if (isDigital) return { 
      label: 'Digital Product', 
      dot: 'bg-blue-500', 
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      icon: <Globe className="w-3 h-3" />
    };
    
    if (stockValue <= 0) return { 
      label: 'Out of Stock', 
      dot: 'bg-rose-500', 
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      icon: <XCircle className="w-3 h-3" />
    };
    
    if (stockValue < 5) return { 
      label: `Critical (${stockValue})`, 
      dot: 'bg-red-500', 
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: <AlertTriangle className="w-3 h-3" />
    };
    
    if (stockValue < 10) return { 
      label: `Low Stock (${stockValue})`, 
      dot: 'bg-amber-500', 
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      icon: <AlertTriangle className="w-3 h-3" />
    };
    
    return { 
      label: `${stockValue} in Stock`, 
      dot: 'bg-emerald-500', 
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      icon: <CheckCircle className="w-3 h-3" />
    };
  }, []);

  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'stock':
          aValue = a.stock_quantity || 0;
          bValue = b.stock_quantity || 0;
          break;
        case 'date':
          aValue = new Date(a.created_at || '').getTime();
          bValue = new Date(b.created_at || '').getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleViewProduct = (product: Product) => {
    // Navigate to the individual product page
    router.push(`/admin/products/${product.id}`);
  };

  const handleEditProduct = (productId: string) => {
    // Navigate to edit page (you might want to create an edit page)
    router.push(`/admin/products/${productId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#06392f] rounded-full animate-spin"></div>
            <Package className="absolute inset-0 m-auto text-[#06392f]" size={24} />
          </div>
          <p className="font-medium text-slate-600">Loading inventory...</p>
          <p className="text-sm text-slate-400">Fetching your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header section */}
      <div className="sticky top-0 z-40 border-b shadow-sm bg-white/90 backdrop-blur-xl border-slate-200">
        <div className="flex flex-col gap-6 p-6 mx-auto lg:flex-row lg:items-center lg:justify-between max-w-7xl">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-[#06392f] to-[#0a4d3f] rounded-xl shadow-md">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
                    Product Inventory
                  </h1>
                  <Link 
                    href="/admin/products/categories"
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    <FolderTree className="w-3 h-3" />
                    Categories
                  </Link>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-slate-500">
                    {products.length} products • {sortedAndFilteredProducts.length} filtered
                  </p>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600">
                      {products.filter(p => (p.stock_quantity || 0) > 10).length} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 min-w-[280px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search products, SKU, brand..." 
                className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06392f]/20 focus:border-[#06392f] transition-all duration-200"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-slate-700"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 bg-white border border-slate-300 rounded-xl text-slate-600 hover:border-[#06392f] hover:text-[#06392f] transition-all duration-200 shadow-sm"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${viewMode === 'list' ? 'bg-[#06392f] text-white' : 'bg-white border border-slate-300 text-slate-600 hover:border-[#06392f]'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 shadow-sm ${viewMode === 'grid' ? 'bg-[#06392f] text-white' : 'bg-white border border-slate-300 text-slate-600 hover:border-[#06392f]'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <Link 
                href="/admin/products/new"
                className="bg-gradient-to-r from-[#06392f] to-[#0a4d3f] text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#06392f]/20 transition-all duration-200 shadow-md whitespace-nowrap"
              >
                <Plus className="w-5 h-5" /> Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="text-2xl font-bold text-slate-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-[#06392f]" />
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Stock</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {products.filter(p => (p.stock_quantity || 0) > 0).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Digital Products</p>
                <p className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.is_digital).length}
                </p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Categories</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Array.from(new Set(products.map(p => p.category).filter(Boolean))).length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filters & Sorting</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Categories</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-[#06392f] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(category => {
                    const count = products.filter(p => p.category === category).length;
                    if (count === 0) return null;
                    
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? 'bg-[#06392f] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {category} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {(['name', 'price', 'stock', 'date'] as const).map((field) => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        sortBy === field 
                          ? 'bg-[#06392f] text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortBy === field && (
                        <ChevronRight className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 mx-auto max-w-7xl">
        {sortedAndFilteredProducts.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed bg-gradient-to-br from-white to-slate-50 rounded-3xl border-slate-200">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-slate-700">
              {searchQuery || selectedCategory !== 'All' ? 'No matching products' : 'Inventory empty'}
            </h3>
            <p className="max-w-md mx-auto mb-8 text-slate-500">
              {searchQuery 
                ? `No products found for "${searchQuery}". Try a different search term.`
                : selectedCategory !== 'All'
                ? `No products found in ${selectedCategory}. Try another category.`
                : 'Get started by adding your first product to the inventory.'
              }
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowFilters(true);
                }}
                className="px-6 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:border-[#06392f] hover:text-[#06392f] transition-all"
              >
                Clear Filters
              </button>
              <Link 
                href="/admin/products/new"
                className="px-6 py-3 bg-gradient-to-r from-[#06392f] to-[#0a4d3f] rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#06392f]/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add First Product
              </Link>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <>
            <div className="overflow-hidden bg-white border shadow-lg rounded-2xl border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gradient-to-r from-slate-50 to-white border-slate-200">
                      {[
                        { key: 'name', label: 'Product Details', sortable: true },
                        { key: 'category', label: 'Category', sortable: false },
                        { key: 'stock', label: 'Stock Status', sortable: true },
                        { key: 'price', label: 'Price', sortable: true },
                        { key: 'actions', label: 'Actions', sortable: false }
                      ].map(({ key, label, sortable }) => (
                        <th 
                          key={key} 
                          className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-500"
                        >
                          <div className="flex items-center gap-1">
                            {label}
                            {sortable && (
                              <button 
                                onClick={() => handleSort(key as typeof sortBy)}
                                className="p-1 rounded hover:bg-slate-200"
                              >
                                <ChevronRight className={`w-3 h-3 ${sortBy === key ? 'text-[#06392f]' : 'text-slate-400'} ${sortBy === key && sortOrder === 'desc' ? 'rotate-90' : '-rotate-90'}`} />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedProducts.map((product) => {
                      const status = getStockStatus(
                        product.stock_quantity ?? 0, 
                        product.is_digital ?? false
                      );
                      
                      return (
                        <tr 
                          key={product.id} 
                          className="transition-all duration-200 hover:bg-slate-50/80 group"
                        >
                          <td className="px-6 py-4">
                            <div 
                              className="flex items-center gap-4 cursor-pointer"
                              onClick={() => handleViewProduct(product)}
                            >
                              <div className="relative overflow-hidden transition-transform duration-200 border w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200 group-hover:scale-105">
                                {product.image_url ? (
                                  <Image 
                                    src={product.image_url} 
                                    alt={product.name || 'Product image'}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-semibold truncate text-slate-900">
                                      {product.name || 'Unnamed Product'}
                                    </p>
                                    {product.brand && (
                                      <p className="text-xs text-slate-500 mt-0.5">by {product.brand}</p>
                                    )}
                                  </div>
                                  {product.featured && (
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                  {product.sku && (
                                    <div className="flex items-center gap-1">
                                      <Hash className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs text-slate-500">{product.sku}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs text-slate-500">
                                      {new Date(product.created_at || '').toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {product.description && (
                                  <p className="mt-2 text-sm text-slate-600 line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <Link 
                              href={`/admin/products/categories?category=${encodeURIComponent(product.category || '')}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300/50 hover:bg-slate-200 transition-colors"
                            >
                              {product.category || 'Uncategorized'}
                            </Link>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${status.bgColor}`}>
                                {status.icon}
                              </div>
                              <div>
                                <p className={`text-sm font-semibold ${status.color}`}>
                                  {status.label}
                                </p>
                                {product.safety_stock && (
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Safety: {product.safety_stock}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-slate-900">
                                KES {(product.price || 0).toLocaleString()}
                              </p>
                              {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
                                <p className="text-sm text-slate-400 line-through mt-0.5">
                                  KES {product.compare_at_price.toLocaleString()}
                                </p>
                              )}
                              {product.discount_percentage && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs font-medium mt-1">
                                  -{product.discount_percentage}%
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                              <button
                                onClick={() => handleViewProduct(product)}
                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditProduct(product.id)}
                                className="p-2.5 text-slate-400 hover:text-[#06392f] hover:bg-[#06392f]/10 rounded-xl transition-all duration-200"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={deletingId === product.id}
                                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                {deletingId === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                              <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 p-4 mt-8 bg-white border shadow-sm sm:flex-row rounded-2xl border-slate-200">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, sortedAndFilteredProducts.length)}
                  </span> of{' '}
                  <span className="font-semibold">{sortedAndFilteredProducts.length}</span> products
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-lg border border-slate-300 hover:border-[#06392f] hover:text-[#06392f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum ? 'bg-[#06392f] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-300 hover:border-[#06392f]'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-lg border border-slate-300 hover:border-[#06392f] hover:text-[#06392f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Items per page:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            )}
          </>
        ) : (
          // Grid View
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => {
                const status = getStockStatus(
                  product.stock_quantity ?? 0, 
                  product.is_digital ?? false
                );
                
                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div 
                      className="relative h-48 cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200"
                      onClick={() => handleViewProduct(product)}
                    >
                      {product.image_url ? (
                        <Image 
                          src={product.image_url} 
                          alt={product.name || 'Product image'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute flex flex-col gap-2 top-3 right-3">
                        {product.featured && (
                          <div className="px-2 py-1 text-xs font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-amber-500 to-amber-600">
                            Featured
                          </div>
                        )}
                        {product.discount_percentage && (
                          <div className="px-2 py-1 text-xs font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-rose-500 to-rose-600">
                            -{product.discount_percentage}%
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-bold text-white line-clamp-1">
                          {product.name || 'Unnamed Product'}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                            {product.name || 'Unnamed Product'}
                          </h3>
                          {product.brand && (
                            <p className="text-sm text-slate-500 mt-0.5">by {product.brand}</p>
                          )}
                        </div>
                        <div className={`p-2 rounded-lg ${status.bgColor}`}>
                          {status.icon}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-slate-900">
                            KES {(product.price || 0).toLocaleString()}
                          </p>
                          {product.compare_at_price && product.compare_at_price > (product.price || 0) && (
                            <p className="text-sm line-through text-slate-400">
                              KES {product.compare_at_price.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bgColor} border ${status.dot.replace('bg-', 'border-')}`}>
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                        <Link 
                          href={`/admin/products/categories?category=${encodeURIComponent(product.category || '')}`}
                          className="flex items-center gap-2 transition-colors hover:text-slate-700"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>{product.category || 'Uncategorized'}</span>
                        </Link>
                        {product.sku && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" />
                            <span>{product.sku}</span>
                          </div>
                        )}
                      </div>
                      
                      {product.description && (
                        <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="flex-1 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="flex-1 py-2.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="flex-1 py-2.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination for Grid View */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum ? 'bg-[#06392f] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-300 hover:border-[#06392f]'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}