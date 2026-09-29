// ============================================
// INPUT SANITIZATION MIDDLEWARE
// ============================================

import { ApiError } from '../utils/apiError.js';

/**
 * Escape HTML characters to prevent XSS
 */
const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Recursively sanitize object values
 */
const sanitizeObject = (obj, options = {}) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    let sanitized = obj.trim();

    // Escape HTML unless explicitly allowed
    if (!options.allowHtml) {
      sanitized = escapeHtml(sanitized);
    }

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

    // Limit length
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, options));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip certain fields that should allow HTML
      const allowHtmlFields = ['richDescription', 'html', 'content', 'message'];
      const fieldOptions = {
        ...options,
        allowHtml: allowHtmlFields.includes(key) || options.allowHtml,
      };
      sanitized[key] = sanitizeObject(value, fieldOptions);
    }
    return sanitized;
  }

  return obj;
};

/**
 * Sanitize Request Body
 * Usage: app.use(sanitizeBody)
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Sanitize Query Parameters
 * Usage: app.use(sanitizeQuery)
 */
export const sanitizeQuery = (req, res, next) => {
  if (req.query && Object.keys(req.query).length > 0) {
    req.query = sanitizeObject(req.query, { maxLength: 500 });
  }
  next();
};

/**
 * Sanitize URL Parameters
 * Usage: app.use(sanitizeParams)
 */
export const sanitizeParams = (req, res, next) => {
  if (req.params && Object.keys(req.params).length > 0) {
    req.params = sanitizeObject(req.params, { maxLength: 100 });
  }
  next();
};

/**
 * Combined Sanitization Middleware
 * Usage: app.use(sanitizeAll)
 */
export const sanitizeAll = (req, res, next) => {
  sanitizeBody(req, res, () => {
    sanitizeQuery(req, res, () => {
      sanitizeParams(req, res, next);
    });
  });
};

/**
 * SQL/NoSQL Injection Prevention
 * Usage: router.post('/login', preventInjection, controller)
 */
export const preventInjection = (req, res, next) => {
  const checkForInjection = (obj) => {
    if (!obj || typeof obj !== 'object') return false;

    for (const [key, value] of Object.entries(obj)) {
      // Check for MongoDB operators in user input
      if (key.startsWith('$') && key !== '$regex') {
        return true;
      }

      // Check for NoSQL injection patterns
      if (typeof value === 'object' && value !== null) {
        if (checkForInjection(value)) return true;
      }

      // Check for SQL injection patterns
      if (typeof value === 'string') {
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)/i,
          /(--|#|\/\*)/,
          /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
          /('\s*(OR|AND)\s+')/i,
        ];

        for (const pattern of sqlPatterns) {
          if (pattern.test(value)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  if (checkForInjection(req.body) || checkForInjection(req.query)) {
    throw new ApiError(400, 'Invalid input detected. Potential injection attempt.');
  }

  next();
};

/**
 * Content Type Validation
 * Usage: router.post('/api', validateContentType('application/json'), controller)
 */
export const validateContentType = (expectedType) => {
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next();
    }

    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes(expectedType)) {
      throw new ApiError(
        415,
        `Unsupported content type. Expected: ${expectedType}`
      );
    }

    next();
  };
};

export default sanitizeAll;
