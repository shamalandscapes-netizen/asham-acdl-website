import { CURRENCY } from './constants';

/**
 * Formats a number as a currency string (e.g., "KES 1,500.00")
 * Uses the settings defined in your constants file.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 0, // KES usually doesn't need decimals for round numbers
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string or object into a readable string (e.g., "Dec 17, 2025")
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a date with time (e.g., "Dec 17, 2025 at 9:15 AM")
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
}

/**
 * Formats file size bytes into human readable format (e.g., "2.5 MB")
 * Useful for displaying digital product sizes.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats a plain number with commas (e.g., 10000 -> "10,000")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-KE').format(num);
}