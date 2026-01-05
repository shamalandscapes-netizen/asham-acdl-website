import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// --- Helper: create Supabase Client ---
function getSupabase() {
  const cookieStore = cookies();
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

// --- GET: Fetch All Products ---
export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit');
  const sort = searchParams.get('sort');
  const isTopSales = searchParams.get('top_sales') === 'true';

  try {
    let query = supabase.from('products').select('*');

    // Top sales
    if (isTopSales) {
      query = query.order('sales_count', { ascending: false }).limit(5);
    } else {
      // Category filter: normalize slug to name & case-insensitive
      if (category && category.toLowerCase() !== 'all') {
        const normalizedCategory = category.replace(/-/g, ' ');
        query = query.ilike('category', normalizedCategory);
      }

      // Search filter
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Sorting
      if (sort === 'price-low') query = query.order('price', { ascending: true });
      else if (sort === 'price-high') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      // Limit
      if (limit) query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('GET products error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST: Create Product (Admin Only) ---
export async function POST(request: Request) {
  const supabase = getSupabase();
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
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description || '',
        price: parseFloat(body.price),
        category: body.category || 'Uncategorized',
        stock: parseInt(body.stock) || 0,
        image_url: body.image_url || '/placeholder.jpg',
        type: body.type || 'physical',
        file_path: body.file_path || null,
        sales_count: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Product created successfully', data });
  } catch (err: any) {
    console.error('POST product error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
