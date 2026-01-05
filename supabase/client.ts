import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/supabase/types'; // Ensure this points to where you saved your types

/**
 * Creates a Supabase client for use in the Browser (Client Components).
 * Use this in:
 * - useEffect() hooks
 * - Event handlers (onClick, onSubmit)
 * - Real-time subscriptions
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}