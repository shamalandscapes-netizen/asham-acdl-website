'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface ProtectedImageViewerProps {
  src: string;
  alt: string;
  userEmail?: string; // We will stamp this on the image
}

export default function ProtectedImageViewer({ src, alt, userEmail }: ProtectedImageViewerProps) {
  
  // 1. Disable Right Click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('This image is copyright protected. Downloading is disabled.');
  };

  // 2. Disable Dragging
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="relative overflow-hidden bg-gray-100 rounded-lg select-none group"
      onContextMenu={handleContextMenu}
    >
      {/* THE IMAGE 
         - pointer-events-none prevents clicking/dragging the image itself
      */}
      <img 
        src={src} 
        alt={alt}
        className="object-contain w-full h-auto transition-all duration-300 pointer-events-none blur-0"
        onDragStart={handleDragStart}
      />

      {/* TRANSPARENT OVERLAY (The "Shield")
         - Sits on top of the image.
         - Intercepts all clicks so the browser thinks you are clicking a div, not an image.
      */}
      <div className="absolute inset-0 z-10 bg-transparent" />

      {/* DYNAMIC WATERMARK PATTERN 
         - Repeats the user's email or "COPYRIGHT ASHAM" across the image.
         - Semi-transparent so the plan is visible but 'ruined' for reuse.
      */}
      <div className="absolute inset-0 z-20 flex flex-wrap content-center justify-center gap-12 p-10 overflow-hidden transform pointer-events-none opacity-30 -rotate-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="text-xl font-bold text-gray-500 select-none whitespace-nowrap">
            {userEmail || '© ASHAM CONST.'}
          </span>
        ))}
      </div>

      {/* WARNING BANNER (Optional) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
        Protected Digital Asset. Do Not Distribute.
      </div>

    </div>
  );
}