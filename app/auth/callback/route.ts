// app/auth/callback/route.ts
import { createServer as createClient } from '@/lib/supabase/server'; // Alias it here
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = await createClient(); // This now refers to createServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}