import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure of the M-Pesa API callback body
interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

// Define the structure for transaction details
interface TransactionDetails {
  MpesaReceiptNumber: string;
  TransactionAmount: number;
  PhoneNumber: string;
}

/**
 * Handles the M-Pesa STK Push callback.
 * It validates the request, processes the transaction details, and updates the database.
 * @param request The incoming Next.js API request.
 * @returns A simple 200 OK response required by the Daraja API.
 */
export async function handleMpesaCallback(request: NextRequest) {
  // 1. Initialize Supabase Admin Client (using createServerClient for cookie access)
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
    // 2. Parse the request body
    const body: MpesaCallbackBody = await request.json();
    const stkCallback = body.Body.stkCallback;

    console.log("--- M-Pesa Callback Received ---");
    console.log("CheckoutRequestID:", stkCallback.CheckoutRequestID);
    console.log("ResultCode:", stkCallback.ResultCode);
    
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    let transactionDetails: TransactionDetails | null = null;
    let transactionStatus: 'COMPLETED' | 'FAILED' | 'PENDING' = 'PENDING';

    if (resultCode === 0) {
      // 3. SUCCESSFUL TRANSACTION
      transactionStatus = 'COMPLETED';
      transactionDetails = extractTransactionDetails(stkCallback.CallbackMetadata?.Item);
      console.log("Transaction Details:", transactionDetails);

      // In a real application, you would implement the CartService here
      // and finalize the order (e.g., decrement stock, send email, etc.)
      // const cartService = new CartService();
      // await cartService.finalizeOrder(checkoutRequestID, transactionDetails); 
      
      // Update your 'mpesa_transactions' table
      const { error: updateError } = await supabase
        .from('mpesa_transactions')
        .update({ 
          status: transactionStatus,
          mpesa_receipt_number: transactionDetails.MpesaReceiptNumber,
          transaction_amount: transactionDetails.TransactionAmount,
          final_result_desc: stkCallback.ResultDesc,
        })
        .eq('checkout_request_id', checkoutRequestID);

      if (updateError) {
        console.error("Supabase error updating successful transaction:", updateError);
        // CRITICAL: Log this error to Sentry/monitoring!
      }

    } else {
      // 4. FAILED / CANCELLED TRANSACTION
      transactionStatus = 'FAILED';
      console.log("Transaction FAILED. Reason:", stkCallback.ResultDesc);

      // Update your 'mpesa_transactions' table
      const { error: updateError } = await supabase
        .from('mpesa_transactions')
        .update({ 
          status: transactionStatus,
          result_code: resultCode,
          final_result_desc: stkCallback.ResultDesc,
        })
        .eq('checkout_request_id', checkoutRequestID);

      if (updateError) {
        console.error("Supabase error updating failed transaction:", updateError);
      }
    }

    // 5. IMPORTANT: Daraja API requires a 200 OK response, regardless of transaction success
    return NextResponse.json({ message: "Callback processed successfully" }, { status: 200 });

  } catch (e) {
    console.error("Error processing M-Pesa callback:", e);
    // Send 200 OK response to Daraja to avoid multiple retries, but log the error internally.
    return NextResponse.json({ message: "Internal server error while processing callback" }, { status: 200 });
  }
}

/**
 * Helper function to extract key transaction details from the cryptic Daraja metadata.
 */
function extractTransactionDetails(metadata?: MpesaCallbackBody['Body']['stkCallback']['CallbackMetadata']['Item']): TransactionDetails | null {
  if (!metadata) return null;

  let details: Partial<TransactionDetails> = {};

  metadata.forEach(item => {
    switch (item.Name) {
      case 'MpesaReceiptNumber':
        details.MpesaReceiptNumber = String(item.Value);
        break;
      case 'Amount':
        details.TransactionAmount = Number(item.Value);
        break;
      case 'PhoneNumber':
        details.PhoneNumber = String(item.Value);
        break;
      default:
        break;
    }
  });

  // Ensure all required fields are present
  if (details.MpesaReceiptNumber && details.TransactionAmount && details.PhoneNumber) {
    return details as TransactionDetails;
  }
  return null;
}