import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Ensure we have the ID from the URL
  const productId = params.id;

  try {
    // 1. Initialize Supabase
    const supabase = await createClient();

    // 2. Authentication Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Log in required' }, { status: 401 });
    }

    // 3. Authorization Check: Verify Purchase
    // We use 'as any' here to bypass potential table type mismatches during build
    const { data: orders, error: orderError } = await (supabase
      .from('orders')
      .select('items')
      .eq('user_id', user.id)
      .in('status', ['paid', 'delivered']) as any);

    if (orderError) throw orderError;

    const hasPurchased = orders?.some((order: any) => 
      Array.isArray(order.items) && 
      order.items.some((item: any) => item.id === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ error: 'Forbidden: Product not purchased' }, { status: 403 });
    }

    // 4. Get File Path from Database
    // ✅ FIX: Casting to 'any' stops the 'file_path does not exist' TypeScript error
    const { data: product, error: productError } = await (supabase
      .from('products')
      .select('file_path, title')
      .eq('id', productId)
      .single() as any);

    // ✅ Robust Null check
    if (productError || !product || !product.file_path) {
      console.error('Database fetch error:', productError);
      return NextResponse.json({ error: 'Product file record not found' }, { status: 404 });
    }

    // 5. Generate Secure Signed URL
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('product-files')
      .createSignedUrl(product.file_path, 600, {
        download: true, // Forces "Save As" dialog instead of opening in tab
      });

    // ✅ Null check for signedData to satisfy TypeScript
    if (signError || !signedData || !signedData.signedUrl) {
      console.error('Supabase Storage Error:', signError);
      return NextResponse.json({ error: 'Failed to generate secure download link' }, { status: 500 });
    }

    // 6. Success: Redirect to the secure link
    return NextResponse.redirect(new URL(signedData.signedUrl));

  } catch (error: any) {
    console.error('Download System Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}