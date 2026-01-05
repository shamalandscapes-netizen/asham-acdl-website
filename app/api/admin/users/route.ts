import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// 1. Create a Service Role Client (Admin access with NO restrictions)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// --- GET: List All Users (Optional, if you want server-side fetching) ---
export async function GET(request: Request) {
  try {
    // A. Check if the requester is actually an Admin
    const cookieStore = cookies();
    const supabaseUser = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );
    
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check Role in public table
    const { data: profile } = await supabaseUser
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'super_admin' && profile?.role !== 'it') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // B. Fetch users using Admin client (Can fetch from auth.users if needed)
    const { data: users, error } = await supabaseAdmin.from('users').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(users);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Delete a User from Auth & Database ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    // A. Verify Requester is Super Admin (Security Check)
    const cookieStore = cookies();
    const supabaseUser = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );

    const { data: { user } } = await supabaseUser.auth.getUser();
    const { data: profile } = await supabaseUser.from('users').select('role').eq('id', user?.id).single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admins can delete users' }, { status: 403 });
    }

    // B. Delete from Supabase Auth (This is the Magic Step that requires this API)
    // Deleting from Auth usually cascades to public.users if you set up Foreign Keys correctly
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}