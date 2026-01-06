import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          // Update request cookies so subsequent server components see them
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // IMPORTANT: Update the EXISTING response headers/cookies
          // Do NOT re-initialize NextResponse.next() here
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This refreshes the session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Route Groups
  const isAuthPage = path.startsWith('/login') || path.startsWith('/register')
  const isAdminPage = path.startsWith('/admin')
  const isDashboardPage = path.startsWith('/dashboard')
  // Optimization: Treat /checkout as a protected dashboard-level page
  const isProtectedPage = isAdminPage || isDashboardPage || path.startsWith('/checkout')

  // 3. Logic: Not Logged In
  if (!user) {
    if (isProtectedPage) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  // 4. Logic: Logged In
  const userRole = user.user_metadata?.role || 'customer' 
  const adminRoles = ['super_admin', 'admin', 'staff', 'accountant', 'it_admin']
  const isElevatedUser = adminRoles.includes(userRole)

  // Block non-admins from /admin
  if (isAdminPage && !isElevatedUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Prevent logged-in users from seeing Auth pages
  if (isAuthPage) {
    const destination = isElevatedUser ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/webhooks (Stripe/M-Pesa)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public images (svg, png, etc)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}