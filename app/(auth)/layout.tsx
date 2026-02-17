import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server' // Path adjusted to your directory

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // 1. Initialize the Server Client
  const supabase = await createClient()
  
  // 2. Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // 3. Fetch their profile to see their role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // 4. Send them to the right "Home" based on their role
    if (profile?.role === 'super_admin' || profile?.role === 'admin') {
      redirect('/admin')
    } else if (profile?.role === 'accounts') {
      redirect('/admin/finance')
    } else if (profile?.role === 'employee') {
      redirect('/admin/dashboard')
    } else {
      redirect('/dashboard')
    }
  }

  // 5. If NOT logged in, show the login/signup forms
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}