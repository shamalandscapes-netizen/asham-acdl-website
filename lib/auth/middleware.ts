import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase middleware function for Next.js 14 App Router.
 * This is crucial for refreshing the session and ensuring server-side authentication
 * context is available to all protected routes and components.
 * * It also handles redirections for unauthenticated users accessing protected routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase server client instance
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session token and get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes (Routes that require the user to be logged in)
  const protectedRoutes = [
    '/dashboard',
    '/account',
    '/checkout',
    '/downloads',
    '/orders',
  ];

  // Get the current path
  const { pathname } = request.nextUrl;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    // If the route is protected and the user is NOT logged in, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Optionally add a redirect back parameter
    url.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(url);
  }

  // If the user IS logged in and tries to access /login or /register, redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/register')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
  }


  // Continue to the requested page (with updated session cookies)
  return supabaseResponse;
}

/* * NOTE: This file does not get exported directly. 
 * It is consumed by the main middleware file in the root directory: `middleware.ts`
 */