import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently.
 * It handles conditional classes (like clsx) and resolves conflicts (like twMerge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}