// components/ui/LoadingSpinner.tsx
'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'dark' | 'light' | 'terracotta';
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16'
};

const colorMap = {
  dark: 'border-[#06392F] border-t-[#06392F]/30',
  light: 'border-white border-t-white/30',
  terracotta: 'border-[#C75B39] border-t-[#C75B39]/30'
};

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'dark',
  fullScreen = false 
}: LoadingSpinnerProps) {
  
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`
          ${sizeMap[size]} 
          border-2 
          rounded-full 
          ${colorMap[color]}
        `}
      />
      
      {/* Optional loading text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-xs font-black uppercase tracking-widest ${
          color === 'light' ? 'text-white' : 'text-gray-400'
        }`}
      >
        Loading
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

// Skeleton loader for blog posts
export const BlogSkeleton = () => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-4">
        <div className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
        <div className="space-y-2">
          <div className="w-3/4 h-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-2/3 h-3 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton loader for projects
export const ProjectsSkeleton = () => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
    {[1, 2].map((i) => (
      <div key={i} className="space-y-4">
        <div className="aspect-[16/9] bg-gray-200 rounded-3xl animate-pulse" />
        <div className="space-y-2">
          <div className="w-2/3 h-5 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton loader for products
export const ProductsSkeleton = () => (
  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="space-y-3">
        <div className="bg-gray-200 aspect-square rounded-2xl animate-pulse" />
        <div className="w-3/4 h-3 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-1/2 h-3 bg-gray-200 rounded-full animate-pulse" />
      </div>
    ))}
  </div>
);