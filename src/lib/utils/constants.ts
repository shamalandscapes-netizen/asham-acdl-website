export const SITE_CONFIG = {
  name: 'Asham Construction',
  description: 'Design, Build, Supply - Premier construction services and materials in Kenya.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.ashamconstruction.co.ke',
  ogImage: 'https://www.ashamconstruction.co.ke/og-image.jpg', // Placeholder image path
};

export const CONTACT_INFO = {
  email: 'info@ashamconstruction.co.ke', // Assumed based on domain
  phone: '0712 575 077', 
  address: 'Kakamega, Kenya',
  supportEmail: 'support@ashamconstruction.co.ke',
};

export const CURRENCY = {
  code: 'KES',
  symbol: 'KES',
  locale: 'en-KE',
};

export const STORAGE_BUCKETS = {
  products: 'product-images',
  digital: 'digital_downloads',
  avatars: 'avatars',
};

export const ROUTES = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  login: '/auth/login',
  register: '/auth/register',
  dashboard: '/dashboard',
  admin: '/admin',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING_PAYMENT',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  BANK: 'bank_transfer',
} as const;

export const ITEMS_PER_PAGE = 12;
