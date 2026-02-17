import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient as createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // FIX: Params is now a Promise
) {
  // 1. Await the dynamic parameters
  const { id } = await params;

  const supabase = await createClient()

  /* ---------------------------------
      1️⃣ AUTH CHECK
  ---------------------------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  /* ---------------------------------
      2️⃣ ROLE CHECK
  ---------------------------------- */
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_type, is_active, is_approved')
    .eq('id', user.id)
    .single()

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !profile.is_approved
  ) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  const allowedRoles = ['super_admin', 'admin', 'accounts']

  if (!allowedRoles.includes(profile.user_type)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  /* ---------------------------------
      3️⃣ FETCH ORDER STATUS
  ---------------------------------- */
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id) // Use the awaited 'id'
    .single()

  if (orderError || !order) {
    return NextResponse.json(
      { status: 'FAILED' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    status: order.status,
  })
}