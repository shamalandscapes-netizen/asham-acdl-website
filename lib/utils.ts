import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Kenyan Shilling (KES) currency.
 * Usage: formatCurrency(2500) -> KES 2,500.00
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0, // Construction prices often don't need cents
  }).format(amount);
};

/**
 * Normalizes Kenyan phone numbers to the 254... format required by M-Pesa.
 * Handles: 07..., 01..., 7..., or +254...
 */
export const formatMpesaPhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, ''); // Remove all non-digits
  
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

/**
 * Standardized VAT calculation (16% for Kenya).
 * Helps maintain consistency between frontend and backend.
 */
export const calculateVAT = (totalWithVAT: number) => {
  const vatRate = 0.16;
  const subtotal = totalWithVAT / (1 + vatRate);
  const vatAmount = totalWithVAT - subtotal;
  
  return {
    subtotal,
    vatAmount,
    total: totalWithVAT
  };
};
