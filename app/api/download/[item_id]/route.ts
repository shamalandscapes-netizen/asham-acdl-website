import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ item_id: string }> }
) {
  const supabase = await createClient();
  const { item_id } = await params;

  // 1. Get Logged-in User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Verify Order Payment Status
  // We join with the orders table to ensure it belongs to the user and is PAID
  const { data: item, error: itemError } = await supabase
    .from('order_items')
    .select(`
      digital_file_url,
      product_name,
      orders!inner (
        user_id,
        payment_status
      )
    `)
    .eq('id', item_id)
    .single();

  const orderData = item?.orders as any;

  if (itemError || !item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  // 3. Security Checks
  if (orderData.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (orderData.payment_status?.toLowerCase() !== 'paid' && orderData.payment_status?.toLowerCase() !== 'delivered') {
    return NextResponse.json({ error: 'Payment required' }, { status: 402 });
  }

  // 4. Update Download Count (Optional, but good for tracking)
  await supabase.rpc('increment_download_count', { row_id: item_id });

  // 5. Redirect to the signed URL or stream the file
  // If your files are in a private bucket, we generate a signed URL
  const filePath = item.digital_file_url?.split('public/')[1]; // Adjust based on your path structure
  
  if (!filePath) {
    return NextResponse.json({ error: 'File path invalid' }, { status: 500 });
  }

  const { data: signedUrl, error: urlError } = await supabase
    .storage
    .from('blueprints') // Change to your bucket name
    .createSignedUrl(filePath, 60); // URL valid for 60 seconds

  if (urlError || !signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}