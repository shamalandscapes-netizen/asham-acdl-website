import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Product } from '@/hooks/useProducts'; // Reusing the client-side Product type

/**
 * Repository class for secure, server-side access to the 'products' table.
 */
export class ProductRepository {
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
   * Fetches a list of all products or filters them by a specific category.
   * @param categorySlug Optional slug to filter products.
   * @returns A promise that resolves to an array of Product objects.
   */
  async getProducts(categorySlug?: string): Promise<Product[]> {
    let query = this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      // Filter by the category column
      query = query.eq('category', categorySlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching products:", error);
      throw new Error("Failed to retrieve product list from the server.");
    }

    return data as Product[];
  }
  
  /**
   * Fetches a single product by its unique slug.
   * @param slug The product slug (e.g., 'high-grade-cement').
   * @returns A promise that resolves to the Product object or null if not found.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error("Supabase error fetching product by slug:", error);
      throw new Error(`Failed to retrieve product details for slug: ${slug}`);
    }

    return data as Product | null;
  }

  /**
   * Fetches a single product by its ID.
   * @param id The product ID.
   * @returns A promise that resolves to the Product object or null if not found.
   */
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Supabase error fetching product by ID:", error);
      throw new Error(`Failed to retrieve product details for ID: ${id}`);
    }

    return data as Product | null;
  }
  
  /**
   * Fetches a specified number of featured or newest products for a preview section.
   * @param limit The maximum number of products to return.
   * @returns A promise that resolves to an array of featured Product objects.
   */
  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      // You might add a .eq('is_featured', true) here if you have that column
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching featured products:", error);
      return [];
    }

    return data as Product[];
  }
}