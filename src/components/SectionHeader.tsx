// components/SectionHeader.tsx
'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  badge?: string;
  variant?: 'default' | 'minimal' | 'hero';
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  align = 'center',
  className = '',
  badge,
  variant = 'default'
}: SectionHeaderProps) {
  
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  };

  const variants = {
    default: {
      titleSize: 'text-3xl md:text-4xl lg:text-5xl',
      subtitleSize: 'text-lg md:text-xl',
      spacing: 'mb-12 md:mb-16'
    },
    minimal: {
      titleSize: 'text-2xl md:text-3xl',
      subtitleSize: 'text-base',
      spacing: 'mb-8'
    },
    hero: {
      titleSize: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
      subtitleSize: 'text-lg md:text-xl lg:text-2xl',
      spacing: 'mb-16 md:mb-24'
    }
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignClasses[align]} ${currentVariant.spacing} max-w-4xl ${className}`}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white rounded-full border border-[#06392F]/10 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C75B39]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#06392F]">
            {badge}
          </span>
        </motion.div>
      )}

      {/* Title with Character Animation */}
      <div className="mb-4 overflow-hidden md:mb-6">
        <motion.h2 
          className={`${currentVariant.titleSize} font-bold text-[#06392F] leading-[1.1] tracking-tight`}
          initial={{ y: 40 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {title.split(' ').map((word, index) => (
            <span key={index} className="inline-block mr-[0.25em]">
              {word.includes('span') ? (
                <span 
                  className="text-[#C75B39]"
                  dangerouslySetInnerHTML={{ 
                    __html: word.replace(/span\[([^\]]+)\]/, '$1') 
                  }}
                />
              ) : (
                word
              )}
              {index < title.split(' ').length - 1 && ''}
            </span>
          ))}
        </motion.h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p 
          className={`${currentVariant.subtitleSize} leading-relaxed text-[#06392F]/60 max-w-2xl`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Decorative Elements */}
      <motion.div 
        className={`flex items-center gap-4 mt-6 md:mt-8 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Primary Line */}
        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#C75B39] to-[#C75B39]/30 rounded-full" />
        
        {/* Dot Separator */}
        <div className="w-2 h-2 rounded-full bg-[#06392F]/20" />
        
        {/* Secondary Line */}
        <div className="h-px w-8 md:w-12 bg-[#06392F]/20 rounded-full" />
      </motion.div>
    </motion.div>
  );
}