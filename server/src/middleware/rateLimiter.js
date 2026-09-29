// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================

import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Custom error handler for rate limiter
 */
const rateLimitHandler = (req, res) => {
  const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
  res.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    statusCode: 429,
    retryAfter,
  });
};

/**
 * General API Rate Limiter
 * Usage: app.use(generalLimiter)
 */
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
});

/**
 * Strict Rate Limiter (for auth endpoints)
 * Usage: router.post('/login', authLimiter, controller)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
});

/**
 * Registration Rate Limiter
 * Usage: router.post('/register', registerLimiter, controller)
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
});

/**
 * Password Reset Rate Limiter
 * Usage: router.post('/forgot-password', passwordResetLimiter, controller)
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again after 1 hour.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
});

/**
 * OTP Verification Rate Limiter
 * Usage: router.post('/verify-otp', otpLimiter, controller)
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 OTP attempts per 10 minutes
  message: {
    success: false,
    message: 'Too many OTP verification attempts. Please request a new OTP.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
});

/**
 * Search Rate Limiter
 * Usage: router.get('/search', searchLimiter, controller)
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    success: false,
    message: 'Too many search requests. Please slow down.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
});

/**
 * Upload Rate Limiter
 * Usage: router.post('/upload', uploadLimiter, controller)
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    message: 'Upload limit exceeded. Please try again later.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
});

/**
 * Order Placement Rate Limiter
 * Usage: router.post('/orders', orderLimiter, controller)
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour
  message: {
    success: false,
    message: 'Too many order attempts. Please try again later.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
});

/**
 * Review Rate Limiter
 * Usage: router.post('/reviews', reviewLimiter, controller)
 */
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reviews per hour
  message: {
    success: false,
    message: 'Too many reviews submitted. Please try again later.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
});

/**
 * API Rate Limiter (for public API endpoints)
 * Usage: router.get('/products', apiLimiter, controller)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes
  message: {
    success: false,
    message: 'API rate limit exceeded.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Payment Rate Limiter (strict)
 * Usage: router.post('/payments', paymentLimiter, controller)
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 payment attempts per hour
  message: {
    success: false,
    message: 'Too many payment attempts. Please try again later.',
    statusCode: 429,
  },
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip;
  },
});

export default generalLimiter;
