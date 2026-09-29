// ============================================
// CUSTOM API ERROR CLASS
// ============================================

/**
 * Custom API Error Class
 * Usage: throw new ApiError(404, "Product not found")
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
    this.isOperational = isOperational;
    this.success = false;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ---- 400 Bad Request ----
  static badRequest(message = 'Bad request', details = null) {
    return new ApiError(400, message, details);
  }

  static validationError(message = 'Validation failed', details = null) {
    return new ApiError(400, message, details);
  }

  // ---- 401 Unauthorized ----
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, message);
  }

  static invalidToken(message = 'Invalid or expired token') {
    return new ApiError(401, message);
  }

  // ---- 403 Forbidden ----
  static forbidden(message = 'Access denied') {
    return new ApiError(403, message);
  }

  static insufficientPermissions(message = 'Insufficient permissions') {
    return new ApiError(403, message);
  }

  // ---- 404 Not Found ----
  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`);
  }

  static productNotFound() {
    return new ApiError(404, 'Product not found');
  }

  static userNotFound() {
    return new ApiError(404, 'User not found');
  }

  static orderNotFound() {
    return new ApiError(404, 'Order not found');
  }

  static categoryNotFound() {
    return new ApiError(404, 'Category not found');
  }

  // ---- 409 Conflict ----
  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message);
  }

  static duplicateEmail() {
    return new ApiError(409, 'Email already registered');
  }

  static alreadyReviewed() {
    return new ApiError(409, 'You have already reviewed this product');
  }

  // ---- 422 Unprocessable Entity ----
  static unprocessable(message = 'Unprocessable entity', details = null) {
    return new ApiError(422, message, details);
  }

  static insufficientStock(message = 'Insufficient stock') {
    return new ApiError(422, message);
  }

  // ---- 429 Too Many Requests ----
  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new ApiError(429, message);
  }

  // ---- 500 Internal Server Error ----
  static internal(message = 'Internal server error') {
    return new ApiError(500, message, null, false);
  }

  static databaseError(message = 'Database error occurred') {
    return new ApiError(500, message, null, false);
  }

  static paymentError(message = 'Payment processing failed') {
    return new ApiError(500, message);
  }

  static uploadError(message = 'File upload failed') {
    return new ApiError(500, message);
  }

  // ---- 503 Service Unavailable ----
  static serviceUnavailable(message = 'Service temporarily unavailable') {
    return new ApiError(503, message, null, false);
  }

  // Method: Convert to JSON
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export default ApiError;
