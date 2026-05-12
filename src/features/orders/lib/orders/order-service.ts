import { CartService } from '@/lib/cart/cart-service';
import { OrderRepository } from './order-repository';
import { CartItem } from '@/hooks/useCart';
import { User } from '@supabase/supabase-js';

// Define the shape of the client-provided checkout details
interface CheckoutDetails {
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  shippingAddress?: string;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'card';
}

/**
 * Service class responsible for the high-level logic of order creation and payment preparation.
 * It coordinates validation, database persistence, and payment initiation.
 */
export class OrderService {
  private cartService: CartService;
  private orderRepository: OrderRepository;

  constructor() {
    this.cartService = new CartService();
    this.orderRepository = new OrderRepository();
  }

  /**
   * Performs the full order creation process: validation, persistence, and returns payment prep data.
   * @param clientCart The cart data from the client (Zustand/localStorage).
   * @param checkoutDetails The billing and shipping information from the checkout form.
   * @param user The authenticated Supabase user.
   * @returns The newly created order ID and the final verified total.
   */
  async createOrder(
    clientCart: CartItem[],
    checkoutDetails: CheckoutDetails,
    user: User
  ): Promise<{ orderId: string, finalTotal: number }> {

    if (clientCart.length === 0) {
      throw new Error("Cannot create an order with an empty cart.");
    }

    // 1. Validate Cart and Calculate Final Total (Secure step on the server)
    const { items: validatedLineItems, total: finalTotal } = 
      await this.cartService.validateAndCalculateCart(clientCart);

    if (finalTotal <= 0) {
      throw new Error("Order total must be greater than zero.");
    }
    
    // 2. Prepare Order Data for Insertion
    const newOrderData = {
      user_id: user.id,
      billing_name: checkoutDetails.billingName,
      billing_email: checkoutDetails.billingEmail,
      billing_phone: checkoutDetails.billingPhone,
      total_amount: finalTotal,
      shipping_address: checkoutDetails.shippingAddress,
      payment_method: checkoutDetails.paymentMethod,
      // Start order as pending payment
      status: 'PENDING_PAYMENT' as const, 
    };

    // 3. Create Order and Line Items in the Database (Atomic transaction)
    const orderId = await this.orderRepository.createNewOrder(
      newOrderData, 
      validatedLineItems
    );
    
    // NOTE: Stock is NOT decremented yet. It is decremented only AFTER payment is confirmed 
    // in the M-Pesa callback or other payment confirmation handler.

    return { orderId, finalTotal };
  }
  
  /**
   * Handles the post-payment finalization steps.
   * This function should be called ONLY by the secure payment callback/webhook.
   * @param orderId The ID of the order to finalize.
   * @param paymentStatus 'SUCCESS' or 'FAILED'.
   */
  async finalizeOrder(orderId: string, paymentStatus: 'SUCCESS' | 'FAILED'): Promise<void> {
    
    if (paymentStatus === 'SUCCESS') {
      // 1. Update order status to PROCESSING
      await this.orderRepository.updateOrderStatus(orderId, 'PROCESSING');
      
      // 2. Retrieve the order's line items to determine stock changes
      // NOTE: We need a method to get line items by orderId in OrderRepository
      // For this example, assume you can fetch the order details including items:
      // const order = await this.orderRepository.getOrderDetail(orderId);
      
      // 3. Decrement product stock (Crucial step)
      // await this.cartService.updateStock(order.lineItems); 

      // 4. Trigger delivery/fulfillment notification (e.g., email or warehouse system)
      
    } else if (paymentStatus === 'FAILED') {
      // Update order status to CANCELLED
      await this.orderRepository.updateOrderStatus(orderId, 'CANCELLED');
    }
  }
}