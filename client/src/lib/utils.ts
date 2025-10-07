/**
 * @fileoverview This file provides utility functions for the application.
 * It includes a helper for conditionally joining class names, which is a
 * common pattern in Tailwind CSS projects.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function that merges Tailwind CSS classes with clsx.
 * It allows for conditional class application and resolves conflicting
 * Tailwind classes intelligently.
 *
 * @param {...ClassValue[]} inputs - A list of class values to be merged.
 * @returns {string} The resulting string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
