'use client';

import { useState } from 'react';
import { Download, Loader2, FileCheck } from 'lucide-react';

interface DownloadButtonProps {
  productId: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
}

export default function DownloadButton({ 
  productId, 
  label = "Download File", 
  className = "",
  variant = 'primary'
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    // Navigate to the download route
    // We use window.location to allow the browser to handle the file stream/download dialog
    window.location.href = `/products/download/${productId}`;

    // Reset loading state after a delay (since we can't track exact download start in the browser)
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };

  // Styles based on variant
  const baseStyles = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-wait";
  
  const variants = {
    primary: "bg-[#06392F] text-white hover:bg-[#0A4D40] shadow-md hover:shadow-lg",
    outline: "border-2 border-[#06392F] text-[#06392F] hover:bg-[#06392F] hover:text-white",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#06392F]"
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Preparing...</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}