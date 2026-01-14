// app/(admin)/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Authenticated?
  if (!user) redirect('/login');

  // 2. Fetch profile from DB 
  const { data: profile } = await (supabase as any)
    .from('profiles') 
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  // 3. Robust Role Detection (Checks DB first, then Auth Metadata)
  const metaRole = user.app_metadata?.role || user.user_metadata?.role;
  const rawRole = (profile as any)?.role || metaRole;
  
  // Normalize the role to lowercase string
  const activeRole = String(rawRole || 'customer').toLowerCase();
  
  const activeName = (profile as any)?.full_name || user.user_metadata?.full_name || 'Admin User';

  // 4. Updated Final Role Gate
  // Added 'accounts' and 'employee' to match Gabriel's account
  const allowed = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee'];
  
  if (!allowed.includes(activeRole)) {
    console.error("Access Denied: User role is", activeRole);
    redirect('/'); 
  }

  return (
    <AdminUIWrapper role={activeRole} userName={activeName}>
      {children}
    </AdminUIWrapper>
  );
}
