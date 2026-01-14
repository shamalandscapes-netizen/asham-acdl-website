import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Helper to initialize Supabase Server Client with Auth Cookies
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
          try { cookieStore.set({ name, value, ...options }); } catch (e) { /* Server Component context */ }
        },
        remove(name: string, options: CookieOptions) { 
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) { /* Server Component context */ }
        },
      },
    }
  );
}

// --- GET: Fetch User's Cart with Correct Column Mapping ---
export async function GET() {
  const supabase = getSupabase();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // If user is not logged in, return an empty array (prevents frontend crashes)
    if (!user) return NextResponse.json([]);

    const { data, error } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          featured_image_url,
          category,
          product_type
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    // Safety check: ensure we always return an array
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Cart GET Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: Add or Update Quantity (Upsert Logic) ---
export async function POST(request: Request) {
  const supabase = getSupabase();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to manage your cart' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    // Force quantity to be at least 1 and an integer
    const finalQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    const { data, error } = await supabase
      .from('cart')
      .upsert(
        { 
          user_id: user.id, 
          product_id: productId, 
          quantity: finalQuantity 
        },
        { onConflict: 'user_id, product_id' }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Manifest updated', data });
  } catch (error: any) {
    console.error('Cart POST Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove Specific Item ---
export async function DELETE(request: Request) {
  const supabase = getSupabase();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) throw error;

    return NextResponse.json({ message: 'Unit removed from manifest' });
  } catch (error: any) {
    console.error('Cart DELETE Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
