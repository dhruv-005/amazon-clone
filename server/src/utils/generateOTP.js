// ============================================
// OTP GENERATION & VERIFICATION
// ============================================

import crypto from 'crypto';

/**
 * Generate numeric OTP
 * @param {number} length - OTP length (default: 6)
 * @returns {string} OTP string
 */
export const generateOTP = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Generate alphanumeric OTP
 * @param {number} length - OTP length
 * @returns {string} Alphanumeric OTP
 */
export const generateAlphanumericOTP = (length = 8) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let otp = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += chars[bytes[i] % chars.length];
  }
  return otp;
};

/**
 * Generate OTP with expiry
 * @param {number} length - OTP length
 * @param {number} expiryMinutes - Expiry in minutes
 * @returns {object} { otp, expiresAt }
 */
export const generateOTPWithExpiry = (length = 6, expiryMinutes = 10) => {
  const otp = generateOTP(length);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return { otp, expiresAt };
};

/**
 * Verify OTP
 * @param {string} inputOTP - User-provided OTP
 * @param {string} storedOTP - Stored OTP
 * @param {Date} expiresAt - OTP expiry time
 * @param {number} attempts - Number of attempts made
 * @param {number} maxAttempts - Maximum allowed attempts
 * @returns {object} { isValid, reason }
 */
export const verifyOTP = (inputOTP, storedOTP, expiresAt, attempts = 0, maxAttempts = 3) => {
  // Check max attempts
  if (attempts >= maxAttempts) {
    return {
      isValid: false,
      reason: 'Maximum OTP attempts exceeded. Please request a new OTP.',
    };
  }

  // Check expiry
  if (new Date() > new Date(expiresAt)) {
    return {
      isValid: false,
      reason: 'OTP has expired. Please request a new OTP.',
    };
  }

  // Check match
  if (inputOTP !== storedOTP) {
    return {
      isValid: false,
      reason: `Invalid OTP. ${maxAttempts - attempts - 1} attempts remaining.`,
    };
  }

  return {
    isValid: true,
    reason: 'OTP verified successfully.',
  };
};

/**
 * Hash OTP for storage (optional, for extra security)
 * @param {string} otp - Plain OTP
 * @returns {string} Hashed OTP
 */
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify hashed OTP
 * @param {string} inputOTP - User-provided OTP
 * @param {string} hashedOTP - Stored hashed OTP
 * @returns {boolean}
 */
export const verifyHashedOTP = (inputOTP, hashedOTP) => {
  const inputHash = hashOTP(inputOTP);
  return inputHash === hashedOTP;
};

export default {
  generateOTP,
  generateAlphanumericOTP,
  generateOTPWithExpiry,
  verifyOTP,
  hashOTP,
  verifyHashedOTP,
};
