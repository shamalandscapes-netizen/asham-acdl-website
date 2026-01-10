import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Authenticated?
  if (!user) redirect('/login');

  // 2. Fetch profile from DB 
  // FIX: Cast supabase as any to prevent 'profile' from becoming type 'never'
  const { data: profile } = await (supabase as any)
    .from('profiles') 
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  // 3. Fallback: Check Auth Metadata if DB profile is missing the role
  // We use optional chaining and cast the check to ensure role isn't 'never'
  const metaRole = user.app_metadata?.role || user.user_metadata?.role;
  const activeRole = (profile as any)?.role || metaRole;
  const activeName = (profile as any)?.full_name || user.user_metadata?.full_name || 'Admin User';

  // 4. Final Role Gate
  const allowed = ['super_admin', 'admin', 'it_admin', 'staff'];
  
  if (!activeRole || !allowed.includes(activeRole)) {
    console.error("Access Denied: User role is", activeRole);
    // Use a path you know exists, like home or a general dashboard
    redirect('/'); 
  }

  return (
    <AdminUIWrapper role={activeRole} userName={activeName}>
      {children}
    </AdminUIWrapper>
  );
}