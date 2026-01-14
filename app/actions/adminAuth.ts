'use server';

import { createClient } from '@supabase/supabase-js';

// Note: We use the raw supabase-js client here because we need 
// to use the SERVICE_ROLE_KEY to bypass RLS and session checks.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false, // This ensures we don't log in as the new user
    },
  }
);

export async function createStaffUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const fullName = formData.get('fullName') as string;

  try {
    // 1. Create the user in Supabase Auth (Admin mode)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm their email so they can login immediately
      user_metadata: { full_name: fullName },
    });

    if (authError) throw authError;

    // 2. Ensure the user profile exists in your public 'users' table
    // (Depending on your triggers, this might already exist, but an upsert is safe)
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: role, // 'staff', 'accounts', etc.
        });

      if (profileError) throw profileError;
    }

    return { success: true, message: 'Staff member created successfully' };
  
  } catch (error: any) {
    console.error('Create User Error:', error);
    return { success: false, message: error.message };
  }
}
