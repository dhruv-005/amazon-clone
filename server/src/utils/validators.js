// ============================================
// DATA VALIDATION HELPER FUNCTIONS
// ============================================

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/[\s\-\+]/g, '');
  const withoutCountry = cleaned.startsWith('91') ? cleaned.slice(2) : cleaned;
  return regex.test(withoutCountry);
};

/**
 * Validate Indian pincode
 * @param {string} pincode
 * @returns {boolean}
 */
export const isValidPincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

/**
 * Validate GST number (Indian)
 * @param {string} gst
 * @returns {boolean}
 */
export const isValidGST = (gst) => {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gst.toUpperCase());
};

/**
 * Validate PAN number (Indian)
 * @param {string} pan
 * @returns {boolean}
 */
export const isValidPAN = (pan) => {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan.toUpperCase());
};

/**
 * Validate IFSC code
 * @param {string} ifsc
 * @returns {boolean}
 */
export const isValidIFSC = (ifsc) => {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifsc.toUpperCase());
};

/**
 * Validate strong password
 * @param {string} password
 * @returns {object} { isValid, errors }
 */
export const isStrongPassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  return regex.test(id);
};

/**
 * Validate price
 * @param {number} price
 * @returns {boolean}
 */
export const isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0 && price <= 9999999;
};

/**
 * Validate quantity
 * @param {number} quantity
 * @returns {boolean}
 */
export const isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 999;
};

/**
 * Validate rating (1-5)
 * @param {number} rating
 * @returns {boolean}
 */
export const isValidRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

/**
 * Validate date string
 * @param {string} dateString
 * @returns {boolean}
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate future date
 * @param {string} dateString
 * @returns {boolean}
 */
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  return date > new Date();
};

/**
 * Validate past date
 * @param {string} dateString
 * @returns {boolean}
 */
export const isPastDate = (dateString) => {
  const date = new Date(dateString);
  return date < new Date();
};

/**
 * Validate file size
 * @param {number} size - Size in bytes
 * @param {number} maxSize - Max size in MB
 * @returns {boolean}
 */
export const isValidFileSize = (size, maxSizeMB = 10) => {
  return size <= maxSizeMB * 1024 * 1024;
};

/**
 * Validate file type
 * @param {string} mimeType
 * @param {string[]} allowedTypes
 * @returns {boolean}
 */
export const isValidFileType = (mimeType, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(mimeType);
};

/**
 * Validate credit card number (Luhn algorithm)
 * @param {string} cardNumber
 * @returns {boolean}
 */
export const isValidCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s|-/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate UPI ID
 * @param {string} upiId
 * @returns {boolean}
 */
export const isValidUPI = (upiId) => {
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(upiId);
};

/**
 * Sanitize and validate search query
 * @param {string} query
 * @returns {string} Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query) return '';
  return query
    .trim()
    .replace(/[<>{}[\]\\/]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 200);
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPincode,
  isValidGST,
  isValidPAN,
  isValidIFSC,
  isStrongPassword,
  isValidUrl,
  isValidObjectId,
  isValidPrice,
  isValidQuantity,
  isValidRating,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidFileSize,
  isValidFileType,
  isValidCardNumber,
  isValidUPI,
  sanitizeSearchQuery,
};
