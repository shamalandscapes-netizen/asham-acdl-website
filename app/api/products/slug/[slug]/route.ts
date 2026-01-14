import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = createClient();

  try {
    // Check for a product matching the slug
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (product) return NextResponse.json(product);

    // If no product, check for items in a category
    const { data: categoryItems } = await supabase
      .from('products')
      .select('*')
      .eq('category', slug);

    if (categoryItems && categoryItems.length > 0) {
      return NextResponse.json({ isCategory: true, items: categoryItems });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}