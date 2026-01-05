import { createClient } from '@supabase/supabase-js';

// Environment variables are required for the admin client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // The secret admin key

/**
 * Creates and returns a Supabase client instance with the Service Role Key.
 * * IMPORTANT: This client has full administrative access and bypasses all
 * Row-Level Security (RLS) policies. It must ONLY be used on the server
 * (e.g., in Next.js API routes or Server Actions) and NEVER exposed to the client.
 * * @returns A Supabase client with admin privileges.
 */
export const createAdminClient = () => {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('Supabase URL or Service Role Key is not set in environment variables.');
  }

  // The second argument must be the Service Role Key (not the public Anon Key)
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      persistSession: false, // Ensure no session is stored, as this is for server-to-server calls
    },
  });
};

// Example usage:
// import { createAdminClient } from '@/lib/supabase/admin';
// const adminSupabase = createAdminClient();
// const { data, error } = await adminSupabase.from('users').select('*'); // Bypasses RLS