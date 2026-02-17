import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

// COMPONENTS
import { ProductPurchase } from '@/components/products/product-purchase';
import { ProductCard } from '@/components/products/product-card';
import { CompareBar } from '@/components/products/compare-bar';
import { QuickViewModal } from '@/components/products/quick-view-modal';
import { MobileAddToCart } from '@/components/products/mobile-add-to-cart';

/**
 * app/products/[slug]/page.tsx
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // FIX: params is now a Promise in Next.js 16
}) {
  // 1. Await params and initialize Supabase
  const { slug } = await params;
  const supabase = await createClient(); // Ensure the helper is awaited

  // 2. Fetch primary product data
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) notFound();

  // 3. Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('slug', slug)
    .limit(4);

  // Fallback for images array vs single image_url
  const images: string[] = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/placeholder.jpg'];

  const isStockLow = product.stock > 0 && product.stock < 10;
  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-white">
      <QuickViewModal />

      <div className="px-4 py-6 mx-auto max-w-7xl md:py-10">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 mb-8 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          <Link href="/products" className="hover:text-[#06392F] transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <Link href={`/products/category/${product.category}`} className="hover:text-[#06392F] transition-colors">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight size={10} />
          <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
        </nav>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 xl:gap-16">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square md:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-4 md:p-8"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 pb-2 overflow-x-auto no-scrollbar">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-2xl border-2 transition-all ${
                        index === 0 ? 'border-[#C75B39]' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumb ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col py-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#C75B39]/10 text-[#C75B39] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
              {isStockLow && (
                <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <AlertTriangle size={12} /> Low Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#06392F] leading-tight tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-[#06392F]">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl font-bold text-gray-300 line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>

            <p className="mb-8 font-medium leading-relaxed text-gray-500">
              {product.description?.slice(0, 160)}...
            </p>

            <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <ProductPurchase product={product} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 p-4 border bg-gray-50/50 rounded-2xl border-gray-50">
                <Truck className="text-[#C75B39]" size={18} />
                <p className="text-[10px] font-black text-[#06392F] uppercase">Fast Site Delivery</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Kenya Wide Coverage</p>
              </div>
              <div className="flex flex-col gap-2 p-4 border bg-gray-50/50 rounded-2xl border-gray-50">
                <ShieldCheck className="text-[#C75B39]" size={18} />
                <p className="text-[10px] font-black text-[#06392F] uppercase">Vetted Quality</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Engineer Approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="pt-12 mt-24 border-t border-gray-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-[#06392F] tracking-tight">Complete Your Order</h2>
                <p className="mt-1 text-sm font-medium text-gray-400">Frequently bought together with this item</p>
              </div>
              <Link
                href={`/products/category/${product.category}`}
                className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#C75B39] hover:opacity-80 transition-opacity"
              >
                View Category <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {!outOfStock && (
        <MobileAddToCart product={product} price={formatCurrency(product.price)} />
      )}
      <CompareBar />
    </div>
  );
}