import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';
import { OrderLineItem } from '@/lib/cart/cart-service'; // Import the validated item structure

// Define the basic structure of a new Order for insertion
interface NewOrderData {
  user_id: string;
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  total_amount: number;
  shipping_address?: string; // Optional for digital products
  payment_method: 'mpesa' | 'bank_transfer' | 'card';
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
}

/**
 * Repository class for all server-side Order interactions with Supabase.
 */
export class OrderRepository {
  private supabase;

  constructor() {
    // Initialize server-side Supabase client with cookie context
    const cookieStore = cookies();
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
        },
      }
    );
  }

  /**
   * Creates a new order and its line items in a single atomic transaction.
   * @param orderData The main order details.
   * @param lineItems The validated products and their final prices.
   * @returns The ID of the newly created order.
   */
  async createNewOrder(
    orderData: NewOrderData,
    lineItems: OrderLineItem[]
  ): Promise<string> {
    
    // We use a Supabase Function/RPC here to ensure atomic transaction integrity.
    // NOTE: You must create a corresponding SQL function in Supabase.
    
    const orderItemsForRPC = lineItems.map(item => ({
      product_id: item.product_id,
      name: item.name,
      price_at_purchase: item.price_at_purchase,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const rpcPayload = {
      p_order_data: orderData,
      p_line_items: orderItemsForRPC,
    };

    const { data: orderId, error: rpcError } = await this.supabase
      .rpc('create_order_with_items', rpcPayload);

    if (rpcError) {
      console.error("RPC Error creating order:", rpcError);
      throw new Error(`Failed to create order due to a database error: ${rpcError.message}`);
    }
    
    // The RPC function should return the ID of the new order (UUID)
    return orderId as string;
  }

  /**
   * Fetches all orders for the currently logged-in user.
   * @param user The authenticated Supabase user object.
   * @returns An array of order objects.
   */
  async getUserOrders(user: User): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        status,
        payment_method,
        order_items (
          product_id,
          name,
          quantity
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching user orders:", error);
      throw new Error("Failed to retrieve your order history.");
    }

    return data;
  }
  
  /**
   * Updates the status of an existing order.
   * This is typically used by payment callback handlers.
   */
  async updateOrderStatus(orderId: string, newStatus: NewOrderData['status']): Promise<void> {
    const { error } = await this.supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error(`Error updating order ${orderId} status to ${newStatus}:`, error);
      throw new Error(`Failed to update order status.`);
    }
  }
}

// NOTE on create_order_with_items RPC:
// You must define this function in your Supabase SQL Editor.
/*
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_order_data jsonb,
    p_line_items jsonb[]
)
RETURNS uuid AS $$
DECLARE
    new_order_id uuid;
    item jsonb;
BEGIN
    -- 1. Insert into the orders table
    INSERT INTO orders (
        user_id, billing_name, billing_email, billing_phone, total_amount, 
        shipping_address, payment_method, status
    )
    VALUES (
        (p_order_data->>'user_id')::uuid,
        p_order_data->>'billing_name',
        p_order_data->>'billing_email',
        p_order_data->>'billing_phone',
        (p_order_data->>'total_amount')::numeric,
        p_order_data->>'shipping_address',
        (p_order_data->>'payment_method')::payment_method_enum, -- Assuming payment_method is an ENUM
        (p_order_data->>'status')::order_status_enum
    )
    RETURNING id INTO new_order_id;

    -- 2. Insert into the order_items table
    FOREACH item IN ARRAY p_line_items
    LOOP
        INSERT INTO order_items (
            order_id, product_id, name, price_at_purchase, quantity, subtotal
        )
        VALUES (
            new_order_id,
            (item->>'product_id')::uuid,
            item->>'name',
            (item->>'price_at_purchase')::numeric,
            (item->>'quantity')::integer,
            (item->>'subtotal')::numeric
        );
    END LOOP;

    -- 3. Return the new order ID
    RETURN new_order_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/