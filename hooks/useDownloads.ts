'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface DownloadItem {
  id: number;
  title: string;
  description: string;
  file_url: string; // The URL to the downloadable asset
  purchased_on: string; // Date of purchase
  order_id: string;
}

/**
 * Hook to fetch and manage the list of digital downloads for the logged-in user.
 */
export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDownloads = useCallback(async (user: User) => {
    setIsLoading(true);
    setError(null);

    // This query assumes you have a table called 'user_downloads'
    // that links a user_id to a product/file entry.
    // Replace 'user_downloads' and column names with your actual Supabase schema.
    const { data, error: dbError } = await supabase
      .from('user_downloads' as any) 
      .select(`
        id,
        purchased_on,
        order_id,
        products (
          title, 
          description, 
          file_url
        )
      `)
      .eq('user_id', user.id)
      .order('purchased_on', { ascending: false });

    if (dbError) {
      console.error("Supabase fetch error for downloads:", dbError);
      setError(dbError.message);
      setIsLoading(false);
      return;
    }

    if (data) {
      // Map the joined data into the simpler DownloadItem structure
      const formattedDownloads: DownloadItem[] = data.map((item: any) => ({
        id: item.id,
        title: item.products.title,
        description: item.products.description,
        file_url: item.products.file_url,
        purchased_on: item.purchased_on,
        order_id: item.order_id,
      }));
      setDownloads(formattedDownloads);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    // 1. Get the current session user
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchDownloads(user);
      } else {
        setIsLoading(false);
        setError("User not logged in.");
      }
    };

    getInitialUser();

    // 2. Set up a subscription listener for real-time changes (optional)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchDownloads(session.user);
      } else if (event === 'SIGNED_OUT') {
        setDownloads([]);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchDownloads]);

  
  /**
   * Function to handle the actual file download (client-side).
   */
  const startDownload = useCallback((url: string, fileName: string) => {
    try {
      // For security, you might want to call a serverless function here
      // that generates a signed URL before redirecting.
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Suggests a filename to the browser
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // In a real app, track the download count for analytics
      // trackDownload(fileName); 

    } catch (e) {
      console.error("Download failed:", e);
      setError("Failed to initiate download. Please check the file URL.");
    }
  }, []);

  return {
    downloads,
    isLoading,
    error,
    startDownload,
    refetch: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await fetchDownloads(user);
    },
  };
};