import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper to get Supabase Client
function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; }
      }
    }
  );
}

// --- POST: Create a New Order ---
export async function POST(request: Request) {
  const supabase = getSupabase();

  try {
    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch User's Cart Items from DB
    // We fetch from DB (not trust client body) to ensure prices are correct
    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select(`
        quantity,
        product:products (
          id,
          name,
          price,
          type
        )
      `)
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 3. Calculate Total & Prepare Order Items
    let totalAmount = 0;
    const orderItems = cartItems.map((item: any) => {
      const price = item.product.price;
      const quantity = item.quantity;
      totalAmount += price * quantity;

      // We save a snapshot of the item details in the order
      // securely in case the product name/price changes later.
      return {
        id: item.product.id,
        name: item.product.name,
        price: price,
        quantity: quantity,
        type: item.product.type
      };
    });

    // 4. Create the Order in DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending', // Waiting for payment
        items: orderItems, // Save the JSON snapshot
        payment_method: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Clear the Cart (Since order is created)
    await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id);

    // 6. Return Order ID (Frontend will use this to trigger M-Pesa)
    return NextResponse.json({ 
      orderId: order.id, 
      total: totalAmount,
      message: 'Order created successfully' 
    });

  } catch (error: any) {
    console.error('Order Creation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- GET: List Orders (Admin gets all, User gets theirs) ---
export async function GET(request: Request) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check Role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = ['super_admin', 'staff', 'accounts'].includes(profile?.role);

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

  // If NOT admin, only show own orders
  if (!isAdmin) {
    query = query.eq('user_id', user.id);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}