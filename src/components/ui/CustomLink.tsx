import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function CustomLink({ 
  children, 
  size = 'md', 
  className = '', 
  ...props 
}: CustomLinkProps) {
  return (
    <Link 
      {...props} 
      className={`${sizeClasses[size]} font-bold transition-colors hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}