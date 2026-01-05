import { NextRequest, NextResponse } from 'next/server';
import { MpesaClient } from './client'; // Import the client class we just defined
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Define the expected request body from the client
interface StkPushRequestBody {
  amount: number;
  phoneNumber: string;
  reference: string;
  orderId: string; // The ID of the order being paid for
}

/**
 * Handles the STK Push initiation requested by the client.
 * 1. Initializes the MpesaClient.
 * 2. Calls the Daraja API to trigger the STK Push.
 * 3. Records the transaction details in a 'mpesa_transactions' table for status tracking.
 * @param request The incoming Next.js API request containing payment details.
 * @returns A JSON response containing the M-Pesa initiation details or an error.
 */
export async function handleStkPushInitiation(request: NextRequest) {
  // 1. Initialize Supabase Admin Client
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );

  try {
    const { 
      amount, 
      phoneNumber, 
      reference, 
      orderId 
    }: StkPushRequestBody = await request.json();

    // Basic Input Validation
    if (!amount || amount <= 0 || !phoneNumber || !orderId) {
      return NextResponse.json(
        { message: 'Missing amount, phone number, or order ID.' },
        { status: 400 }
      );
    }
    
    // Ensure phone number is in the correct format (2547XXXXXXXX)
    if (!phoneNumber.startsWith('2547') || phoneNumber.length !== 12) {
      return NextResponse.json(
        { message: 'Phone number must be in the format 2547XXXXXXXX.' },
        { status: 400 }
      );
    }

    // 2. Initialize M-Pesa client
    const mpesaClient = new MpesaClient(process.env.NODE_ENV === 'production');

    // 3. Initiate STK Push via Daraja API
    const darajaResponse = await mpesaClient.stkPush(
      amount,
      phoneNumber,
      reference // Use the order reference
    );

    // 4. Handle Daraja API Success (Transaction initiated successfully)
    if (darajaResponse.ResponseCode === '0') {
      
      // 5. Record the pending transaction in your database
      // This allows you to track the transaction status using the Callback URL
      const { error: dbError } = await supabase
        .from('mpesa_transactions')
        .insert({
          order_id: orderId,
          checkout_request_id: darajaResponse.CheckoutRequestID,
          merchant_request_id: darajaResponse.MerchantRequestID,
          amount: amount,
          phone_number: phoneNumber,
          status: 'PENDING',
          initial_response_code: darajaResponse.ResponseCode,
          initial_response_desc: darajaResponse.ResponseDescription,
        });

      if (dbError) {
        console.error('Supabase error recording M-Pesa transaction:', dbError);
        // CRITICAL: Despite DB error, the STK push was sent. We return success to client
        // but log this internally.
      }

      // Return the successful initiation details to the client
      return NextResponse.json({
        CheckoutRequestID: darajaResponse.CheckoutRequestID,
        CustomerMessage: darajaResponse.CustomerMessage,
        ResponseCode: darajaResponse.ResponseCode,
      }, { status: 200 });

    } else {
      // 6. Handle Daraja API Failure (Request failed before reaching the phone)
      console.error('M-Pesa Initiation Failed:', darajaResponse);
      return NextResponse.json(
        { 
          message: darajaResponse.ResponseDescription || 'M-Pesa service is temporarily unavailable.', 
          error_code: darajaResponse.errorCode 
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Fatal error during STK Push initiation:', error);
    return NextResponse.json(
      { message: 'Internal Server Error during payment initiation.' }, 
      { status: 500 }
    );
  }
}