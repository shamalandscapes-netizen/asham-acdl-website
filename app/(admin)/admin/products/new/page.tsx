'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/supabase/client';
import { 
  ArrowLeft, Upload, Save, FileText, 
  Loader2, Plus, X, Image as ImageIcon,
  Package, Tag, DollarSign, Hash,
  Globe, Box, FileDigit, Layers,
  CheckCircle, AlertCircle, Info,
  Copy, Eye, Palette, BarChart3,
  Calendar, Shield, Globe as World,
  CreditCard, Truck, Warehouse,
  ClipboardCheck, Settings, Cpu,
  Database, FileSpreadsheet, FileArchive,
  FileImage, FileType, FileCode,
  Building2, Home, Castle, Factory,
  TreePine, Waves, Mountain,
  Zap, RefreshCw, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ProductCategory } from '@/types/products';

const PRODUCT_CATEGORIES = [
  { id: 'materials', name: 'Cement & Binders', icon: <Building2 className="w-4 h-4" /> },
  { id: 'steel', name: 'Steel & Reinforcement', icon: <Cpu className="w-4 h-4" /> },
  { id: 'roofing', name: 'Roofing Materials', icon: <Home className="w-4 h-4" /> },
  { id: 'finishes', name: 'Finishes & Paints', icon: <Palette className="w-4 h-4" /> },
  { id: 'plumbing', name: 'Plumbing & Water', icon: <Waves className="w-4 h-4" /> },
  { id: 'digital', name: 'Digital Plans', icon: <FileDigit className="w-4 h-4" /> },
  { id: 'furniture', name: 'Furniture', icon: <Castle className="w-4 h-4" /> },
  { id: 'landscaping', name: 'Landscaping', icon: <TreePine className="w-4 h-4" /> },
  { id: 'electrical', name: 'Electrical', icon: <Cpu className="w-4 h-4" /> },
  { id: 'industrial', name: 'Industrial', icon: <Factory className="w-4 h-4" /> },
];

const PRODUCT_TYPES = [
  { value: 'physical', label: 'Physical Product', icon: <Package className="w-4 h-4" /> },
  { value: 'digital', label: 'Digital Product', icon: <Globe className="w-4 h-4" /> },
  { value: 'service', label: 'Service', icon: <Settings className="w-4 h-4" /> },
  { value: 'subscription', label: 'Subscription', icon: <Calendar className="w-4 h-4" /> },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  { value: 'active', label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'inactive', label: 'Inactive', color: 'bg-amber-100 text-amber-700' },
  { value: 'archived', label: 'Archived', color: 'bg-slate-100 text-slate-500' },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', icon: <Eye className="w-4 h-4" /> },
  { value: 'private', label: 'Private', icon: <Shield className="w-4 h-4" /> },
  { value: 'hidden', label: 'Hidden', icon: <Eye className="w-4 h-4" /> },
];

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<ProductCategory[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    slug: '',
    short_description: '',
    description: '',
    sku: '',
    
    // Pricing
    price: '',
    compare_at_price: '',
    cost_price: '',
    
    // Inventory
    stock_quantity: '',
    stock: '',
    low_stock_threshold: '10',
    track_inventory: true,
    allow_backorders: false,
    
    // Categorization
    category: '',
    category_id: '',
    product_type: 'physical',
    brand: '',
    tags: [] as string[],
    
    // Digital Product
    is_digital: false,
    digital_file_url: '',
    digital_file_type: '',
    max_downloads: '1',
    download_expiry_days: '30',
    download_limit: '',
    
    // Media
    image_url: '',
    featured_image_url: '',
    gallery_images: [] as string[],
    gallery: [] as string[],
    video_url: '',
    
    // SEO
    meta_title: '',
    meta_description: '',
    meta_keywords: [] as string[],
    
    // Additional
    status: 'draft',
    visibility: 'public',
    is_featured: false,
    weight: '',
    dimensions: '',
    
    // REMOVED: notes column doesn't exist in schema
    
    // Specifications
    specifications: [] as Array<{ key: string; value: string; group: string }>
  });

  // SEO character counters
  const [seoStats, setSeoStats] = useState({
    titleLength: 0,
    descriptionLength: 0,
    titleOptimal: false,
    descriptionOptimal: false
  });

  // Auto-SEO generation
  const [autoSeoEnabled, setAutoSeoEnabled] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update SEO stats when meta fields change
  useEffect(() => {
    setSeoStats({
      titleLength: formData.meta_title.length,
      descriptionLength: formData.meta_description.length,
      titleOptimal: formData.meta_title.length >= 50 && formData.meta_title.length <= 60,
      descriptionOptimal: formData.meta_description.length >= 150 && formData.meta_description.length <= 160
    });
  }, [formData.meta_title, formData.meta_description]);

  // Auto-generate SEO when product details change
  useEffect(() => {
    if (autoSeoEnabled && formData.name) {
      generateSEOSettings();
    }
  }, [formData.name, formData.brand, formData.category, formData.short_description, autoSeoEnabled]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setAvailableCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Helper to generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }, []);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = generateSlug(formData.name);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, generateSlug]);

  // Auto-generate SKU
  const generateSKU = () => {
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'PRO';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  // Handle category change
  const handleCategoryChange = (categoryValue: string) => {
    const selectedCategory = availableCategories.find(cat => (cat as any).name === categoryValue);
    setFormData(prev => ({ 
      ...prev, 
      category: categoryValue,
      category_id: selectedCategory ? (selectedCategory as any).id : ''
    }));
  };

  // Enhanced SEO generation
  const generateSEOSettings = (force = false) => {
    if (!formData.name && !force) return;
    
    // Smart title generation
    let metaTitle = '';
    if (formData.name) {
      const brandPart = formData.brand ? ` | ${formData.brand}` : '';
      const categoryPart = formData.category ? ` | ${formData.category}` : ' | Construction Materials';
      const suffix = ' | Best Price & Quality';
      
      // Build title with optimal length
      const base = `${formData.name}${brandPart}${categoryPart}${suffix}`;
      metaTitle = base.length <= 60 ? base : `${formData.name}${categoryPart} | Buy Online`;
    }

    // Smart description generation
    let metaDescription = '';
    if (formData.name) {
      const pricePart = formData.price ? ` at KES ${parseFloat(formData.price).toLocaleString()}` : '';
      const categoryPart = formData.category ? ` ${formData.category}` : ' construction material';
      const shortDescPart = formData.short_description ? ` ${formData.short_description}` : ' High-quality product with warranty.';
      const features = ' Free delivery available. Best prices in Kenya.';
      
      const base = `Buy ${formData.name}${pricePart}${categoryPart}.${shortDescPart}${features}`;
      
      // Ensure description is optimal length
      if (base.length <= 160) {
        metaDescription = base;
      } else {
        // Trim intelligently
        const maxLength = 160;
        const essential = `Buy ${formData.name}${pricePart}${categoryPart}.`;
        if (essential.length + shortDescPart.length <= maxLength - 10) {
          metaDescription = essential + shortDescPart.substring(0, maxLength - essential.length - 10) + '...';
        } else {
          metaDescription = essential.substring(0, maxLength - 3) + '...';
        }
      }
    }

    // Smart keyword generation
    const metaKeywords = generateKeywords();

    setFormData(prev => ({
      ...prev,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords
    }));
    
    if (force) {
      toast.success('SEO settings generated successfully!');
    }
  };

  // Smart keyword generation
  const generateKeywords = (): string[] => {
    const keywords = new Set<string>();
    
    // Add base keywords
    const baseKeywords = ['construction', 'materials', 'building', 'supplies', 'kenya', 'nairobi'];
    baseKeywords.forEach(kw => keywords.add(kw));
    
    // Add product name words
    if (formData.name) {
      formData.name.toLowerCase().split(' ').forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add category keywords
    if (formData.category) {
      formData.category.toLowerCase().split(' ').forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add brand keywords
    if (formData.brand) {
      formData.brand.toLowerCase().split(' ').forEach(word => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add product type keywords
    keywords.add(formData.product_type);
    
    // Add location-based keywords
    keywords.add('buy online');
    keywords.add('free delivery');
    keywords.add('wholesale');
    keywords.add('retail');
    
    // Convert to array and limit to 15 keywords
    return Array.from(keywords).slice(0, 15);
  };

  // Upload function
  const handleUpload = async (file: File, fileType: 'image' | 'digital'): Promise<string> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = fileType === 'image' ? `product-images/${fileName}` : `digital-products/${fileName}`;
      
      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}. Please create a 'products' bucket in Supabase Storage.`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await handleUpload(file, 'image');
      setFormData(prev => ({ ...prev, image_url: url }));
      
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleDigitalFileUpload = async (file: File) => {
    try {
      const url = await handleUpload(file, 'digital');
      const fileType = file.type;
      
      setFormData(prev => ({ 
        ...prev, 
        digital_file_url: url,
        digital_file_type: fileType,
        is_digital: true 
      }));
      
      toast.success('Digital file uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload digital file');
    }
  };

  // Add to gallery
  const handleGalleryUpload = async (file: File) => {
    try {
      const url = await handleUpload(file, 'image');
      setFormData(prev => ({ 
        ...prev, 
        gallery_images: [...prev.gallery_images, url],
        gallery: [...prev.gallery, url]
      }));
      toast.success('Image added to gallery');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload gallery image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.price) {
        throw new Error('Name and price are required');
      }

      // Prepare data for database - REMOVED 'notes' column
      const productData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price) || 0,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        category: formData.category || null,
        category_id: formData.category_id || null,
        product_type: formData.product_type || 'physical',
        is_digital: formData.product_type === 'digital',
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        stock: parseInt(formData.stock) || parseInt(formData.stock_quantity) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
        track_inventory: formData.track_inventory,
        allow_backorders: formData.allow_backorders || false,
        sku: formData.sku || null,
        brand: formData.brand || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        image_url: formData.image_url || null,
        featured_image_url: formData.featured_image_url || formData.image_url || null,
        gallery_images: formData.gallery_images.length > 0 ? formData.gallery_images : null,
        gallery: formData.gallery.length > 0 ? formData.gallery : null,
        video_url: formData.video_url || null,
        digital_file_url: formData.digital_file_url || null,
        digital_file_type: formData.digital_file_type || null,
        max_downloads: formData.max_downloads ? parseInt(formData.max_downloads) : null,
        download_expiry_days: formData.download_expiry_days ? parseInt(formData.download_expiry_days) : null,
        download_limit: formData.download_limit ? parseInt(formData.download_limit) : null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords.length > 0 ? formData.meta_keywords : null,
        status: formData.status || 'draft',
        visibility: formData.visibility || 'public',
        is_featured: formData.is_featured || false,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        // REMOVED: notes doesn't exist in schema
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert into Database
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // If product is digital and has a file, also insert into digital_products table
      if (formData.product_type === 'digital' && formData.digital_file_url) {
        const digitalProductData = {
          product_id: data.id,
          storage_bucket: 'products',
          storage_prefix: `digital-products/${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        const { error: digitalError } = await supabase
          .from('digital_products')
          .insert(digitalProductData);

        if (digitalError) console.error('Failed to save digital product info:', digitalError);
      }

      // If there are specifications, insert them
      if (formData.specifications.length > 0) {
        const specificationsData = formData.specifications.map(spec => ({
          product_id: data.id,
          spec_key: spec.key,
          spec_value: spec.value,
          spec_group: spec.group || 'General',
          display_order: 0,
          is_visible: true,
          created_at: new Date().toISOString(),
        }));

        const { error: specsError } = await supabase
          .from('product_specifications')
          .insert(specificationsData);

        if (specsError) console.error('Failed to save specifications:', specsError);
      }

      toast.success('Product created successfully!');
      router.refresh();
      router.push('/admin/products');
      
    } catch (err: any) {
      console.error('Error creating product:', err);
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '', group: 'General' }]
    }));
  };

  const updateSpecification = (index: number, field: 'key' | 'value' | 'group', value: string) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: <Info className="w-4 h-4" /> },
    { number: 2, title: 'Pricing & Inventory', icon: <DollarSign className="w-4 h-4" /> },
    { number: 3, title: 'Media & Files', icon: <FileImage className="w-4 h-4" /> },
    { number: 4, title: 'SEO & Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 font-montserrat">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b shadow-sm bg-white/90 backdrop-blur-xl border-slate-200">
        <div className="flex flex-col gap-6 p-6 mx-auto max-w-7xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 hover:text-emerald-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
            <div className="w-px h-6 bg-slate-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
              <p className="text-sm text-slate-500">Create a new product for your inventory</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${formData.status === 'draft' ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'}`}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Publish Product
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-4">
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${currentStep === step.number ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-300'}`}
              >
                {step.icon}
              </button>
              <div className={`hidden md:block ${currentStep === step.number ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                {step.title}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-px ${currentStep > step.number ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="p-6 mx-auto space-y-8 max-w-7xl">
        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Basic Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <Info className="w-5 h-5 text-emerald-600" />
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Product Name *
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        SKU
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="PRO-ABC123"
                          value={formData.sku}
                          onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="px-4 py-3 transition-colors rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Product Type
                      </label>
                      <select
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        value={formData.product_type}
                        onChange={e => setFormData({ ...formData, product_type: e.target.value })}
                      >
                        {PRODUCT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Brief description for product listings"
                      value={formData.short_description}
                      onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Full Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Detailed product description with features and benefits"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Categories & Tags */}
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <Tag className="w-5 h-5 text-emerald-600" />
                  Categorization
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <select
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      value={formData.category}
                      onChange={e => handleCategoryChange(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {availableCategories.length > 0 ? (
                        availableCategories.map((cat: any) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        PRODUCT_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Brand
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="Enter brand name"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-emerald-50 text-emerald-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Add a tag and press Enter"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a tag and press Enter"]') as HTMLInputElement;
                          if (input.value) {
                            addTag(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-3 transition-colors rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Status & Slug */}
            <div className="space-y-6">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Product Status</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.status === option.value ? option.color : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      {VISIBILITY_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, visibility: option.value }))}
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${formData.visibility === option.value ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white text-slate-600 border border-slate-300 hover:border-slate-400'}`}
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Featured Product
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_featured ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_featured ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">URL Slug</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Custom Slug
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="product-url-slug"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <p className="mt-1 text-sm text-slate-500">
                      Leave empty to auto-generate from product name
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-6 border shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-emerald-200">
                <h3 className="mb-2 font-bold text-emerald-900">Ready to Continue?</h3>
                <p className="mb-4 text-sm text-emerald-700">
                  Fill in basic details before moving to pricing and inventory.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.name}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
                >
                  Continue to Pricing
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Pricing */}
            <div className="space-y-6 lg:col-span-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pricing
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Price (KES) *
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Compare at Price (KES)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="0.00"
                        value={formData.compare_at_price}
                        onChange={e => setFormData({ ...formData, compare_at_price: e.target.value })}
                      />
                      {formData.compare_at_price && formData.price && (
                        <div className="mt-1 text-sm text-emerald-600">
                          Discount: {(((parseFloat(formData.compare_at_price) - parseFloat(formData.price)) / parseFloat(formData.compare_at_price)) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Cost Price (KES)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Cost to produce"
                        value={formData.cost_price}
                        onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <Box className="w-5 h-5 text-emerald-600" />
                  Inventory Management
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="0"
                        value={formData.stock_quantity}
                        onChange={e => {
                          const value = e.target.value;
                          setFormData(prev => ({ 
                            ...prev, 
                            stock_quantity: value,
                            stock: value // Sync stock field
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="10"
                        value={formData.low_stock_threshold}
                        onChange={e => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Track Inventory
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, track_inventory: !prev.track_inventory }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.track_inventory ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.track_inventory ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Allow Backorders
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, allow_backorders: !prev.allow_backorders }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.allow_backorders ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.allow_backorders ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation & Summary */}
            <div className="space-y-6">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Pricing Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Selling Price:</span>
                    <span className="font-medium text-slate-900">
                      KES {parseFloat(formData.price || '0').toLocaleString()}
                    </span>
                  </div>
                  
                  {formData.compare_at_price && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Compare at:</span>
                      <span className="font-medium line-through text-slate-400">
                        KES {parseFloat(formData.compare_at_price || '0').toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {formData.cost_price && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Cost Price:</span>
                      <span className="font-medium text-slate-900">
                        KES {parseFloat(formData.cost_price || '0').toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {formData.price && formData.cost_price && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-700">Profit Margin:</span>
                        <span className={`font-bold ${parseFloat(formData.price) > parseFloat(formData.cost_price) ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {(((parseFloat(formData.price) - parseFloat(formData.cost_price)) / parseFloat(formData.price)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-emerald-200">
                <h3 className="mb-2 font-bold text-emerald-900">Next Steps</h3>
                <p className="mb-4 text-sm text-emerald-700">
                  Set pricing and inventory options before adding media.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-emerald-700 border-emerald-300 hover:border-emerald-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.price}
                    className="flex-1 px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
                  >
                    Continue to Media
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Media */}
            <div className="space-y-6 lg:col-span-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <FileImage className="w-5 h-5 text-emerald-600" />
                  Product Images
                </h2>
                
                <div className="space-y-6">
                  {/* Main Image */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Main Product Image *
                    </label>
                    <div className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl ${previewUrl || formData.image_url ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 bg-slate-50'} p-8 transition-all`}>
                      {previewUrl || formData.image_url ? (
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-lg">
                            <img 
                              src={previewUrl || formData.image_url} 
                              alt="Preview" 
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="mb-2 text-sm text-slate-600">Image uploaded successfully</p>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image_url: '' }));
                              setPreviewUrl('');
                            }}
                            className="text-sm text-rose-600 hover:text-rose-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mb-4 text-slate-400" />
                          <p className="mb-2 text-sm font-medium text-slate-700">Drag & drop or click to upload</p>
                          <p className="mb-4 text-sm text-slate-500">Recommended: 800x800px, JPG or PNG</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Gallery Images
                    </label>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {formData.gallery_images.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="overflow-hidden border rounded-lg aspect-square border-slate-300">
                            <img src={url} alt={`Gallery ${index + 1}`} className="object-cover w-full h-full" />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                gallery_images: prev.gallery_images.filter((_, i) => i !== index),
                                gallery: prev.gallery.filter((_, i) => i !== index)
                              }));
                            }}
                            className="absolute p-1 text-white transition-opacity rounded-full opacity-0 top-1 right-1 bg-rose-500 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {formData.gallery_images.length < 6 && (
                        <div className="relative flex flex-col items-center justify-center transition-colors border-2 border-dashed rounded-lg aspect-square border-slate-300 bg-slate-50 hover:bg-slate-100">
                          <Upload className="w-8 h-8 mb-2 text-slate-400" />
                          <span className="text-sm text-slate-600">Add Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleGalleryUpload(file);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Digital File Upload */}
                  {formData.product_type === 'digital' && (
                    <div className="p-6 border border-indigo-100 bg-indigo-50/30 rounded-xl">
                      <h3 className="flex items-center gap-2 mb-4 font-bold text-indigo-900">
                        <FileDigit className="w-5 h-5 text-indigo-600" />
                        Digital File
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-700">
                            Upload Digital File *
                          </label>
                          <div className="relative flex flex-col items-center justify-center p-6 border-2 border-indigo-300 border-dashed bg-indigo-50 rounded-xl">
                            {formData.digital_file_url ? (
                              <div className="text-center">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                                <p className="mb-2 text-sm text-indigo-700">File uploaded successfully</p>
                                <p className="text-xs text-indigo-500">{formData.digital_file_type}</p>
                              </div>
                            ) : (
                              <>
                                <FileText className="w-12 h-12 mb-4 text-indigo-400" />
                                <p className="mb-2 text-sm font-medium text-indigo-700">Upload digital file</p>
                                <p className="mb-4 text-sm text-indigo-500">PDF, ZIP, or other digital formats</p>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.zip,.rar,.7z,.doc,.docx,.txt,.mp4,.mp3"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleDigitalFileUpload(file);
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-indigo-700">
                              Max Downloads
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="w-full px-4 py-3 transition-all bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              placeholder="1"
                              value={formData.max_downloads}
                              onChange={e => setFormData({ ...formData, max_downloads: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-medium text-indigo-700">
                              Download Expiry (days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="w-full px-4 py-3 transition-all bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                              placeholder="30"
                              value={formData.download_expiry_days}
                              onChange={e => setFormData({ ...formData, download_expiry_days: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-indigo-700">
                            Download Limit
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-3 transition-all bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            placeholder="Unlimited if empty"
                            value={formData.download_limit}
                            onChange={e => setFormData({ ...formData, download_limit: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video URL */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Product Video URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.video_url}
                      onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Navigation */}
            <div className="space-y-6">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Upload Status</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Main Image:</span>
                    {formData.image_url ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Gallery Images:</span>
                    <span className="text-sm font-medium text-slate-700">{formData.gallery_images.length} uploaded</span>
                  </div>
                  
                  {formData.product_type === 'digital' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Digital File:</span>
                      {formData.digital_file_url ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      Uploading files may take a moment depending on size and connection.
                    </p>
                    {uploading && (
                      <div className="flex items-center gap-2 mt-2 text-emerald-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-emerald-200">
                <h3 className="mb-2 font-bold text-emerald-900">Ready for SEO?</h3>
                <p className="mb-4 text-sm text-emerald-700">
                  SEO settings are auto-generated based on your product info.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-emerald-700 border-emerald-300 hover:border-emerald-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    Continue to SEO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - SEO & Specifications */}
            <div className="space-y-6 lg:col-span-2">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    SEO Settings (Auto-Generated)
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => generateSEOSettings(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Auto-SEO:</span>
                      <button
                        type="button"
                        onClick={() => setAutoSeoEnabled(!autoSeoEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${autoSeoEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSeoEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* SEO Preview Card */}
                  <div className="p-4 border border-emerald-200 rounded-xl bg-emerald-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <h3 className="font-medium text-emerald-900">Search Result Preview</h3>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-sm font-medium truncate text-emerald-700">
                        {formData.meta_title || 'Your product will appear here...'}
                      </div>
                      <div className="text-xs text-emerald-900">
                        https://yourstore.com/products/{formData.slug || 'product-slug'}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">
                        {formData.meta_description || 'Product description will appear here in search results...'}
                      </div>
                    </div>
                  </div>

                  {/* SEO Status Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${seoStats.titleOptimal ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">Meta Title</span>
                        <span className={`text-xs font-medium ${seoStats.titleOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {seoStats.titleLength}/60
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${seoStats.titleOptimal ? 'bg-emerald-500' : seoStats.titleLength > 60 ? 'bg-rose-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, (seoStats.titleLength / 60) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {seoStats.titleOptimal ? '✓ Optimal length' : 
                         seoStats.titleLength < 50 ? 'Too short - add more details' : 
                         'Too long - consider shortening'}
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg ${seoStats.descriptionOptimal ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">Meta Description</span>
                        <span className={`text-xs font-medium ${seoStats.descriptionOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {seoStats.descriptionLength}/160
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${seoStats.descriptionOptimal ? 'bg-emerald-500' : seoStats.descriptionLength > 160 ? 'bg-rose-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, (seoStats.descriptionLength / 160) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {seoStats.descriptionOptimal ? '✓ Optimal length' : 
                         seoStats.descriptionLength < 150 ? 'Too short - add benefits' : 
                         'Too long - trim unnecessary words'}
                      </p>
                    </div>
                  </div>

                  {/* SEO Fields (Read-only preview with edit option) */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                        <span>Meta Title</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${seoStats.titleOptimal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {seoStats.titleOptimal ? 'Optimal' : 'Needs adjustment'}
                        </span>
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Auto-generated based on product name"
                        value={formData.meta_title}
                        onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-slate-500">
                          Includes: {formData.name || 'Product Name'}, {formData.brand || 'Brand'}, Category
                        </p>
                        <div className="flex items-center gap-2">
                          {formData.meta_title && (
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(formData.meta_title)}
                              className="text-xs text-emerald-600 hover:text-emerald-800"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                        <span>Meta Description</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${seoStats.descriptionOptimal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {seoStats.descriptionOptimal ? 'Optimal' : 'Needs adjustment'}
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Auto-generated description for search results"
                        value={formData.meta_description}
                        onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-slate-500">
                          Includes: Call-to-action, price, key features, benefits
                        </p>
                        {formData.meta_description && (
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(formData.meta_description)}
                            className="text-xs text-emerald-600 hover:text-emerald-800"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">
                          Meta Keywords
                        </label>
                        <span className="text-xs text-slate-500">
                          {formData.meta_keywords.length} keywords
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-white border rounded-lg border-slate-300 min-h-[60px]">
                        {formData.meta_keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                const newKeywords = [...formData.meta_keywords];
                                newKeywords.splice(index, 1);
                                setFormData(prev => ({ ...prev, meta_keywords: newKeywords }));
                              }}
                              className="text-slate-500 hover:text-slate-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="flex-1 min-w-[120px] bg-transparent border-0 focus:outline-none focus:ring-0"
                          placeholder="Add keyword..."
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const keyword = input.value.trim();
                              if (keyword && !formData.meta_keywords.includes(keyword)) {
                                setFormData(prev => ({
                                  ...prev,
                                  meta_keywords: [...prev.meta_keywords, keyword]
                                }));
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Auto-generated keywords based on product name, category, and brand
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-slate-900">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Product Specifications
                </h2>
                
                <div className="space-y-4">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3">
                      <div className="col-span-3">
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="Key"
                          value={spec.key}
                          onChange={e => updateSpecification(index, 'key', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="Group"
                          value={spec.group}
                          onChange={e => updateSpecification(index, 'group', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 text-sm transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            placeholder="Value"
                            value={spec.value}
                            onChange={e => updateSpecification(index, 'value', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="px-3 py-2 transition-colors rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Specification
                  </button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Additional Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="0.00"
                        value={formData.weight}
                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Dimensions (L×W×H)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 transition-all bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="10×5×3 cm"
                        value={formData.dimensions}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Review & Submit */}
            <div className="space-y-6">
              <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Review & Submit</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50">
                    <h3 className="mb-2 font-medium text-slate-900">Product Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Name:</span>
                        <span className="font-medium truncate text-slate-900">{formData.name || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-900">{formData.category || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Price:</span>
                        <span className="font-medium text-slate-900">KES {parseFloat(formData.price || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Stock:</span>
                        <span className="font-medium text-slate-900">{formData.stock_quantity || '0'} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Type:</span>
                        <span className="font-medium text-slate-900">{formData.product_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${formData.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Basic information complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {formData.price ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span>Pricing set</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {formData.image_url ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span>Main image uploaded</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>SEO auto-generated</span>
                    </div>
                    {formData.product_type === 'digital' && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {formData.digital_file_url ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        )}
                        <span>Digital file uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-emerald-200">
                <h3 className="mb-2 font-bold text-emerald-900">Ready to Publish?</h3>
                <p className="mb-4 text-sm text-emerald-700">
                  Review all information before publishing the product.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 px-4 py-3 font-medium transition-colors bg-white border rounded-lg text-emerald-700 border-emerald-300 hover:border-emerald-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.name || !formData.price}
                    className="flex items-center justify-center flex-1 gap-2 px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Publish Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Montserrat Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}