import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(text: string, length = 100): string {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}
