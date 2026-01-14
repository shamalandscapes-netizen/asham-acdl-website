import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. ROBUST ROLE DETECTION
  // Gabriel has 'employee' in user_metadata, Noel has 'super_admin' in app_metadata
  const rawRole = user?.app_metadata?.role || user?.user_metadata?.role || 'customer';
  const userRole = String(rawRole).toLowerCase();

  const path = request.nextUrl.pathname

  // --- 2. ACCESS CONFIGURATION ---
  const adminRoles = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee']
  const isElevated = adminRoles.includes(userRole)

  // Pages
  const isAuthPage = path.startsWith('/login') || path.startsWith('/register')
  const isAdminPage = path.startsWith('/admin')
  const isCustomerDashboard = path.startsWith('/dashboard')
  
  // Protected areas
  const isProtectedPage = isAdminPage || isCustomerDashboard || path.startsWith('/checkout')

  // --- DEBUG LOGGING --- 
  // This helps you see what's happening in your terminal
  if (isProtectedPage && user) {
    console.log(`MW Trace: ${user.email} | Role: ${userRole} | Path: ${path} | Allowed: ${isElevated}`);
  }

  // --- 3. LOGIC: GUESTS (Not logged in) ---
  if (!user && isProtectedPage) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // --- 4. LOGIC: AUTHENTICATED USERS ---
  if (user) {
    // SECURITY: Prevent regular customers from accessing /admin
    if (isAdminPage && !isElevated) {
      console.warn(`Unauthorized Access blocked for: ${user.email}`);
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // REDIRECT: Prevent logged-in users from seeing login/register pages
    if (isAuthPage) {
      const destination = isElevated ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public images (svg, png, etc)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}