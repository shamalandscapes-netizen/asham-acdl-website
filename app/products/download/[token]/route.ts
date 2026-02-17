import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> } // FIX: Params is now a Promise
) {
  // 1. Await params and initialize Supabase
  const { token: productId } = await params; 
  const supabase = await createClient();

  try {
    // 2. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Verify Purchase (Security Check)
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('items')
      .eq('customer_id', user.id) // Changed to customer_id to match your main schema
      .in('status', ['paid', 'delivered', 'shipped']);

    if (orderError) throw orderError;

    const hasPurchased = orders?.some((order) => 
      Array.isArray(order.items) && 
      order.items.some((item: any) => (item.id === productId || item.product_id === productId))
    );

    // *Allow Admin Override*
    const { data: profile } = await supabase
      .from('profiles') // Changed to profiles to match your standard table
      .select('user_type') 
      .eq('id', user.id)
      .single();
      
    const isAdmin = ['super_admin', 'staff'].includes(profile?.user_type);

    if (!hasPurchased && !isAdmin) {
      return NextResponse.json(
        { error: 'Access Denied: You have not purchased this item.' }, 
        { status: 403 }
      );
    }

    // 4. Get File Path from Database
    const { data: product, error: productError } = await (supabase
      .from('products')
      .select('file_path')
      .eq('id', productId)
      .single() as any);

    if (productError || !product?.file_path) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    // 5. Generate Secure Signed URL (Valid for 15 minutes)
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(product.file_path, 900);

    if (signError || !signedData) {
      throw new Error('Could not generate download link.');
    }

    // 6. Redirect to the File
    return NextResponse.redirect(new URL(signedData.signedUrl));

  } catch (error: any) {
    console.error('Download Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}