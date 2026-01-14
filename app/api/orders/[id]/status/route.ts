import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
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
    .from('user_profiles')
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
    .eq('id', params.id)
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
