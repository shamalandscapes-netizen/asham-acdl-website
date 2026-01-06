import { Buffer } from 'buffer';
import { format } from 'date-fns';

// Configuration from environment variables
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!; // e.g., https://yourdomain.com/api/mpesa/callback

const DARASA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use this for testing
// const LIVE_BASE_URL = 'https://api.safaricom.co.ke'; // Use this for production

/**
 * MpesaClient class to handle Daraja API authentication and STK Push requests.
 */
export class MpesaClient {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;
  private baseUrl: string;

  constructor(isProduction: boolean = false) {
    this.baseUrl = isProduction ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    
    if (!CONSUMER_KEY || !CONSUMER_SECRET || !PASSKEY || !SHORTCODE || !CALLBACK_URL) {
      console.error("M-Pesa environment variables are missing!");
      throw new Error("M-Pesa configuration error: Check environment variables.");
    }
  }

  /**
   * Generates the Daraja API access token using Basic Authentication.
   * Caches the token to avoid repeated authentication calls.
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    // Check if the token is still valid (refresh 1 minute before expiry)
    if (MpesaClient.accessToken && MpesaClient.tokenExpiry > now + 60000) {
      return MpesaClient.accessToken;
    }

    const authString = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
    const base64Auth = Buffer.from(authString).toString('base64');

    try {
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${base64Auth}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      
      MpesaClient.accessToken = data.access_token;
      // Expiry is typically 3600 seconds (1 hour)
      MpesaClient.tokenExpiry = now + (data.expires_in * 1000); 

      return MpesaClient.accessToken!;

    } catch (error) {
      console.error('Error fetching M-Pesa access token:', error);
      throw new Error('Failed to connect to Daraja API for authentication.');
    }
  }
  
  /**
   * Generates the timestamp and encrypted password (Base64 of Shortcode + Passkey + Timestamp).
   * This is required for the secure STK Push initiation.
   */
  private generatePassword(timestamp: string): { timestamp: string, password: string } {
    const rawPassword = SHORTCODE + PASSKEY + timestamp;
    const password = Buffer.from(rawPassword).toString('base64');
    return { timestamp, password };
  }

  /**
   * Initiates the M-Pesa STK Push payment request.
   * @param amount The amount to be paid (must be an integer).
   * @param phoneNumber The customer's M-Pesa number (format 2547...).
   * @param reference A unique transaction ID (e.g., your order ID).
   */
  public async stkPush(
    amount: number,
    phoneNumber: string,
    reference: string = 'ASCDL_ORDER'
  ): Promise<any> {
    const accessToken = await this.getAccessToken();
    const timestamp = format(new Date(), 'yyyyMMddHHmmss'); // YYYYMMDDHHmmss
    const { password } = this.generatePassword(timestamp);

    const apiEndpoint = `${this.baseUrl}/mpesa/stkpush/v1/processrequest`;
    
    // The account reference used for reconciliation
    const accountReference = reference; 
    // The transaction description
    const transactionDesc = `Payment for ${reference}`;

    const body = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline', // Or 'CustomerBuyGoodsOnline' if using a Till number
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API non-200 responses (e.g., authentication failure, invalid JSON)
        console.error("STK Push API Error:", data);
        throw new Error(data.errorMessage || 'M-Pesa STK Push API failed to process request.');
      }
      
      return data; // Contains CheckoutRequestID, ResponseCode, etc.

    } catch (error) {
      console.error('Error during STK Push:', error);
      throw new Error('Could not initiate M-Pesa payment.');
    }
  }

  /**
   * Placeholder for querying transaction status (useful for polling).
   */
  public async queryTransactionStatus(checkoutRequestID: string) {
      // Logic for /mpesa/stkpushquery/v1/query, using the same password/timestamp generation
      // Not implemented here but would follow a similar pattern to stkPush
      console.log(`Querying status for: ${checkoutRequestID}`);
  }
}