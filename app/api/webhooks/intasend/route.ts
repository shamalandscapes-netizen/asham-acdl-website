import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Security Check
    // We check both the Header and the Body for the challenge string
    const challengeHeader = req.headers.get('intasend-challenge');
    const challengeBody = body.challenge; 
    const secretChallenge = process.env.INTASEND_WEBHOOK_CHALLENGE;

    const isAuthorized = challengeHeader === secretChallenge || challengeBody === secretChallenge;

    if (!isAuthorized) {
      console.error("❌ Webhook Unauthorized: Challenge mismatch");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Process 'COMPLETE' status
    if (body.state === 'COMPLETE') {
      console.log(`Processing successful payment for Invoice: ${body.invoice_id}`);

      // ✅ BYPASS TYPESCRIPT ERROR: Use 'as any' to ignore table name checks
      const supabaseClient = await createClient();
      const supabase = supabaseClient as any;
      
      // 3. Update the purchase record
      const { error } = await supabase
        .from('purchases')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString(),
          gateway_response: body 
        })
        .eq('invoice_id', body.invoice_id);

      if (error) {
        console.error("❌ Database update failed:", error.message);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`✅ Database updated successfully for ${body.invoice_id}`);
    } else {
      console.log(`ℹ️ Webhook received with state: ${body.state}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Webhook Handler Error:", err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
