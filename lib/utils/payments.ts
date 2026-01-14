import { ORDER_STATUS } from './constants';

/**
 * Formats a Kenyan phone number to the format required by M-Pesa STK Push (2547XXXXXXXX).
 * * Handles:
 * - 07XX... -> 2547XX...
 * - +2547XX... -> 2547XX...
 * - 7XX... -> 2547XX...
 * - Removes spaces and special characters.
 * * @param phone The raw phone number string input by the user.
 * @returns The formatted string or throws an error if invalid.
 */
export function formatMpesaPhone(phone: string): string {
  // 1. Remove all non-numeric characters (spaces, dashes, plus signs)
  let cleaned = phone.replace(/\D/g, '');

  // 2. Handle 07... or 01... format
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }

  // 3. Handle 7... or 1... format (missing prefix)
  if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }

  // 4. Validate final length (should be 12 digits: 254 7XX XXX XXX)
  if (cleaned.length !== 12 || !cleaned.startsWith('254')) {
    throw new Error('Invalid Kenyan phone number format. Please use 07XX... or 01XX...');
  }

  return cleaned;
}

/**
 * Validates if a string is a potentially valid Safaricom/Airtel number.
 */
export function isValidKenyanPhone(phone: string): boolean {
  try {
    formatMpesaPhone(phone);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Returns a color class for a given order status to be used in UI Badges.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case ORDER_STATUS.COMPLETED:
      return 'bg-green-100 text-green-800 border-green-200';
    case ORDER_STATUS.PROCESSING:
    case ORDER_STATUS.SHIPPED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ORDER_STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ORDER_STATUS.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Helper to display readable status labels.
 * e.g. "PENDING_PAYMENT" -> "Pending Payment"
 */
export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
