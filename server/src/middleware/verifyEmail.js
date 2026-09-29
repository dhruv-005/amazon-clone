// ============================================
// EMAIL VERIFICATION MIDDLEWARE
// ============================================

import { ApiError } from '../utils/apiError.js';

/**
 * Check if user's email is verified
 * Usage: router.post('/orders', authenticate, requireEmailVerification, controller)
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to continue.',
      statusCode: 403,
      code: 'EMAIL_NOT_VERIFIED',
      data: {
        email: req.user.email,
        canResend: true,
      },
    });
  }

  next();
};

/**
 * Check if user's phone is verified (optional)
 * Usage: router.post('/cod-order', authenticate, requirePhoneVerification, controller)
 */
export const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (!req.user.phone || !req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your phone number to continue.',
      statusCode: 403,
      code: 'PHONE_NOT_VERIFIED',
    });
  }

  next();
};

/**
 * Check account completeness for sellers
 * Usage: router.post('/seller/products', authenticate, requireCompleteProfile, controller)
 */
export const requireCompleteProfile = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  const missingFields = [];

  if (!req.user.name) missingFields.push('name');
  if (!req.user.email) missingFields.push('email');
  if (!req.user.phone) missingFields.push('phone');
  if (!req.user.isVerified) missingFields.push('email verification');

  if (missingFields.length > 0) {
    return res.status(403).json({
      success: false,
      message: 'Please complete your profile before continuing.',
      statusCode: 403,
      code: 'INCOMPLETE_PROFILE',
      data: { missingFields },
    });
  }

  next();
};

/**
 * Check if account is not locked
 * Usage: router.post('/login', checkAccountLock, controller)
 */
export const checkAccountLock = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  if (req.user.isBanned) {
    throw new ApiError(
      403,
      'Your account has been permanently banned. Contact support for assistance.'
    );
  }

  if (!req.user.isActive) {
    throw new ApiError(
      403,
      'Your account has been deactivated. Contact support for assistance.'
    );
  }

  // Check if account is temporarily locked
  if (req.user.lockUntil && req.user.lockUntil > new Date()) {
    const remainingMinutes = Math.ceil(
      (req.user.lockUntil - new Date()) / (1000 * 60)
    );
    throw new ApiError(
      423,
      `Your account is temporarily locked. Try again in ${remainingMinutes} minutes.`
    );
  }

  next();
};

/**
 * Check if user has completed at least one purchase
 * (for review eligibility)
 * Usage: router.post('/reviews', authenticate, requirePurchase, controller)
 */
export const requirePurchase = async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  try {
    const Order = (await import('../models/Order.js')).default;

    const hasCompletedOrder = await Order.exists({
      user: req.user._id,
      status: 'delivered',
    });

    if (!hasCompletedOrder) {
      throw new ApiError(
        403,
        'You need to complete at least one purchase before performing this action.'
      );
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    next(error);
  }
};

export default requireEmailVerification;
