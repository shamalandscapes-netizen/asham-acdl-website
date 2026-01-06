'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  is_digital: boolean;
  created_at: string;
}

/**
 * Hook to fetch and manage product data from Supabase.
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch data from the 'products' table
      // Select all columns and order by creation date
      const { data, error: dbError } = await supabase
        .from('products') 
        .select('*')
        .order('name', { ascending: true });

      if (dbError) {
        throw dbError;
      }

      // 2. Safely cast and set the products
      if (data) {
        setProducts(data as unknown as Product[]);
      }
    } catch (err: any) {
      console.error("Supabase fetch error for products:", err);
      setError(err.message || 'Failed to fetch products.');
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  /**
   * Finds a single product by its slug (used for dynamic product detail pages).
   */
  const getProductBySlug = useCallback((slug: string): Product | undefined => {
    return products.find(product => product.slug === slug);
  }, [products]);

  /**
   * Finds a single product by its ID.
   */
  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(product => product.id === id);
  }, [products]);


  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getProductBySlug,
    getProductById,
    
    // You can add filtering functions here if needed
    getProductsByCategory: (category: string) => {
      if (category === 'all') return products;
      return products.filter(p => p.category === category);
    },
    
    // Extracts unique categories from the product list
    getCategories: () => {
      const allCategories = products.map(p => p.category);
      return ['all', ...Array.from(new Set(allCategories))];
    }
  };
};