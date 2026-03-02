// app/(admin)/admin/layout.tsx
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import AdminUIWrapper from '@/components/admin/AdminUIWrapper';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your store, orders, and content',
};

// Define allowed admin roles
const ALLOWED_ROLES = ['super_admin', 'admin', 'it_admin', 'accounts', 'employee'] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

// Super admin override emails
const SUPER_ADMIN_EMAILS = ['noel@ashamconstruction.co.ke'];

// Simple profile interface - only include columns you actually have
interface Profile {
  role: string | null;
  full_name: string | null;
}

export default async function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createClient();
  
  // 1. Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth error in Admin Layout:', authError?.message);
    redirect('/login?redirect=/admin');
  }

  // 2. Fetch user profile (only select columns that exist)
  let profile: Profile | null = null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (error) {
      // Only log real errors, not "no rows" errors
      if (error.code !== 'PGRST116') {
        console.error('Database error fetching profile:', error.message);
      }
    } else if (data) {
      profile = data;
    }
  } catch (err) {
    console.error('Unexpected error fetching profile:', err);
  }

  // 3. Determine role with fallback hierarchy
  const determineRole = (): AllowedRole | 'customer' => {
    // Priority 1: Database profile role
    if (profile?.role && ALLOWED_ROLES.includes(profile.role as AllowedRole)) {
      return profile.role as AllowedRole;
    }

    // Priority 2: Auth metadata role
    const metaRole = user.app_metadata?.role || user.user_metadata?.role;
    if (metaRole && ALLOWED_ROLES.includes(metaRole as AllowedRole)) {
      return metaRole as AllowedRole;
    }

    // Priority 3: Super admin email override
    if (SUPER_ADMIN_EMAILS.includes(user.email || '')) {
      return 'super_admin';
    }

    return 'customer';
  };

  const activeRole = determineRole();
  const isAllowed = ALLOWED_ROLES.includes(activeRole as AllowedRole);

  // 4. Access control check
  if (!isAllowed) {
    console.warn(`Access denied for user ${user.email} with role: ${activeRole}`);
    redirect('/?error=unauthorized');
  }

  // 5. Determine display name
  const activeName = 
    profile?.full_name || 
    user.user_metadata?.full_name || 
    user.email?.split('@')[0] || 
    'Admin User';

  // 6. Force super_admin for specific emails if DB role is missing
  const finalRole: AllowedRole = 
    SUPER_ADMIN_EMAILS.includes(user.email || '') && !profile?.role 
      ? 'super_admin' 
      : (activeRole as AllowedRole);

  return (
    <AdminUIWrapper role={finalRole} userName={activeName}>
      {children}
    </AdminUIWrapper>
  );
}

// Disable static generation for auth
export const dynamic = 'force-dynamic';
export const revalidate = 0;