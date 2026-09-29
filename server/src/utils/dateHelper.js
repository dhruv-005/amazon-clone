// ============================================
// DATE HELPER FUNCTIONS
// ============================================

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);

  const formats = {
    short: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    long: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    datetime: d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    iso: d.toISOString(),
    dateOnly: d.toISOString().split('T')[0],
    indian: d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  };

  return formats[format] || formats.short;
};

/**
 * Get estimated delivery date
 * @param {number} days - Delivery days
 * @param {boolean} isPrime - Prime member
 * @returns {object} { estimatedDate, displayText }
 */
export const getEstimatedDelivery = (days = 3, isPrime = false) => {
  const deliveryDays = isPrime ? Math.max(1, days - 2) : days;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + Math.max(1, deliveryDays - 1));

  return {
    estimatedDate,
    minDate,
    deliveryDays,
    displayText: isPrime
      ? `FREE Delivery by ${formatDate(estimatedDate, 'short')}`
      : `Delivery by ${formatDate(estimatedDate, 'short')}`,
    primeText: isPrime
      ? `Get it by ${formatDate(estimatedDate, 'short')} with Prime`
      : null,
  };
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
};

/**
 * Check if date is today
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is within range
 * @param {Date} date - Date to check
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {boolean}
 */
export const isWithinRange = (date, start, end) => {
  const d = new Date(date);
  return d >= new Date(start) && d <= new Date(end);
};

/**
 * Get start and end of day
 * @param {Date|string} date
 * @returns {object} { start, end }
 */
export const getDayBounds = (date = new Date()) => {
  const d = new Date(date);
  const start = new Date(d.setHours(0, 0, 0, 0));
  const end = new Date(d.setHours(23, 59, 59, 999));
  return { start, end };
};

/**
 * Get start and end of month
 * @param {number} year
 * @param {number} month (1-12)
 * @returns {object} { start, end }
 */
export const getMonthBounds = (year, month) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

/**
 * Get date range for last N days
 * @param {number} days
 * @returns {object} { start, end }
 */
export const getLastNDays = (days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
};

/**
 * Calculate days between two dates
 * @param {Date} date1
 * @param {Date} date2
 * @returns {number} Days difference
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Check if return window is still open
 * @param {Date} deliveryDate
 * @param {number} returnWindowDays
 * @returns {boolean}
 */
export const isReturnWindowOpen = (deliveryDate, returnWindowDays = 10) => {
  const deadline = addDays(deliveryDate, returnWindowDays);
  return new Date() <= deadline;
};

export default {
  formatDate,
  getEstimatedDelivery,
  getRelativeTime,
  isToday,
  isWithinRange,
  getDayBounds,
  getMonthBounds,
  getLastNDays,
  daysBetween,
  addDays,
  isReturnWindowOpen,
};
