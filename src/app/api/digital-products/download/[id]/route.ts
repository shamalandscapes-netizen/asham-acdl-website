import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Params is now a Promise in Next.js 16
) {
  // 1. Await the params to get the ID
  const { id: productId } = await params;

  try {
    // 2. Initialize Supabase
    const supabase = await createClient();

    // 3. Authentication Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Log in required' }, { status: 401 });
    }

    // 4. Authorization Check: Verify Purchase
    // Note: Ensure your 'orders' table uses 'customer_id' or 'user_id' consistently
    const { data: orders, error: orderError } = await (supabase
      .from('orders')
      .select('items')
      .eq('customer_id', user.id) // Changed to customer_id to match your previous route logic
      .in('status', ['paid', 'delivered']) as any);

    if (orderError) throw orderError;

    const hasPurchased = orders?.some((order: any) => 
      Array.isArray(order.items) && 
      order.items.some((item: any) => item.id === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ error: 'Forbidden: Product not purchased' }, { status: 403 });
    }

    // 5. Get File Path from Database
    const { data: product, error: productError } = await (supabase
      .from('products')
      .select('file_path, name') // Changed 'title' to 'name' based on your previous product schema
      .eq('id', productId)
      .single() as any);

    if (productError || !product || !product.file_path) {
      console.error('Database fetch error:', productError);
      return NextResponse.json({ error: 'Product file record not found' }, { status: 404 });
    }

    // 6. Generate Secure Signed URL (Expires in 10 minutes)
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(product.file_path, 600, {
        download: true,
      });

    if (signError || !signedData || !signedData.signedUrl) {
      console.error('Supabase Storage Error:', signError);
      return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
    }

    // 7. Success: Redirect to the secure link
    return NextResponse.redirect(new URL(signedData.signedUrl));

  } catch (error: any) {
    console.error('Download System Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}