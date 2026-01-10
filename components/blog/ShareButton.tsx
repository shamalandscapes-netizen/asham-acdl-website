'use client';

import { Share2, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this architectural insight from Asham ACDL: ${title}`,
      url: window.location.href,
    };

    // Use native share if available (Mobile/Safari)
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-between w-full p-5 text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white rounded-2xl hover:bg-[#C75B39] transition-all group shadow-xl shadow-gray-200"
    >
      <span>{copied ? 'Link Copied' : 'Share Article'}</span>
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Share2 size={16} className="transition-transform group-hover:rotate-12" />
      )}
    </button>
  );
}