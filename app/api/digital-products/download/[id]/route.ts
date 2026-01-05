import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Setup Supabase Client
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; }
      }
    }
  );

  const productId = params.id;

  try {
    // 2. Authentication Check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in.' }, { status: 401 });
    }

    // 3. Authorization Check: Did they buy it?
    // We look for any order that is PAID/DELIVERED and belongs to this user
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('items')
      .eq('user_id', user.id)
      .in('status', ['paid', 'delivered', 'shipped']);

    if (orderError) throw orderError;

    // Check if the product ID exists inside any of the order's "items" JSON arrays
    const hasPurchased = orders?.some((order) => 
      Array.isArray(order.items) && 
      order.items.some((item: any) => item.id === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ error: 'Forbidden: You have not purchased this item.' }, { status: 403 });
    }

    // 4. Get the File Path from the Product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('file_path')
      .eq('id', productId)
      .single();

    if (productError || !product?.file_path) {
      return NextResponse.json({ error: 'File not found for this product.' }, { status: 404 });
    }

    // 5. Generate a Temporary Signed URL (Valid for 10 minutes)
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(product.file_path, 600); 

    if (signError || !signedData) {
      throw new Error('Could not generate secure link.');
    }

    // 6. Redirect the user to the actual file
    return NextResponse.redirect(signedData.signedUrl);

  } catch (error: any) {
    console.error('Download Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}