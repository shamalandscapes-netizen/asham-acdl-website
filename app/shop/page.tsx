import { supabaseAdmin } from '@/supabase/admin';
import { ProductCard } from '@/components/products/product-card';
import { PackageOpen } from 'lucide-react';

// Ensures the page refreshes data on every request (useful for inventory updates)
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // 1. Fetch products from Supabase
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true) // Only show active products
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Construction & Design Store
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our collection of architectural plans, construction materials, and finishes.
        </p>
      </div>

      {/* Product Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <PackageOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
          <p className="max-w-sm mt-2 text-sm text-center text-gray-500">
            We are currently updating our inventory. Please check back soon for new construction materials and plans.
          </p>
        </div>
      )}
    </div>
  );
}