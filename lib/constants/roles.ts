export const ROLE_CONFIG = {
  // Admin roles that should access /admin route
  ADMIN_ROLES: ['super_admin', 'admin', 'accounts', 'employee', 'staff', 'contractor'],
  
  // Customer roles that should access /dashboard route
  CUSTOMER_ROLES: ['customer'],
  
  // Role-specific landing pages within each route
  ADMIN_DEFAULT_PAGES: {
    'super_admin': '/admin',
    'admin': '/admin',
    'accounts': '/admin/payments',
    'employee': '/admin/projects',
    'staff': '/admin/orders',
    'contractor': '/admin/projects'
  },
  
  CUSTOMER_DEFAULT_PAGES: {
    'customer': '/dashboard/my-orders'
  },
  
  // Welcome messages
  WELCOME_MESSAGES: {
    'super_admin': 'System Admin: Full control granted',
    'admin': 'Admin Portal: Operational control active',
    'accounts': 'Financial Dashboard: Payment access granted',
    'employee': 'Operations Portal: Project management active',
    'staff': 'Staff Portal: System access granted',
    'contractor': 'Contractor Portal: Project access granted',
    'customer': 'Customer Portal: Welcome'
  }
} as const;