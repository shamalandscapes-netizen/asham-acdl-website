import { NextResponse } from 'next/server';
import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // 1. Extract dynamic data from the frontend request
    const { amount, productId, email } = await req.json();

    // Basic validation to prevent IntaSend rejection
    if (!email || !amount || !productId) {
      return NextResponse.json({ error: "Missing required checkout data" }, { status: 400 });
    }

    // 2. Initialize Supabase Server Client
    const supabaseClient = await createClient();
    const supabase = supabaseClient as any;

    console.log(`🚀 Processing checkout for ${email} - KES ${amount}`);

    // 3. Create a 'pending' purchase record
    const { data: purchase, error: dbError } = await supabase
      .from('purchases')
      .insert({
        amount: amount,
        product_id: productId,
        status: 'pending',
        customer_email: email, // ✅ Dynamic email from user input
      })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase Error:", dbError.message);
      return NextResponse.json({ error: "Failed to create order record" }, { status: 500 });
    }

    // 4. Request IntaSend Checkout
    // Using your ngrok URL from .env.local for the redirect_url
    const intasendResponse = await fetch("https://payment.intasend.com/api/v1/checkout/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.INTASEND_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        public_key: process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY,
        amount: amount,
        currency: "KES",
        email: email, // ✅ Dynamic email
        api_ref: purchase.id, 
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/success?id=${productId}`,
      })
    });

    const data = await intasendResponse.json();

    if (!intasendResponse.ok) {
      // ✅ This log in your VS Code terminal will now show the EXACT reason
      console.error("IntaSend API Error Detail:", data);
      return NextResponse.json({ 
        error: "Payment gateway rejected request", 
        details: data 
      }, { status: 400 });
    }

    // 5. Update record with tracking ID
    await supabase
      .from('purchases')
      .update({ invoice_id: data.id }) 
      .eq('id', purchase.id);

    console.log("✅ IntaSend URL generated successfully");
    return NextResponse.json({ url: data.url });

  } catch (error: any) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
