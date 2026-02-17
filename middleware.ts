import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname.startsWith('/login')
  const isAdminPage = pathname.startsWith('/admin')

  // 🚀 OPTIMIZATION: Early exit for public pages.
  // If we aren't going to /admin or /login, don't initialize Supabase 
  // or check the database. This makes public pages load instantly.
  if (!isAdminPage && !isLoginPage) {
    return NextResponse.next()
  }

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
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // --- START PROTECTION LOGIC ---
  
  // 1. If trying to reach Admin but NOT logged in
  if (isAdminPage && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Fetch Role if user exists
  let userRole = null
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.log('MIDDLEWARE DB ERROR:', error.message)
    }
    userRole = profile?.role
  }

  const isNoel = user?.email === 'noel@ashamconstruction.co.ke'
  const allowedRoles = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee']
  const hasAdminAccess = isNoel || (userRole && allowedRoles.includes(userRole.toLowerCase()))

  // 3. ADMIN GATE
  if (isAdminPage) {
    if (hasAdminAccess) {
      console.log('ADMIN ACCESS GRANTED for:', user?.email)
      return response
    }
    console.log('ADMIN ACCESS DENIED for:', user?.email)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 4. LOGIN PAGE REDIRECT (If already logged in)
  if (isLoginPage && user) {
    if (hasAdminAccess) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|api).*)'],
}