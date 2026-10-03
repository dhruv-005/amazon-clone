// ============================================
// RATE LIMITING MIDDLEWARE (Proxy-Safe)
// ============================================

import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * Custom error handler for rate limiters
 */
const rateLimitHandler = (req, res) => {
  const retryAfter = req.rateLimit?.resetTime
    ? Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    : 60;

  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    statusCode: 429,
    retryAfter,
  });
};

const defaultOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  validate: { xForwardedForHeader: false },
};

/**
 * General API Rate Limiter
 */
export const generalLimiter = rateLimit({
  ...defaultOptions,
  windowMs: config.rateLimit.windowMs || 15 * 60 * 1000,
  max: config.rateLimit.max || 200,
});

/**
 * Strict Rate Limiter (for login)
 */
export const authLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

/**
 * Registration Rate Limiter
 */
export const registerLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 15,
});

/**
 * Password Reset Rate Limiter
 */
export const passwordResetLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 10,
});

/**
 * OTP Verification Rate Limiter
 */
export const otpLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 10 * 60 * 1000,
  max: 15,
});

/**
 * Search Rate Limiter
 */
export const searchLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 1000,
  max: 60,
});

/**
 * Upload Rate Limiter
 */
export const uploadLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 100,
});

/**
 * Order Placement Rate Limiter
 */
export const orderLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

/**
 * Review Rate Limiter
 */
export const reviewLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

/**
 * Payment Rate Limiter
 */
export const paymentLimiter = rateLimit({
  ...defaultOptions,
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

export default generalLimiter;
