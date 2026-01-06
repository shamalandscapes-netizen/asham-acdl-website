// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 1. Determine where to go after logic is done
  let next = searchParams.get('next') || searchParams.get('redirect') || '/dashboard';
  
  // Security: Prevent Open Redirect attacks
  if (next.startsWith('http')) {
    next = '/dashboard';
  }

  if (code) {
    const supabase = await createClient(); // Await if using the newer Supabase SSR helper
    
    // 2. Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;

      // 3. EXPERT ADDITION: Handle Password Reset Flow
      // If the URL contains a recovery type, force redirect to the password update page
      const isRecovery = searchParams.get('type') === 'recovery';
      if (isRecovery) {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }

      // 4. EXPERT ADDITION: Role-Based Routing
      // We check the user metadata we set up during registration
      const role = user.user_metadata?.role || 'customer';
      const isAdmin = ['super_admin', 'admin', 'accounts', 'staff', 'it'].includes(role);

      // If they were headed to /dashboard but are an admin, correct the path
      if (isAdmin && next === '/dashboard') {
        next = '/admin';
      }

      // 5. Success: Redirect to the final destination
      // We use a "refresh" redirect to ensure the cookies are set properly in the browser
      const response = NextResponse.redirect(`${origin}${next}`);
      
      // Optional: You can trigger a cookie refresh here if needed for specific middleware
      return response;
    }

    console.error('Auth Callback Error:', error?.message);
  }

  // 6. Detailed Error Handling
  // We send the user back to login with a specific error code so the UI can show a helpful message
  return NextResponse.redirect(`${origin}/login?error=verification-failed`);
}