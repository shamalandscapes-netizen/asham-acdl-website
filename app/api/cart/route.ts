import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper to create the Supabase Client
function getSupabase() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

// --- GET: Fetch User's Cart ---
export async function GET() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ items: [] }); // Return empty for guests (handled by local storage usually)
  }

  // Fetch cart items and join with product details
  const { data, error } = await supabase
    .from('cart')
    .select(`
      id,
      quantity,
      product:products (
        id,
        name,
        price,
        image_url,
        category
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// --- POST: Add Item or Update Quantity ---
export async function POST(request: Request) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Please log in to save cart' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Upsert: If item exists, update quantity. If not, insert it.
    const { data, error } = await supabase
      .from('cart')
      .upsert(
        { 
          user_id: user.id, 
          product_id: productId, 
          quantity: quantity 
        },
        { onConflict: 'user_id, product_id' }
      )
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Cart updated', data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove Item ---
export async function DELETE(request: Request) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Item removed' });
}