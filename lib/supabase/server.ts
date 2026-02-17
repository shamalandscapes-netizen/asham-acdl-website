import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Mark as async so we can await cookies()
export async function createSupabaseServerClient() {
  const cookieStore = await cookies() // ✅ await it

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get?.(name) ?? null
          return cookie?.value ?? null
        },
        set(name: string, value: string, options?: any) {
          console.warn('Supabase attempted to set a cookie on server component')
        },
        remove(name: string, options?: any) {
          console.warn('Supabase attempted to remove a cookie on server component')
        },
      },
    }
  )
}
