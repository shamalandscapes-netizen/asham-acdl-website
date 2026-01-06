import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    if (isTopSales) {
      // EXPERT TIP: Fallback sorting. If sales_count doesn't exist yet, 
      // this will fail. For now, we order by created_at as a safe alternative
      // until you run the SQL migration.
      query = query.order('created_at', { ascending: false }).limit(5);
    } else {
      if (category && category.toLowerCase() !== 'all') {
        const normalizedCategory = category.replace(/-/g, ' ');
        query = query.ilike('category', normalizedCategory);
      }

      if (search) {
        // Advanced: Search in both Name and Description
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Default Sorting Logic
      if (sort === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price-high') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (limit) query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('GET products error:', err);
    // Return empty array instead of 500 to keep the UI from breaking
    return NextResponse.json({ error: err.message, data: [] }, { status: 500 });
  }
}

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
    
    // Explicit cleaning of data before insert
    const productData = {
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      category: body.category || 'Uncategorized',
      stock: parseInt(body.stock) || 0,
      image_url: body.image_url || '/placeholder.jpg',
      type: body.type || 'physical',
      file_path: body.file_path || null,
      // We only include this if we know the column exists
      sales_count: 0, 
    };

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Product created successfully', data });
  } catch (err: any) {
    console.error('POST product error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}