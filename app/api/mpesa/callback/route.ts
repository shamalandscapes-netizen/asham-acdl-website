import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const callbackData = payload.Body.stkCallback;
    const resultCode = callbackData.ResultCode;
    const checkoutReqId = callbackData.CheckoutRequestID;

    console.log(`M-Pesa Callback: ${checkoutReqId} - Code: ${resultCode}`);

    // 1. Handle FAILED/CANCELLED Payment
    if (resultCode !== 0) {
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'Cancelled' }) // Matches your DB check constraint
        .eq('checkout_request_id', checkoutReqId);

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Failure Logged' });
    }

    // 2. Handle SUCCESSFUL Payment
    const metaItems = callbackData.CallbackMetadata.Item;
    const receipt = metaItems.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    const phone = metaItems.find((i: any) => i.Name === 'PhoneNumber')?.Value;

    // 3. Update Order to 'Completed'
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ 
        payment_status: 'Completed', // Matches your DB check constraint
        mpesa_receipt: receipt,
        guest_phone: phone?.toString() // Sync phone used for payment
      })
      .eq('checkout_request_id', checkoutReqId);

    if (error) {
      console.error('Database Update Error:', error);
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'DB Sync Error' });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('M-Pesa Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' });
  }
}