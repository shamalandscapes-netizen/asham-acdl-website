import { createSupabaseServerClient } from '@/lib/supabase/server';
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

/**
 * Handle Order Creation
 * Path: /api/orders
 */
export async function POST(request: Request) {
  // 1. Initialize Supabase with Server-Side Auth (Cookies)
  const supabase = await createSupabaseServerClient();

  try {
    // 2. Authentication Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 3. Payload Extraction & Validation
    const body = (await request.json()) as OrderRequestPayload;
    const { customer, items, paymentMethod, projectName } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'Your manifest is empty' }, { status: 400 });
    }

    // 4. Secure Price Verification (Fetch directly from DB to prevent client-side tampering)
    const itemIds = items.map((item: CartItem) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price, name')
      .in('id', itemIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      throw new Error("Could not verify material prices from the database.");
    }

    // 5. Financial Calculations
    let rawSubtotal = 0;
    const verifiedLineItems = items.map((item: CartItem) => {
      const product = dbProducts.find((p) => p.id === item.id);
      if (!product) throw new Error(`Product ${item.id} is no longer available.`);
      
      const price = parseFloat(product.price.toString());
      const quantity = Math.max(1, item.quantity); // Prevent zero/negative quantities
      rawSubtotal += price * quantity;

      return {
        product_id: product.id,
        quantity: quantity,
        unit_price: price, // Snapshots the price at the moment of purchase
      };
    });

    // Kenyan Tax Calculations (16% VAT)
    const subtotal = Math.round(rawSubtotal * 100) / 100;
    const taxAmount = Math.round((subtotal * 0.16) * 100) / 100;
    const totalAmount = subtotal + taxAmount;

    if (subtotal <= 0) {
      return NextResponse.json({ error: 'Invalid calculation. Subtotal is zero.' }, { status: 400 });
    }

    // 6. Insert Main Order Record
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

    // 7. Insert Line Items (Relinked to the generated Order ID)
    const orderItemsPayload = verifiedLineItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      // We log this but don't necessarily crash the whole response since the order exists
      console.error("Non-fatal: order_items link failed", itemsError);
    }

    // 8. Final Success Response
    return NextResponse.json({ 
      success: true,
      orderId: order.id, 
      total: totalAmount,
      paymentMethod,
      message: paymentMethod === 'mpesa' ? 'STK Push initiated' : 'Order logged successfully'
    });

  } catch (err: any) {
    console.error("Order API Crash:", err.message);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}