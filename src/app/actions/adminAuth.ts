'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function createStaffUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string; // 'it_admin', 'accounts', etc.
  const fullName = formData.get('fullName') as string;

  try {
    // 1. Create User with role IN APP_METADATA (Instant Middleware Access)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
      app_metadata: { role: role } // <--- CRITICAL: Syncs with your middleware instantly
    });

    if (authError) throw authError;

    // 2. Sync to your public.profiles table
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles') // Changed from 'users' to match your schema
        .upsert({
          id: authData.user.id,
          full_name: fullName,
          role: role,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
    }

    revalidatePath('/admin/users');
    return { success: true, message: `Staff member [${fullName}] created as ${role}` };
  
  } catch (error: any) {
    console.error('Create User Error:', error);
    return { success: false, message: error.message };
  }
}