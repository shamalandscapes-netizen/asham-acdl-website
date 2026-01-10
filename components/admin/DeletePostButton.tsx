'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    // Standard browser confirmation for safety
    if (!confirm("Are you sure you want to delete this entry? This action is permanent.")) return;
    
    setLoading(true);
    
    try {
      // ✅ Use "as any" to bypass the missing table definition in your local types
      const { error } = await (supabase
        .from('posts' as any)
        .delete()
        .eq('id', postId) as any);

      if (error) throw error;

      toast.success("Entry removed from journal");
      
      // router.refresh() triggers a server-side re-fetch of the data 
      // so the deleted post disappears from the list immediately.
      router.refresh(); 
      
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-3 text-gray-400 transition-all bg-gray-50 hover:text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
      title="Delete Entry"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Trash2 size={18} />
      )}
    </button>
  );
}