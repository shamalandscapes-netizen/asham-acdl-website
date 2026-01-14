/**
 * Validates that an email address is in a proper format.
 * Uses a standard regular expression for email validation.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that a password meets minimum security requirements.
 * Current Rule: At least 6 characters long.
 * You can expand this to check for numbers/special chars if needed.
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Checks if a required field is empty.
 * Returns true if the value is valid (not empty), false otherwise.
 */
export function validateRequired(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validates a standard Kenyan M-Pesa Transaction Code.
 * Format: 10 characters, alphanumeric, usually starts with a letter (e.g., QDH5...)
 */
export function validateMpesaCode(code: string): boolean {
  const mpesaRegex = /^[A-Z0-9]{10}$/;
  return mpesaRegex.test(code.toUpperCase());
}

/**
 * Validates a Kenyan National ID (simple length check).
 * usually 7 or 8 digits.
 */
export function validateNationalId(id: string): boolean {
  const idRegex = /^\d{7,8}$/;
  return idRegex.test(id);
}

/**
 * Validates a KRA PIN format.
 * Format: A + 9 digits + A (e.g., A123456789Z)
 */
export function validateKraPin(pin: string): boolean {
  const pinRegex = /^[A-Z]\d{9}[A-Z]$/;
  return pinRegex.test(pin.toUpperCase());
}
