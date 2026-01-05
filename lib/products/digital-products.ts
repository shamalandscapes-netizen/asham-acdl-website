import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

// Configuration for the Supabase Storage Bucket where digital files are kept
const DIGITAL_BUCKET = 'digital_downloads';
const DOWNLOAD_EXPIRY_SECONDS = 3600; // 1 hour expiry for the signed URL

/**
 * Service class for handling digital product access and download links.
 */
export class DigitalProductService {
  private supabase;

  constructor() {
    // Initialize server-side Supabase client with cookie context
    const cookieStore = cookies();
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
        },
      }
    );
  }

  /**
   * Fetches the secure, time-limited download URL for a digital product file.
   * This URL can only be generated on the server using the service role key or through
   * a secure server-side client.
   * * @param filePath The path to the file within the 'digital_downloads' bucket.
   * @returns A promise that resolves to the signed download URL (string).
   */
  async getSignedDownloadUrl(filePath: string): Promise<string> {
    
    // NOTE: For true security, you should use the Supabase Admin/Service Role Key
    // to initialize the client here, NOT the anon key, as the download bucket should
    // have Row Level Security (RLS) policies set to restrict public access.
    
    const { data, error } = await this.supabase.storage
      .from(DIGITAL_BUCKET)
      .createSignedUrl(filePath, DOWNLOAD_EXPIRY_SECONDS);

    if (error) {
      console.error("Supabase Storage error creating signed URL:", error);
      throw new Error("Failed to generate secure download link.");
    }

    return data.signedUrl;
  }
  
  /**
   * Checks if the authenticated user is authorized to download a specific product.
   * This involves checking your 'user_downloads' or 'orders' table.
   * * @param userId The ID of the currently logged-in user.
   * @param productId The ID of the digital product.
   * @returns A promise that resolves to true if authorized, false otherwise.
   */
  async checkAuthorization(userId: string, productId: string): Promise<boolean> {
    
    // This query assumes a join table or view that links user_id to product_id
    const { count, error } = await this.supabase
      .from('user_downloads')
      .select('id', { count: 'exact', head: true }) // Fast count check
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error("Authorization check failed:", error);
      // Fail safe: assume not authorized on error
      return false;
    }

    // If count > 0, the user has a record indicating ownership/purchase
    return (count || 0) > 0;
  }
}
