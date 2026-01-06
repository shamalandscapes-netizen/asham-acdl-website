'use client';

import { useEffect, useState } from 'react';
import { Loader2, Package, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/formatters';
import { ProductPurchase } from '@/components/products/product-purchase';

interface PageProps {
  params: { slug: string; id: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug, id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Log the ID to verify what is being sent to the API
        console.log('Fetching product ID:', id);
        
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
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]" aria-live="polite">
      <Loader2 className="animate-spin text-[#C75B39]" size={48} />
      <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 uppercase tracking-[0.3em]">Analyzing Specs...</p>
    </div>
  );

  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black uppercase text-[#06392F]">Material Not Found</h2>
      <p className="mt-2 mb-8 text-sm tracking-widest text-gray-400 uppercase">The requested product ID does not exist in the manifest.</p>
      <Link href="/products" className="bg-[#06392F] text-white px-8 py-4 font-black uppercase text-xs">Return to Inventory</Link>
    </div>
  );

  return (
    <div className="p-4 mx-auto max-w-7xl md:p-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <Link href="/products" className="hover:text-[#C75B39]">Catalog</Link>
        <ChevronRight size={12} />
        <span className="text-[#06392F] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid items-start grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Product Image - Updated to use featured_image_url */}
        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl group">
          <Image
            src={product.featured_image_url || product.image_url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            priority // Helps with LCP performance
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-6 space-y-4">
            <span className="inline-block bg-[#06392F] text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em]">
              {product.category || 'General Supply'}
            </span>
            <h1 className="text-5xl font-black text-[#06392F] leading-[0.9] uppercase tracking-tighter">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-4xl font-black text-[#C75B39]">
              {formatCurrency(product.price)}
            </p>
            {product.compare_at_price && (
              <p className="text-xl font-bold text-gray-300 line-through">
                {formatCurrency(product.compare_at_price)}
              </p>
            )}
          </div>

          <div className="py-8 mb-8 border-t border-gray-100">
            <h4 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Specifications & Details</h4>
            <p className="text-lg font-medium leading-relaxed text-gray-600">
              {product.description || product.short_description || "No detailed description available for this unit."}
            </p>
          </div>

          {/* This component handles the actual Add to Cart logic */}
          <ProductPurchase product={product} />

          <div className="grid grid-cols-1 gap-4 pt-10 mt-10 border-t border-gray-100 sm:grid-cols-2">
            <div className="flex items-center gap-4 p-4 border rounded-xl border-gray-50 bg-gray-50/50">
              <div className="p-2 rounded-lg text-emerald-600 bg-emerald-50"><ShieldCheck size={20} /></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest">Quality Assured</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Vetted Construction Grade</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-xl border-gray-50 bg-gray-50/50">
              <div className="p-2 text-[#C75B39] rounded-lg bg-orange-50"><Package size={20} /></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest">Logistics</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Direct Site Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}