import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await response.json();
  if (!data.access_token) throw new Error('Failed to get M-Pesa access token');
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    // FIX: Match the 'phone' key sent by your frontend
    const { phone, amount, orderId } = await request.json();

    // Validate using the correct variable name
    if (!phone || !amount || !orderId) {
      return NextResponse.json({ 
        error: `Missing data: phone(${!!phone}), amount(${!!amount}), id(${!!orderId})` 
      }, { status: 400 });
    }

    // Format Phone Number to 254...
    let formattedPhone = phone.toString().replace(/^(?:\+254|254|0)/, '254');

    const shortCode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    
    // Generate Timestamp
    const date = new Date();
    const timestamp = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0');

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const accessToken = await getAccessToken();
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`;

    // Send to Safaricom
    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.floor(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: 'Asham Ltd',
        TransactionDesc: `Order #${orderId.slice(0, 5)}`
      }),
    });

    const stkData = await stkResponse.json();

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json({ error: stkData.CustomerMessage || 'STK Push Failed' }, { status: 400 });
    }

    // Update Supabase using Service Role (Bypasses RLS)
    await supabaseAdmin
      .from('orders')
      .update({ 
        checkout_request_id: stkData.CheckoutRequestID,
        payment_status: 'Pending' // Match your DB constraint
      })
      .eq('id', orderId);

    return NextResponse.json({ 
      message: 'STK Push sent successfully', 
      checkoutRequestID: stkData.CheckoutRequestID 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
