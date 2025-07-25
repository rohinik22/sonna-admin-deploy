import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ┌─────────────────────────────────────┐
 * │  Utility fusion with artistic touch │
 * │             ~ Mr. Sweet ~           │
 * └─────────────────────────────────────┘
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
