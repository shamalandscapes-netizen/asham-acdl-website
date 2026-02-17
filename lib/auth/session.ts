'use client';

import { createClient } from '@/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Define a type for the data returned by this function
export type AuthSession = {
  user: User | null;
  session: Session | null;
};

/**
 * Retrieves the current Supabase authentication session and user data.
 * This is primarily used in client-side components to determine login status.
 * @returns An object containing the current user and session, or null if unauthenticated.
 */
export async function getClientSession(): Promise<AuthSession> {
  const supabase = createClient();

  try {
    const { 
      data: { session }, 
      error: sessionError 
    } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error retrieving session:", sessionError);
      return { user: null, session: null };
    }

    // Supabase will automatically return the user object if a session exists
    if (session) {
      return {
        user: session.user,
        session: session,
      };
    }
    
    // Fallback/No Session
    return { user: null, session: null };
    
  } catch (e) {
    console.error("Unexpected error in getClientSession:", e);
    return { user: null, session: null };
  }
}

/**
 * Checks if a user is currently logged in.
 * @returns true if the user is authenticated, false otherwise.
 */
export async function isAuthenticated(): Promise<boolean> {
  const sessionData = await getClientSession();
  return !!sessionData.user;
}