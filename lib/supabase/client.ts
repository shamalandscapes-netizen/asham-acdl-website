import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types'; // Import your generated types

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing from environment variables.');
  }

  // Add <Database> here to enable type safety and autocomplete
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}