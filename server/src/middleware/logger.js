// ============================================
// REQUEST LOGGER MIDDLEWARE
// ============================================

import morgan from 'morgan';
import logger from '../config/logger.js';

/**
 * Morgan stream for Winston
 */
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

/**
 * Development Logger (detailed)
 * Usage: app.use(devLogger)
 */
export const devLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip: (req) => {
      // Skip logging for health checks and static files
      return (
        req.url === '/health' ||
        req.url.startsWith('/static') ||
        req.url.startsWith('/favicon')
      );
    },
  }
);

/**
 * Production Logger (combined format)
 * Usage: app.use(prodLogger)
 */
export const prodLogger = morgan('combined', {
  stream,
  skip: (req) => {
    return req.url === '/health';
  },
});

/**
 * Custom Detailed Logger
 * Usage: app.use(detailedLogger)
 */
export const detailedLogger = (req, res, next) => {
  const start = Date.now();

  // Capture original end method
  const originalEnd = res.end;

  res.end = function (...args) {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent']?.substring(0, 100),
      user: req.user?._id?.toString() || 'guest',
      contentLength: res.getHeader('content-length') || 0,
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      logger.error('REQUEST', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('REQUEST', logData);
    } else {
      logger.info('REQUEST', logData);
    }

    originalEnd.apply(res, args);
  };

  next();
};

/**
 * API Performance Logger
 * Logs slow requests (>1000ms)
 */
export const performanceLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    if (duration > 1000) {
      logger.warn('SLOW REQUEST', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        status: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Choose logger based on environment
 */
export const requestLogger = process.env.NODE_ENV === 'production'
  ? prodLogger
  : devLogger;

export default requestLogger;
