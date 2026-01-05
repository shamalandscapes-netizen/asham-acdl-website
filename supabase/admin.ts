import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types'; // Adjust path if your types are in lib/supabase/types.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env.local file.'
  );
}

/**
 * Admin Supabase Client (Bypasses RLS).
 * Use this for:
 * - Creating users securely
 * - handling webhooks (M-Pesa, Stripe)
 * - Generating signed URLs for digital products
 * - Managing database records without user restrictions
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});