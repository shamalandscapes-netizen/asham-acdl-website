import { Database } from '@/lib/supabase/types';

// Extract the raw row types from Supabase
type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];

/**
 * Valid Statuses for an Order
 */
export type OrderStatus = 
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * Valid Payment Statuses
 */
export type PaymentStatus = 
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

/**
 * Structure of a Shipping/Billing Address stored in the JSONB column
 */
export interface Address {
  fullName: string;
  phone: string;
  street?: string; // Optional for digital
  city?: string;
  county: string;
  postalCode?: string;
}

/**
 * Extended Order type that includes the related OrderItems and Product details.
 * Useful for the "Order Details" page.
 */
export interface OrderWithItems extends OrderRow {
  items: (OrderItemRow & {
    product: Pick<ProductRow, 'name' | 'image_url' | 'is_digital'> | null;
  })[];
}

/**
 * Payload sent to the API to create a new order
 */
export interface CreateOrderPayload {
  user_id: string;
  total_amount: number;
  payment_phone: string;
  shipping_address?: Address | null; // Null for digital-only orders
  billing_address?: Address | null;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

/**
 * Type for the Dashboard Order Summary Table
 */
export interface OrderSummary {
  id: string;
  created_at: string;
  total_amount: number;
  payment_status: string;
  // Count of items helps show "3 items" instead of listing them all
  item_count: number; 
}