// lib/utils/format.ts
import { formatDistanceToNow, format as formatDate, formatCurrency as formatCurrencyFn } from 'date-fns';

/**
 * Format a date string to a human-readable relative time
 * @example formatRelativeTime('2024-01-15T10:30:00Z') // "2 hours ago"
 */
export function formatRelativeTime(date: string | Date): string {
  // Ensure we have a valid date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a date to a specific format
 * @example formatDateString('2024-01-15T10:30:00Z', 'MMM dd, yyyy') // "Jan 15, 2024"
 */
export function formatDateString(
  date: string | Date, 
  format: string = 'MMM dd, yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return formatDate(dateObj, format);
}

/**
 * Format a number as currency
 * @example formatCurrency(299.99) // "$299.99"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a number with commas
 * @example formatNumber(1234) // "1,234"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage
 * @example formatPercentage(0.9234) // "92.3%"
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}

/**
 * Truncate text with ellipsis
 * @example truncateText('This is a long text', 10) // "This is a ..."
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Format a trust score (0-1) to a readable string
 * @example formatTrustScore(0.85) // "High Trust (85%)"
 */
export function formatTrustScore(score: number): {
  label: string;
  color: string;
  percentage: string;
} {
  const percentage = score * 100;
  let label: string;
  let color: string;

  if (score >= 0.8) {
    label = 'High Trust';
    color = 'text-green-600 bg-green-100';
  } else if (score >= 0.5) {
    label = 'Medium Trust';
    color = 'text-yellow-600 bg-yellow-100';
  } else {
    label = 'Low Trust';
    color = 'text-red-600 bg-red-100';
  }

  return {
    label,
    color,
    percentage: formatPercentage(score)
  };
}

/**
 * Format file size in bytes to human readable
 * @example formatFileSize(1024) // "1 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format a phone number
 * @example formatPhoneNumber('1234567890') // "(123) 456-7890"
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Format a string as a slug for URLs
 * @example slugify('Hello World!') // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Capitalize first letter of each word
 * @example capitalizeWords('hello world') // "Hello World"
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Pluralize a word based on count
 * @example pluralize('user', 5) // "users"
 * @example pluralize('user', 1) // "user"
 */
export function pluralize(word: string, count: number): string {
  return count === 1 ? word : word + 's';
}

/**
 * Format a duration in seconds to human readable
 * @example formatDuration(3661) // "1h 1m 1s"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.length > 0 ? parts.join(' ') : '0s';
}

/**
 * Format a date to relative time with time
 * @example formatRelativeWithTime('2024-01-15T10:30:00Z') // "2 hours ago at 10:30 AM"
 */
export function formatRelativeWithTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const relative = formatDistanceToNow(dateObj, { addSuffix: true });
  const time = formatDate(dateObj, 'h:mm a');
  
  return `${relative} at ${time}`;
}

/**
 * Format a number as an ordinal (1st, 2nd, 3rd, etc.)
 * @example formatOrdinal(1) // "1st"
 * @example formatOrdinal(2) // "2nd"
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Get the time ago in a short format
 * @example formatShortTimeAgo('2024-01-15T10:30:00Z') // "2h ago"
 */
export function formatShortTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return formatDate(dateObj, 'MMM d, yyyy');
}