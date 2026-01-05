import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText, 
  UploadCloud,
  Tag
} from 'lucide-react';

// 1. Define the specific Role names (Must match your Database strings!)
export type UserRole = 'super_admin' | 'accounts' | 'staff' | 'it';

// 2. Define the Navigation Structure
export const ADMIN_NAVIGATION = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard, 
    // Everyone can see the main overview
    roles: ['super_admin', 'accounts', 'staff', 'it'] 
  },
  { 
    name: 'Products', 
    href: '/admin/products', 
    icon: Package, 
    // Accounts team doesn't need to edit products
    roles: ['super_admin', 'staff', 'it'] 
  },
  { 
    name: 'Categories', 
    href: '/admin/products/categories', 
    icon: Tag, 
    // Accounts team doesn't need to edit categories
    roles: ['super_admin', 'staff', 'it'] 
  },
  { 
    name: 'Digital Uploads', 
    href: '/admin/digital-downloads', 
    icon: UploadCloud, 
    // Only technical staff who manage files
    roles: ['super_admin', 'staff', 'it'] 
  },
  { 
    name: 'Orders & Payments', 
    href: '/admin/orders', 
    icon: ShoppingCart, 
    // Staff shouldn't see sensitive financial data
    roles: ['super_admin', 'accounts', 'it'] 
  },
  { 
    name: 'Staff Team', 
    href: '/admin/users', 
    icon: Users, 
    // Only Admin and IT can add/remove employees
    roles: ['super_admin', 'it'] 
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings, 
    // Only Admin and IT should touch system configs
    roles: ['super_admin', 'it'] 
  }
];