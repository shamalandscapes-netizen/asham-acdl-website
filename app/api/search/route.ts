import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Shared Helper: Initialize Supabase Server Client
 */
function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { 
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) { 
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) {}
        },
      },
    }
  );
}

// --- GET: Execute Search Query ---
export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Guard clause for short queries to save database resources
  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        featured_image_url,
        category,
        product_type,
        description
      `)
      // .or logic performs a case-insensitive search across multiple columns
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,product_type.ilike.%${query}%`)
      .limit(10); // Seasoned Dev Tip: Limit results for faster UI rendering

    if (error) throw error;

    return NextResponse.json({ products: data || [] });
  } catch (error: any) {
    console.error('Search API Error:', error.message);
    return NextResponse.json({ error: 'Search operation failed' }, { status: 500 });
  }
}