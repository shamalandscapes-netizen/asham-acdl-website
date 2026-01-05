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
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-[#C75B39]" size={48} />
      <p className="mt-4 text-xs font-bold tracking-widest text-gray-400 uppercase">Loading details...</p>
    </div>
  );

  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-[#06392F]">Product not found.</h2>
      <Link href="/products" className="text-[#C75B39] underline mt-4 block">Back to Shop</Link>
    </div>
  );

  return (
    <div className="p-4 mx-auto max-w-7xl md:p-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-12 text-sm font-medium text-gray-400">
        <Link href="/products" className="hover:text-[#C75B39]">Shop</Link>
        <ChevronRight size={14} />
        <Link href={`/products/${slug}`} className="capitalize hover:text-[#C75B39]">
          {slug.replace(/-/g, ' ')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-[#06392F] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-2xl p-8">
          <Image
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-contain p-12 transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 space-y-2">
            <span className="inline-block bg-orange-50 text-[#C75B39] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-[#06392F] leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-4xl font-black text-[#06392F]">{formatCurrency(product.price)}</p>
            {product.original_price && (
              <p className="text-xl font-bold text-gray-400 line-through">
                {formatCurrency(product.original_price)}
              </p>
            )}
          </div>

          <div className="py-8 mb-8 border-t border-gray-100">
            <h4 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">Description</h4>
            <p className="text-lg leading-relaxed text-gray-600">{product.description}</p>
          </div>

          <ProductPurchase product={product} />

          <div className="grid grid-cols-2 gap-4 pt-8 mt-12 border-t border-gray-50">
            <div className="flex items-center gap-3 text-sm font-bold text-[#06392F]">
              <div className="p-2 text-green-600 rounded-lg bg-green-50"><ShieldCheck size={20} /></div>
              Genuine & Vetted
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-[#06392F]">
              <div className="p-2 text-blue-600 rounded-lg bg-blue-50"><Package size={20} /></div>
              Fast Site Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
