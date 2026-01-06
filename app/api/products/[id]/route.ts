import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// --- Helper: create Supabase Client ---
async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// --- GET: Fetch Single Product ---
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15
) {
  const supabase = await getSupabase();
  const { id } = await params; // Must await params
  const productId = id.trim();

  // Basic UUID validation to prevent database syntax errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(productId)) {
    return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !data) {
    console.error('Supabase fetch error:', error?.message);
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// --- PATCH: Update Product (Admin Only) ---
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await getSupabase();
  const { id } = await params;
  const productId = id.trim();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!['super_admin', 'staff', 'it'].includes(profile?.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Ensure we don't try to update the ID itself
    const { id: _, ...updateData } = body;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Product updated successfully', data });
  } catch (err: any) {
    console.error('PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE: Remove Product (Super Admin Only) ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await getSupabase();
  const { id } = await params;
  const productId = id.trim();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin can delete' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}