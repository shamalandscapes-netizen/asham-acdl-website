'use client';

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  ShieldCheck, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatters';
import { ProductPurchase } from '@/components/products/product-purchase';

interface PageProps {
  params: {
    slug: string;
    id: string;
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug, id } = params;

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin text-[#06392F]" size={40} />
      <p className="mt-4 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Fetching Asham Inventory...</p>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <AlertTriangle className="text-[#C75B39]" size={40} />
      <p className="mt-4 text-lg font-bold text-gray-600">Product not found</p>
      <Link href="/products" className="mt-4 text-[#06392F] hover:underline">
        Back to Shop
      </Link>
    </div>
  );

  // Expert Addition: Logic for stock status
  const isStockLow = product.stock > 0 && product.stock < 10;
  const outOfStock = product.stock <= 0;

  return (
    <div className="bg-white">
      <div className="p-4 mx-auto max-w-7xl md:p-12">
        {/* Breadcrumbs - Now with Home link */}
        <nav className="flex items-center gap-2 mb-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
          <Link href="/" className="hover:text-[#06392F]">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#06392F]">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[#06392F] truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                <Image 
                  src={product.image_url || '/placeholder.jpg'} 
                  alt={product.name} 
                  fill 
                  priority // Expert tip: Load main product image first
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Sale Badge */}
                {product.original_price && (
                  <div className="absolute top-6 left-6 bg-[#C75B39] text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Content & Conversion */}
          <div className="flex flex-col lg:col-span-5">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#06392F]/5 text-[#06392F] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                {/* Expert Tip: Social Proof (Ratings) would go here */}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-[#06392F] mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-black text-[#06392F]">{formatCurrency(product.price)}</p>
                {product.original_price && (
                  <p className="text-xl font-bold text-gray-300 line-through">
                    {formatCurrency(product.original_price)}
                  </p>
                )}
              </div>

              {/* Inventory Status (Crucial for e-commerce) */}
              <div className="mb-8">
                {outOfStock ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                    <AlertTriangle size={16} /> Out of Stock - Restocking Soon
                  </div>
                ) : isStockLow ? (
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-600 animate-pulse">
                    <AlertTriangle size={16} /> Only {product.stock} left in stock - order soon
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <CheckCircle2 size={16} /> In Stock - Ready for Dispatch
                  </div>
                )}
              </div>
            </div>

            {/* Core Purchase Component */}
            <div className="p-6 mb-8 border border-gray-100 rounded-3xl bg-gray-50/50">
              <ProductPurchase product={product} />
            </div>

            {/* Product Tabs / Details */}
            <div className="space-y-6">
              <div className="p-4 border-l-4 border-[#06392F] bg-gray-50">
                <h4 className="flex items-center gap-2 mb-2 text-xs font-black tracking-widest text-[#06392F] uppercase">
                  <FileText size={14} /> Description
                </h4>
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                  <Truck className="text-[#C75B39]" size={24} />
                  <div>
                    <p className="text-sm font-bold text-[#06392F]">Site Delivery</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">3-5 Business Days across Kenya</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                  <ShieldCheck className="text-[#C75B39]" size={24} />
                  <div>
                    <p className="text-sm font-bold text-[#06392F]">Authentic Material</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">Vetted by ASHAM Quality Control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}