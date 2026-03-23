import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Database } from '@/types/supabase'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { async get(name: string) { return (await cookieStore).get(name)?.value } },
    }
  );

  // 1. Fetch Category
  const { data: category, error: catError } = await supabase
    .from("products")
    .select("id, name")
    .eq("slug", params.slug)
    .single();

  // If Supabase can't find the category, catError will exist or category will be null
  if (catError || !category) {
    console.error("Category Fetch Error:", catError?.message);
    return notFound();
  }

  // 2. Fetch Products
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .eq("category_id", category.id);

  if (prodError) {
    console.error("Products Fetch Error:", prodError.message);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <div className="grid gap-4 mt-6">
        {products?.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products?.map(p => <div key={p.id} className="p-4 border">{p.name}</div>)
        )}
      </div>
    </div>
  );
}