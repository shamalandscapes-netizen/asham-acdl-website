import { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// Extract raw row types from the database schema
export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];

/**
 * Defines the possible roles in the application.
 * 'customer' is the default. 'admin' has access to the dashboard.
 */
export type UserRole = 'customer' | 'admin' | 'staff';

/**
 * Represents the full user profile used in the UI.
 * It combines the core user data with optional business details.
 */
export interface UserProfile extends UserRow {
  // Optional business profile data (joined from user_profiles table)
  company_details?: {
    company_name: string | null;
    tax_id: string | null;
  } | null;
}

/**
 * A handy type for the "Session User" that might include custom metadata.
 */
export interface SessionUser extends SupabaseAuthUser {
  // Add any custom claims you might set in your Auth hooks
  app_role?: UserRole; 
}