import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * app/api/products/[identifier]/route.ts
 */

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- GET: Fetch Product by ID / Slug / Category ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const supabase = await createClient();
  const { identifier } = await params;
  const value = identifier.trim();

  try {
    // 1. Check if it's UUID → search by ID
    if (uuidRegex.test(value)) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', value)
        .single();

      if (data) return NextResponse.json(data);
    }

    // 2. Search by slug
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('slug', value)
      .single();

    if (product) return NextResponse.json(product);

    // 3. Search by category
    const { data: categoryItems } = await supabase
      .from('products')
      .select('*')
      .eq('category', value);

    if (categoryItems && categoryItems.length > 0) {
      return NextResponse.json({ isCategory: true, items: categoryItems });
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (err: any) {
    console.error('GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PATCH: Update Product (Admin Only) ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const supabase = await createClient();
  const { identifier } = await params;
  const productId = identifier.trim();

  if (!uuidRegex.test(productId)) {
    return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    const allowedRoles = ['super_admin', 'admin', 'staff', 'it'];

    if (!profile || !allowedRoles.includes(profile.user_type)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id: _, ...updateData } = body;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Product updated successfully',
      data,
    });
  } catch (err: any) {
    console.error('PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE: Remove Product (Super Admin Only) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const supabase = await createClient();
  const { identifier } = await params;
  const productId = identifier.trim();

  if (!uuidRegex.test(productId)) {
    return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'super_admin') {
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

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}