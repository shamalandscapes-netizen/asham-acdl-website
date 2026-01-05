import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  
  const variants = {
    default: "bg-[#06392F] text-white",      // Brand Primary
    secondary: "bg-[#C75B39] text-white",    // Brand Secondary
    success: "bg-green-100 text-green-700",  // Paid / Completed
    warning: "bg-orange-100 text-orange-700",// Pending / Low Stock
    error: "bg-red-100 text-red-700",        // Failed / Out of Stock
    info: "bg-blue-100 text-blue-700",       // Digital / Information
    outline: "border border-gray-200 text-gray-600 bg-transparent"
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;