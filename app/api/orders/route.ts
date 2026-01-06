import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// --- TYPES & INTERFACES ---
interface CartItem {
  id: string;
  quantity: number;
}

interface OrderRequestPayload {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
  items: CartItem[];
  paymentMethod: 'mpesa' | 'stripe' | 'paypal';
  projectName?: string;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  );

  try {
    // 1. Authentication Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2. Payload Validation
    const body = (await request.json()) as OrderRequestPayload;
    const { customer, items, paymentMethod, projectName } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'Your manifest is empty' }, { status: 400 });
    }

    // 3. Secure Price Verification (Server-Side)
    const itemIds = items.map((item: CartItem) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price, name')
      .in('id', itemIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      throw new Error("Could not verify material prices from the database.");
    }

    // 4. Financial Calculations
    let rawSubtotal = 0;
    const verifiedLineItems = items.map((item: CartItem) => {
      const product = dbProducts.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product ${item.id} no longer exists.`);
      
      const price = parseFloat(product.price.toString());
      const quantity = Math.max(1, item.quantity); // Ensure at least 1
      rawSubtotal += price * quantity;

      return {
        product_id: product.id,
        quantity: quantity,
        unit_price: price, // Snapshots the price at purchase time
      };
    });

    const subtotal = Math.round(rawSubtotal * 100) / 100;
    const taxAmount = Math.round((subtotal * 0.16) * 100) / 100;
    const totalAmount = subtotal + taxAmount;

    if (subtotal <= 0) {
      return NextResponse.json({ error: 'Invalid calculation. Subtotal is zero.' }, { status: 400 });
    }

    // 5. Insert Main Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        shipping_address: `${customer.address}, ${customer.city}, ${customer.county}`,
        project_name: projectName || 'General Acquisition',
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 6. Insert Line Items (order_items table)
    const orderItemsPayload = verifiedLineItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Non-fatal: order_items link failed", itemsError);
    }

    // 7. Success Response
    return NextResponse.json({ 
      success: true,
      orderId: order.id, 
      total: totalAmount,
      paymentMethod,
      message: paymentMethod === 'mpesa' ? 'STK Push initiated' : 'Order logged successfully'
    });

  } catch (err: any) {
    console.error("Order API Crash:", err.message);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}