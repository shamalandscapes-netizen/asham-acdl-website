export type Role =
  | 'super_admin'
  | 'admin'
  | 'accounts'
  | 'employee';

export const ROLE_PERMISSIONS = {
  super_admin: {
    overview: true,
    orders: true,
    override_orders: true,
    products: true,
    stock: true,
    users: true,
    finance: true,
    reports: true,
    invoices: true,
    payments: true,
    blog_create: true,
    blog_edit: true,
    blog_delete: true,
    settings: true,
  },

  admin: {
    overview: false,
    orders: true,
    override_orders: false,
    products: true,
    stock: true,
    users: true,
    finance: false,
    reports: false,
    invoices: false,
    payments: false,
    blog_create: true,
    blog_edit: true,
    blog_delete: true,
    settings: false,
  },

  accounts: {
    overview: false,
    orders: true,
    override_orders: false,
    products: false,
    stock: false,
    users: false,
    finance: true,
    reports: true,
    invoices: true,
    payments: true,
    blog_create: false,
    blog_edit: false,
    blog_delete: false,
    settings: false,
  },

  employee: {
    overview: false,
    orders: true,
    override_orders: false,
    products: false,
    stock: true,
    users: false,
    finance: false,
    reports: false,
    invoices: false,
    payments: false,
    blog_create: true,
    blog_edit: true,
    blog_delete: false,
    settings: false,
  },
} as const;
