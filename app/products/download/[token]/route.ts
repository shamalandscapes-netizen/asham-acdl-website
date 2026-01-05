import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const productId = params.token; // We treat the URL parameter as the Product ID
  const cookieStore = cookies();

  // 1. Initialize Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; }
      }
    }
  );

  try {
    // 2. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // If not logged in, redirect to login page with return URL
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Verify Purchase (Security Check)
    // Scan user's PAID orders to see if this product ID exists in the items list
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('items')
      .eq('user_id', user.id)
      .in('status', ['paid', 'delivered', 'shipped']);

    if (orderError) throw orderError;

    // Check if the product is in any of the order item arrays
    const hasPurchased = orders?.some((order) => 
      Array.isArray(order.items) && 
      order.items.some((item: any) => (item.id === productId || item.product_id === productId))
    );

    // *Allow Admin Override* (Optional: Admins can download anything)
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    const isAdmin = ['super_admin', 'staff'].includes(profile?.role);

    if (!hasPurchased && !isAdmin) {
      return NextResponse.json(
        { error: 'Access Denied: You have not purchased this item.' }, 
        { status: 403 }
      );
    }

    // 4. Get File Path from Database
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('file_path')
      .eq('id', productId)
      .single();

    if (productError || !product?.file_path) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    // 5. Generate Secure Signed URL (Valid for 15 minutes)
    // This hides the actual bucket path from the user
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('product-files') // Make sure your bucket name matches this
      .createSignedUrl(product.file_path, 900); // 900 seconds = 15 mins

    if (signError || !signedData) {
      throw new Error('Could not generate download link.');
    }

    // 6. Redirect to the File
    return NextResponse.redirect(signedData.signedUrl);

  } catch (error: any) {
    console.error('Download Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}