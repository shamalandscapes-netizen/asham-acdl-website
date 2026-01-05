export const THEME = {
  colors: {
    // Matches the "Slate" palette used in globals.css
    primary: '#0F172A', // Slate 900 (Dark Navy/Black)
    secondary: '#F1F5F9', // Slate 100 (Light Gray)
    accent: '#000000', // Pure Black
    
    background: '#FFFFFF',
    text: {
      main: '#020617', // Slate 950
      muted: '#64748B', // Slate 500
      light: '#94A3B8', // Slate 400
    },
    
    border: '#E2E8F0', // Slate 200
    
    status: {
      success: '#22c55e', // Green 500
      error: '#ef4444',   // Red 500
      warning: '#f59e0b', // Amber 500
      info: '#3b82f6',    // Blue 500
    }
  },

  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1400,
  },

  layout: {
    containerPadding: '2rem',
    sectionSpacing: '4rem',
    borderRadius: '0.5rem',
  },
  
  fonts: {
    heading: 'var(--font-inter)', // references the CSS variable from Next.js font
    body: 'var(--font-inter)',
  }
} as const;