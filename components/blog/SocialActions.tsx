'use client';

import { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';
import { createClient } from '@/supabase/client';
import { toast } from 'react-hot-toast';

export default function SocialActions({ 
  postId, 
  postTitle, 
  initialLikes 
}: { 
  postId: string; 
  postTitle: string; 
  initialLikes: number 
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const supabase = createClient();

  const handleLike = async () => {
    if (hasLiked) return;

    // Optimistic Update
    setHasLiked(true);
    setLikes(prev => prev + 1);

    // 1. Attempt RPC call with full casting
    const { error } = await (supabase as any).rpc('increment_likes', { post_id: postId });
    
    // 2. Fallback to standard update if RPC fails
    if (error) {
      console.error('RPC Error, falling back to update:', error);
      // FIX: Cast the entire supabase client to (any) before calling .from()
      await (supabase as any)
        .from('posts')
        .update({ likes: likes + 1 })
        .eq('id', postId);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: postTitle,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Silently handle cancellation
      }
    } else {
      // Manual clipboard fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopying(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setIsCopying(false), 2000);
      } catch (err) {
        toast.error('Could not copy link');
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={hasLiked}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
          hasLiked 
          ? 'bg-red-50 border-red-100 text-red-500 scale-95' 
          : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400'
        }`}
      >
        <Heart 
          size={18} 
          className="transition-transform active:scale-125"
          fill={hasLiked ? "currentColor" : "none"} 
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {likes}
        </span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-100 bg-white text-gray-400 hover:border-[#06392F] hover:text-[#06392F] transition-all"
      >
        {isCopying ? (
          <Check size={18} className="text-green-500 animate-in zoom-in" />
        ) : (
          <Share2 size={18} />
        )}
        <span className="text-[10px] font-black uppercase tracking-widest">
          Share
        </span>
      </button>
    </div>
  );
}