'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{ 
        style: { 
          borderRadius: '10px', 
          background: '#06392F', // Brand color
          color: '#fff', 
        } 
      }} 
    />
  );
}