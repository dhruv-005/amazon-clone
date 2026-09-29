
// ============================================
// GLOBAL ERROR HANDLER MIDDLEWARE
// ============================================

import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Global Error Handler
 * Must be the LAST middleware in the app
 * Usage: app.use(errorHandler)
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  if (error.statusCode >= 500) {
    logger.error('SERVER ERROR:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
      user: req.user?._id,
    });
  } else {
    logger.warn('CLIENT ERROR:', {
      message: err.message,
      statusCode: error.statusCode,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // ---- MONGOOSE VALIDATION ERROR ----
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, `Validation Error: ${messages.join(', ')}`);
  }

  // ---- MONGOOSE CAST ERROR (Invalid ID) ----
  if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(
      400,
      `Invalid ${err.path}: ${err.value}. Please provide a valid ID.`
    );
  }

  // ---- MONGOOSE DUPLICATE KEY ERROR ----
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error = new ApiError(
      409,
      `Duplicate value for '${field}': '${value}'. This ${field} already exists.`
    );
  }

  // ---- JWT ERRORS ----
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please login again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired. Please login again.');
  }

  if (err.name === 'NotBeforeError') {
    error = new ApiError(401, 'Token is not yet active.');
  }

  // ---- MULTER ERRORS ----
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File too large. Maximum size is 10MB.');
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError(400, 'Too many files. Maximum 10 files allowed.');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError(400, `Unexpected file field: ${err.field}`);
  }

  // ---- SYNTAX ERROR (Malformed JSON) ----
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new ApiError(400, 'Malformed JSON in request body.');
  }

  // ---- RATE LIMIT ERROR ----
  if (err.statusCode === 429) {
    error = new ApiError(
      429,
      'Too many requests. Please try again later.'
    );
  }

  // ---- STRIPE ERRORS ----
  if (err.type?.startsWith('Stripe')) {
    error = new ApiError(
      400,
      `Payment error: ${err.message}`
    );
  }

  // ---- CLOUDINARY ERRORS ----
  if (err.http_code && err.name === 'Error') {
    error = new ApiError(
      500,
      `File upload error: ${err.message}`
    );
  }

  // ---- BUILD RESPONSE ----
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  // Add validation details if available
  if (err.errors) {
    response.details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  res.status(response.statusCode).json(response);
};

/**
 * 404 Not Found Handler
 * Usage: app.use(notFoundHandler)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

/**
 * Async Error Wrapper (Alternative to asyncHandler)
 * Usage: router.get('/', catchAsync(async (req, res) => { ... }))
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
