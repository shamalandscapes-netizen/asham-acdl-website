import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // FIX: params is now a Promise
) {
  // 1. Await the params to get the slug
  const { slug } = await params;
  const supabase = await createClient(); // Ensure createClient is awaited if it's async

  try {
    // 2. Check for a product matching the slug
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (product) return NextResponse.json(product);

    // 3. If no product, check for items in a category
    const { data: categoryItems } = await supabase
      .from('products')
      .select('*')
      .eq('category', slug);

    if (categoryItems && categoryItems.length > 0) {
      return NextResponse.json({ isCategory: true, items: categoryItems });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    console.error('Slug API Error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}