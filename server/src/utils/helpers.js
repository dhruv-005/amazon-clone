// ============================================
// GENERAL HELPER FUNCTIONS
// ============================================

import crypto from 'crypto';

/**
 * Generate a unique ID
 * @param {number} length - Length of the ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = (length = 12) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

/**
 * Generate a random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
};

/**
 * Generate order number
 * @returns {string} Order number like ORD-20240115-AB12CD
 */
export const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = generateRandomString(6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
};

/**
 * Generate transaction ID
 * @returns {string} Transaction ID
 */
export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

/**
 * Generate invoice number
 * @returns {string} Invoice number
 */
export const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `INV-${year}-${random}`;
};

/**
 * Generate coupon code
 * @param {string} prefix - Code prefix
 * @param {number} length - Random part length
 * @returns {string} Coupon code
 */
export const generateCouponCode = (prefix = 'SAVE', length = 6) => {
  const random = generateRandomString(length).toUpperCase();
  return `${prefix}${random}`;
};

/**
 * Mask email address
 * @param {string} email - Email to mask
 * @returns {string} Masked email (j***@gmail.com)
 */
export const maskEmail = (email) => {
  if (!email) return '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

/**
 * Mask phone number
 * @param {string} phone - Phone to mask
 * @returns {string} Masked phone (***-***-1234)
 */
export const maskPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '***';
  return `***-***-${cleaned.slice(-4)}`;
};

/**
 * Mask card number
 * @param {string} cardNumber - Card number
 * @returns {string} Masked card (****-****-****-1234)
 */
export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const last4 = cardNumber.slice(-4);
  return `****-****-****-${last4}`;
};

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 100, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Remove HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} Title case string
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Pick specific keys from an object
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {object} New object with only specified keys
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

/**
 * Omit specific keys from an object
 * @param {object} obj - Source object
 * @param {string[]} keys - Keys to omit
 * @returns {object} New object without specified keys
 */
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

/**
 * Group array by a key
 * @param {array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {array} array - Array with duplicates
 * @param {string} key - Key to check uniqueness (optional)
 * @returns {array} Unique array
 */
export const unique = (array, key = null) => {
  if (!key) return [...new Set(array)];
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Sleep / Delay function
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get client IP address from request
 * @param {object} req - Express request object
 * @returns {string} IP address
 */
export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

/**
 * Parse boolean from string
 * @param {string} value - String value
 * @param {boolean} defaultValue - Default if parsing fails
 * @returns {boolean}
 */
export const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }
  return defaultValue;
};

export default {
  generateUniqueId,
  generateRandomString,
  generateOrderNumber,
  generateTransactionId,
  generateInvoiceNumber,
  generateCouponCode,
  maskEmail,
  maskPhone,
  maskCardNumber,
  truncate,
  stripHtml,
  titleCase,
  deepClone,
  isEmpty,
  pick,
  omit,
  groupBy,
  unique,
  sleep,
  getClientIP,
  parseBoolean,
};
