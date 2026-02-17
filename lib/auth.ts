import { createClient } from '@/supabase/client';

type UserProfile = {
  id: string;
  user_type: 'super_admin' | 'admin' | 'accounts' | 'employee';
  is_active: boolean;
  is_approved: boolean;
};

export async function getCurrentUserRole() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('user_type, is_active, is_approved')
    .eq('id', user.id)
    .single<UserProfile>();

  if (error || !data) return null;

  if (!data.is_active || !data.is_approved) return null;

  return data.user_type;
}
