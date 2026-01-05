'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string; // Added to allow extra custom styling if needed
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'center',
  className = ''
}: SectionHeaderProps) {
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${alignClasses[align]} mb-12 ${className}`}
    >
      <h2 className="mb-4 text-3xl md:text-4xl font-bold text-[#06392F] tracking-tight">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-lg leading-relaxed text-gray-600">
          {subtitle}
        </p>
      )}
      
      {/* Optional decorative underline for centered headers */}
      {align === 'center' && (
        <div className="w-24 h-1 bg-[#C75B39] mx-auto mt-6 rounded-full opacity-80"></div>
      )}
    </motion.div>
  );
}