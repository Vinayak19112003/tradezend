/**
 * @fileOverview Utility functions for the application
 *
 * This module provides common utility functions used throughout the application,
 * including class name merging, formatting helpers, and validation utilities.
 *
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and merges Tailwind CSS classes intelligently
 *
 * This function combines clsx for conditional class names with tailwind-merge
 * to properly handle conflicting Tailwind CSS classes. Later classes override earlier ones.
 *
 * @param inputs - Any number of class values (strings, objects, arrays)
 * @returns Merged class name string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Simple usage
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', isFocused ? 'focus-class' : 'blur-class')
 *
 * // Conflicting Tailwind classes (later wins)
 * cn('px-4', 'px-8')
 * // => 'px-8'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency with proper locale formatting
 *
 * @param amount - The numeric amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // => '$1,234.56'
 * formatCurrency(1234.56, 'EUR', 'de-DE') // => '1.234,56 €'
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formats a percentage value with specified decimal places
 *
 * @param value - The decimal value to format (e.g., 0.75 for 75%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercentage(0.7523) // => '75.23%'
 * formatPercentage(0.7523, 1) // => '75.2%'
 * ```
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Safely parses a number from a string or returns a default value
 *
 * @param value - String to parse
 * @param defaultValue - Value to return if parsing fails (default: 0)
 * @returns Parsed number or default value
 *
 * @example
 * ```ts
 * safeParseNumber('123.45') // => 123.45
 * safeParseNumber('invalid', 0) // => 0
 * ```
 */
export function safeParseNumber(value: string, defaultValue: number = 0): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 *
 * @example
 * ```ts
 * truncate('This is a long string', 10) // => 'This is a...'
 * truncate('Short', 10) // => 'Short'
 * ```
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

/**
 * Debounces a function call
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before calling function
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
