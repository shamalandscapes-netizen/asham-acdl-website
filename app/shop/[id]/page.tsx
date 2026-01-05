import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, Truck } from 'lucide-react';
import { supabaseAdmin } from '@/supabase/admin';
import { formatCurrency } from '@/lib/utils/formatters';
import { ProductPurchase } from '@/components/products/product-purchase';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// 1. This function generates metadata for SEO (Title, Description)
export async function generateMetadata({ params }: ProductPageProps) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Asham Construction`,
    description: product.description || 'Quality construction materials and designs.',
  };
}

// 2. Main Page Component
export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound(); // Shows the 404 page
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Breadcrumb / Back Link */}
      <Link 
        href="/shop" 
        className="inline-flex items-center mb-8 text-sm text-gray-500 transition-colors hover:text-black"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="relative w-full overflow-hidden bg-gray-100 border aspect-square rounded-xl">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority // Load this image immediately as it's above the fold
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
              {product.category || 'General'}
            </span>
            <h1 className="mt-2 mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {product.name}
            </h1>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </div>
          </div>

          <div className="pb-8 mb-8 prose-sm prose text-gray-600 border-b">
            <p>{product.description}</p>
          </div>

          {/* Purchase Controls (Client Component) */}
          <div className="mb-8">
            <ProductPurchase product={product} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Secure Payment (M-Pesa)</span>
            </div>
            {product.is_digital ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Check className="w-5 h-5 text-blue-600" />
                <span>Instant Digital Download</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Delivery across Kenya</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}