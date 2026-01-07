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
        getAll() { return request.cookies.getAll() },
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

  const { data: { user } } = await supabase.auth.getUser()
  
  // Extract role from metadata or default to customer
  const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'customer'
  const path = request.nextUrl.pathname

  // DEBUGGING: Watch your terminal to see why Noel is being redirected
  console.log(`MW Trace: ${user?.email || 'Guest'} -> ${path} [Role: ${userRole}]`)

  const isAuthPage = path.startsWith('/login') || path.startsWith('/register')
  const isAdminPage = path.startsWith('/admin')
  const isProtectedPage = isAdminPage || path.startsWith('/dashboard') || path.startsWith('/checkout')

  // Logic 1: Guest trying to access protected pages
  if (!user && isProtectedPage) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // Logic 2: Logged in users
  if (user) {
    const adminRoles = ['super_admin', 'admin', 'staff', 'it_admin']
    const isElevated = adminRoles.includes(userRole)

    // Kick non-admins away from /admin
    if (isAdminPage && !isElevated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Kick logged-in users away from /login
    if (isAuthPage) {
      return NextResponse.redirect(new URL(isElevated ? '/admin' : '/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!api/webhooks|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}