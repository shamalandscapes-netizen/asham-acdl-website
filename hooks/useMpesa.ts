'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Define the shape of the successful response from your API
interface MpesaInitiationResponse {
  CheckoutRequestID: string;
  CustomerMessage: string;
  ResponseCode: string;
}

/**
 * Hook to handle M-Pesa STK Push payment initiation and status checking.
 */
export const useMpesa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);

  /**
   * Initiates the M-Pesa STK Push via a Next.js API endpoint.
   * @param amount The total amount to be charged.
   * @param phoneNumber The M-Pesa registered phone number (format 2547...).
   * @param reference An optional unique reference for the transaction (e.g., order ID).
   */
  const initiateMpesaPayment = useCallback(async (
    amount: number, 
    phoneNumber: string, 
    reference: string = 'ASCDL_PAYMENT'
  ) => {
    setIsLoading(true);
    setError(null);
    setCheckoutRequestID(null);

    // 1. Validate inputs
    if (amount <= 0 || !phoneNumber.match(/^2547\d{8}$/)) {
      setError("Invalid amount or phone number format. Phone must be 2547xxxxxxx.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call the Next.js API route for M-Pesa payment initiation
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.ceil(amount), // M-Pesa requires integer amount
          phoneNumber,
          reference,
        }),
      });

      if (!response.ok) {
        // Handle server-side errors (e.g., invalid token, Daraja API failure)
        const errData = await response.json();
        throw new Error(errData.message || 'Payment initiation failed on the server.');
      }

      const data: MpesaInitiationResponse = await response.json();

      if (data.ResponseCode === '0') {
        // Success response from Daraja API via your server
        setCheckoutRequestID(data.CheckoutRequestID);
        toast.success(
          `STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN.`, 
          { duration: 8000 }
        );

        // Optionally, start monitoring the transaction status here
        // startMpesaStatusCheck(data.CheckoutRequestID); 
        
      } else {
        // Handle specific Daraja API error codes
        throw new Error(data.CustomerMessage || 'M-Pesa transaction failed to initiate.');
      }

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'An unexpected error occurred during M-Pesa payment.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Placeholder function for checking transaction status.
   * In a real application, this would poll a server endpoint.
   */
  const startMpesaStatusCheck = useCallback((checkoutID: string) => {
    // This is where you would typically poll an API route like /api/mpesa/status?id=checkoutID
    // For simplicity, we'll just log the initiation here.
    console.log(`Starting M-Pesa status check for CheckoutRequestID: ${checkoutID}`);
    // You would use setInterval here until the status is COMPLETE or FAILED.
  }, []);


  return {
    isLoading,
    error,
    checkoutRequestID,
    initiateMpesaPayment,
    // Add other methods like checkPaymentStatus, or use Supabase subscriptions
  };
};