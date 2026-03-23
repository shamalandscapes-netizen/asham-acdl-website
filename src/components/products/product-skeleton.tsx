'use client';

import { cn } from '@/lib/utils';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden p-2 animate-pulse">
      {/* Image Placeholder */}
      <div className="aspect-square bg-gray-100 rounded-[2rem] w-full" />
      
      {/* Content Placeholders */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          {/* Category Tag Placeholder */}
          <div className="w-20 h-2 bg-gray-100 rounded-full" />
          {/* Title Placeholder */}
          <div className="w-full h-6 bg-gray-100 rounded-lg" />
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-gray-50">
          <div className="space-y-2">
            {/* Price Label Placeholder */}
            <div className="w-10 h-2 rounded bg-gray-50" />
            {/* Price Amount Placeholder */}
            <div className="w-24 h-8 bg-gray-100 rounded-lg" />
          </div>
          {/* Button Placeholder */}
          <div className="w-12 h-12 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Helper to render a grid of skeletons
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}