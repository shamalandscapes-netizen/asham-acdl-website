// app/(admin)/admin/layout.tsx
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Authenticated?
  if (!user) redirect('/login');

  // 2. Fetch profile from DB 
  // NOTE: This will likely return an error currently due to the Recursion Policy
  const { data: profile, error: dbError } = await (supabase as any)
    .from('profiles') 
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (dbError) {
    console.error("Database error in Admin Layout:", dbError.message);
  }

  // 3. Robust Role Detection (Checks DB first, then Auth Metadata)
  const metaRole = user.app_metadata?.role || user.user_metadata?.role;
  const rawRole = (profile as any)?.role || metaRole;
  
  // Normalize the role to lowercase string
  const activeRole = String(rawRole || 'customer').toLowerCase();
  
  const activeName = (profile as any)?.full_name || user.user_metadata?.full_name || 'Admin User';

  // 4. Allowed Roles
  const allowed = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee'];
  
  // 5. FINAL ROLE GATE + NOEL OVERRIDE
  const isNoel = user.email === 'noel@ashamconstruction.co.ke';
  const isAllowed = allowed.includes(activeRole) || isNoel;

  if (!isAllowed) {
    console.error("Access Denied: User role is", activeRole);
    redirect('/'); 
  }

  // If you are Noel and the DB failed, we force the role to 'super_admin' 
  // so the UI components don't break.
  const finalRole = isNoel && !allowed.includes(activeRole) ? 'super_admin' : activeRole;

  return (
    <AdminUIWrapper role={finalRole} userName={activeName}>
      {children}
    </AdminUIWrapper>
  );
}