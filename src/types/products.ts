import { Database } from '@/lib/supabase/types';

// Base product type from Supabase
export type Product = Database['public']['Tables']['products']['Row'];

/**
 * Valid categories for your construction store.
 * You can update this list as your inventory grows.
 */
export type ProductCategory = 
  | 'Construction Materials'
  | 'Architectural Plans'
  | 'Finishes'
  | 'Tools'
  | 'Consultation';

/**
 * Filter options for the Shop Page sidebar
 */
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  isDigital?: boolean; // Useful for showing only Plans vs Materials
}

/**
 * Sorting options for the product grid
 */
export type ProductSortOption = 
  | 'price-asc'   // Price: Low to High
  | 'price-desc'  // Price: High to Low
  | 'newest'      // Newest Arrivals
  | 'name-asc';   // A-Z

/**
 * Extended product type for the "Digital Downloads" section.
 * Includes metadata about the downloadable file if available.
 */
export interface DigitalProduct extends Product {
  file_size?: number; // Optional, can be derived or stored in a separate table
  file_type?: string; // e.g., 'PDF', 'CAD'
}