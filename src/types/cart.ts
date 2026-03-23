/**
 * Represents a single item in the shopping cart.
 */
export interface CartItem {
  id: string;          // The unique Product ID from Supabase
  name: string;        // Product Name
  price: number;       // Unit Price
  quantity: number;    // Quantity selected
  image_url?: string | null; // Product image
  
  // Important for Shipping Logic:
  // If true (Architectural Plans), we skip the shipping address step.
  is_digital?: boolean; 
  
  // Optional metadata
  category?: string;
}

/**
 * Summary of the cart totals.
 */
export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number; // Calculated at checkout based on location
  total: number;
}