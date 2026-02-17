import { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// FIX: Use 'profiles' as the source for your user data since 'users' doesn't exist
export type UserProfileRow = Database['public']['Tables']['profiles']['Row'];

export type UserRole = 'customer' | 'admin' | 'staff';

/**
 * We map UserProfile to the profiles table.
 * Note: Check if company_details actually exists as a JSON column 
 * in your 'profiles' table in Supabase.
 */
export interface UserProfile extends UserProfileRow {
  company_details?: {
    company_name: string | null;
    tax_id: string | null;
  } | null;
}

export interface SessionUser extends SupabaseAuthUser {
  app_role?: UserRole; 
}