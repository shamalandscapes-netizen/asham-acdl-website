import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';
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
  // FIX: Cast supabase as any. We define a temporary interface for the join result.
  const { data: item, error: itemError } = await (supabase as any)
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

  if (itemError || !item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  // Explicitly cast the item to access nested join data safely
  const itemData = item as {
    digital_file_url: string;
    product_name: string;
    orders: {
      user_id: string;
      payment_status: string;
    };
  };

  const orderData = itemData.orders;

  // 3. Security Checks
  if (orderData.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const status = orderData.payment_status?.toLowerCase();
  if (status !== 'paid' && status !== 'delivered') {
    return NextResponse.json({ error: 'Payment required' }, { status: 402 });
  }

  // 4. Update Download Count (Optional)
  // FIX: Cast supabase as any for RPC calls as well
  await (supabase as any).rpc('increment_download_count', { row_id: item_id });

  // 5. Redirect to the signed URL
  // We extract the filename from the URL. 
  // If your URL is '.../public/blueprints/file.pdf', this gets 'file.pdf'
  const filePath = itemData.digital_file_url?.split('/').pop(); 
  
  if (!filePath) {
    return NextResponse.json({ error: 'File path invalid' }, { status: 500 });
  }

  const { data: signedUrl, error: urlError } = await supabase
    .storage
    .from('blueprints') 
    .createSignedUrl(filePath, 60); 

  if (urlError || !signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 });
  }

  return NextResponse.redirect(signedUrl.signedUrl);
}