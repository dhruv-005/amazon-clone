import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Verify JWT Access Token & Attach User to Request
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Check cookies
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // 3. Check query param
  if (!token && req.query?.token) {
    token = req.query.token;
  }

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided. Please login.');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);

    const user = await User.findById(decoded.id).select(
      '-password -otp -resetPasswordToken -resetPasswordExpire'
    );

    if (!user) {
      throw new ApiError(401, 'User not found. Token is invalid.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated.');
    }

    if (user.isBanned) {
      throw new ApiError(403, 'Your account has been banned.');
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token. Please login again.');
    }
    throw error;
  }
});

/**
 * Optional Authentication (for public browsing with user state)
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findById(decoded.id).select('-password -otp');
      if (user && user.isActive && !user.isBanned) {
        req.user = user;
        req.userId = user._id;
        req.userRole = user.role;
      }
    } catch {
      req.user = null;
    }
  }

  next();
});

/**
 * Refresh Token Verification
 */
export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token not provided.');
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive || user.isBanned) {
      throw new ApiError(401, 'User session invalid.');
    }

    req.user = user;
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token.');
  }
});

export const requireVerified = (req, res, next) => {
  if (!req.user?.isVerified) {
    throw new ApiError(403, 'Please verify your email to perform this action.');
  }
  next();
};

export const requirePrime = (req, res, next) => {
  if (!req.user?.isPrimeActive?.()) {
    throw new ApiError(403, 'This feature requires Prime membership.');
  }
  next();
};

export default authenticate;
