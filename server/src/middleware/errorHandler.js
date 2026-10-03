import mongoose from 'mongoose';
import logger from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error with complete context
  if (error.statusCode >= 500) {
    logger.error('SERVER ERROR:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      user: req.user?._id,
    });
  } else {
    logger.warn(`CLIENT ${error.statusCode}: ${err.message} [${req.method} ${req.originalUrl}]`);
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, `Validation Error: ${messages.join(', ')}`);
  }

  // Mongoose Cast Error (Invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `Duplicate value for '${field}'. It already exists.`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please login again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired. Please login again.');
  }

  // Build JSON Response
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(response.statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

export default errorHandler;
