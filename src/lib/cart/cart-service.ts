import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CartItem } from '@/hooks/useCart'; // Reusing the client-side CartItem type

// Define the core structure needed for a line item in an Order
export interface OrderLineItem {
  product_id: string;
  name: string;
  price_at_purchase: number; // The actual price from the DB
  quantity: number;
  subtotal: number;
}

/**
 * Service class for secure, server-side cart operations (pricing, stock check).
 */
export class CartService {
  private supabase;

  constructor() {
    // Initialize server-side Supabase client to read product data securely
    const cookieStore = cookies();
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name: string) => (await cookieStore).get(name)?.value,
        },
      }
    );
  }

  /**
   * Validates a client-side cart against the current database prices and stock.
   * This is a critical security step before creating an order.
   * @param clientCart The cart data received from the client (localStorage).
   * @returns An array of validated OrderLineItems and the final total.
   */
  async validateAndCalculateCart(clientCart: CartItem[]): Promise<{ items: OrderLineItem[], total: number }> {
    if (clientCart.length === 0) {
      return { items: [], total: 0 };
    }

    // 1. Extract unique product IDs from the client's cart
    const productIds = clientCart.map(item => item.id);

    // 2. Fetch current prices and stock securely from the database
    const { data: dbProducts, error } = await this.supabase
      .from('products')
      .select('id, name, price, stock')
      .in('id', productIds);

    if (error) {
      console.error("Database error during cart validation:", error);
      throw new Error("Could not validate product information from the server.");
    }
    
    if (!dbProducts || dbProducts.length === 0) {
        throw new Error("No products found for the items in your cart.");
    }

    const dbProductMap = new Map(dbProducts.map(p => [p.id, p]));

    let validatedItems: OrderLineItem[] = [];
    let finalTotal = 0;

    // 3. Compare client data against database data
    for (const clientItem of clientCart) {
      const dbProduct = dbProductMap.get(clientItem.id);

      if (!dbProduct) {
        // If product doesn't exist anymore, skip or throw an error
        throw new Error(`Product ID ${clientItem.id} not found.`);
      }

      // Check for stock availability
      if (dbProduct.stock < clientItem.quantity) {
        throw new Error(`Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}.`);
      }

      // Calculate the true price and subtotal based on database data
      const price = dbProduct.price; // Use DB price, ignore client price
      const quantity = clientItem.quantity;
      const subtotal = price * quantity;
      
      validatedItems.push({
        product_id: clientItem.id,
        name: dbProduct.name,
        price_at_purchase: price,
        quantity: quantity,
        subtotal: subtotal,
      });

      finalTotal += subtotal;
    }

    return { items: validatedItems, total: finalTotal };
  }

  /**
   * Decrements the stock count for all items in the order.
   * This should be called after a successful payment.
   */
  async updateStock(lineItems: OrderLineItem[]): Promise<void> {
    const updates = lineItems.map(async (item) => {
      // Use a RPC or function here for a more atomic and secure decrement,
      // but for simplicity, we'll do a basic update.
      await this.supabase.rpc('decrement_product_stock', { 
        product_id_input: item.product_id, 
        qty_decrement: item.quantity 
      });
    });

    await Promise.all(updates);
  }
}