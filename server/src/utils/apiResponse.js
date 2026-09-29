// ============================================
// STANDARDIZED API RESPONSE CLASS
// ============================================

/**
 * Success Response Class
 * Usage: res.status(200).json(new ApiResponse(200, data, "Success"))
 */
export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  // Static factory methods for common responses
  static ok(data, message = 'Success') {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static accepted(data, message = 'Request accepted') {
    return new ApiResponse(202, data, message);
  }

  static noContent() {
    return new ApiResponse(204, null, 'No content');
  }

  static paginated(data, pagination, message = 'Success') {
    return new ApiResponse(200, {
      items: data,
      pagination,
    }, message);
  }

  static deleted(message = 'Resource deleted successfully') {
    return new ApiResponse(200, null, message);
  }

  static updated(data, message = 'Resource updated successfully') {
    return new ApiResponse(200, data, message);
  }
}

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Response message
 */
export const sendPaginatedResponse = (res, data, total, page, limit, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(200).json(new ApiResponse(200, {
    items: data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  }, message));
};

/**
 * Send success response
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * Send created response
 */
export const sendCreated = (res, data, message = 'Created successfully') => {
  return res.status(201).json(new ApiResponse(201, data, message));
};

/**
 * Send error response
 */
export const sendError = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

export default ApiResponse;
