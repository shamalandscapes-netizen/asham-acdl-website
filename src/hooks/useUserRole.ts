import { useEffect, useState } from 'react'
import { createSupabaseServerClient as createClient } from '@/lib/supabase/server'; // Adjust this path to your client
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type UserRole = Profile['role']

export function useUserRole() {
  const supabase = createClient()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await (await supabase).auth.getUser()
      
      if (user) {
        const { data } = await (await supabase)
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setRole(data?.role || null)
      }
      setLoading(false)
    }

    getRole()
  }, [supabase])

  return { role, loading }
}