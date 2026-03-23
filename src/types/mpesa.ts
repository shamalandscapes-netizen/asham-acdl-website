/**
 * The standard response returned immediately after initiating an STK Push.
 * Note: This does NOT mean payment is complete, only that the prompt was sent.
 */
export interface MpesaStkResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string; // IMPORTANT: Save this to your 'orders' table to link the callback later
  ResponseCode: string;      // "0" means success
  ResponseDescription: string;
  CustomerMessage: string;
}

/**
 * The structure of the Data sent by Safaricom to your callback URL
 * after the user enters their PIN (or cancels).
 */
export interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string; // Use this to find the order in your DB
      ResultCode: number;        // 0 = Success, 1032 = Cancelled, etc.
      ResultDesc: string;
      CallbackMetadata?: {       // Only present if ResultCode === 0
        Item: MpesaCallbackItem[];
      };
    };
  };
}

/**
 * Individual data items inside the Callback Metadata.
 * Common Names: Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber
 */
export interface MpesaCallbackItem {
  Name: string;
  Value?: string | number;
}

/**
 * Helper interface to map the raw array items into a clean object
 * for easier use in your API logic.
 */
export interface ProcessedMpesaResult {
  success: boolean;
  orderId?: string; // Derived from metadata or CheckoutRequestID
  receipt?: string;
  amount?: number;
  phone?: string;
  date?: string;
  error?: string;
}

// --- Enum for common Result Codes ---
export enum MpesaResultCode {
  SUCCESS = 0,
  INSUFFICIENT_FUNDS = 1,
  LESS_THAN_MINIMUM = 4,
  MORE_THAN_MAXIMUM = 5,
  CANCELLED_BY_USER = 1032,
  TIMEOUT = 1037, // User didn't enter PIN in time
}