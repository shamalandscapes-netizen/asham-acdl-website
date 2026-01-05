// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'; // Import createClient directly
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = createClient(); // No await needed - createClient() is synchronous
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}