// ============================================
// RESPONSE CACHING MIDDLEWARE
// ============================================

import { getCache, setCache, deleteCache, deleteCacheByPattern } from '../config/redis.js';
import logger from '../config/logger.js';
import { CACHE_TTL } from '../config/constants.js';

/**
 * Cache middleware for GET requests
 * Usage: router.get('/products', cacheResponse(1800), controller)
 *
 * @param {number} ttl - Time to live in seconds
 * @param {string} prefix - Cache key prefix
 */
export const cacheResponse = (ttl = CACHE_TTL.MEDIUM, prefix = 'api') => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key from URL + query params
      const cacheKey = `${prefix}:${req.originalUrl}`;

      // Try to get from cache
      const cachedData = await getCache(cacheKey);

      if (cachedData) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        res.setHeader('X-Cache', 'HIT');
        return res.status(cachedData.statusCode || 200).json(cachedData.body);
      }

      logger.debug(`Cache MISS: ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, { statusCode: res.statusCode, body }, ttl)
            .catch((err) => logger.error(`Cache SET error: ${err.message}`));
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      // If cache fails, continue without caching
      logger.error(`Cache middleware error: ${error.message}`);
      next();
    }
  };
};

/**
 * Invalidate cache for specific patterns
 * Usage: invalidateCache('product:*')
 */
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    try {
      await deleteCacheByPattern(pattern);
      logger.info(`Cache invalidated: ${pattern}`);
    } catch (error) {
      logger.error(`Cache invalidation error: ${error.message}`);
    }
    next();
  };
};

/**
 * Cache invalidation middleware for mutations
 * Usage: router.post('/products', authenticate, clearRelatedCache('product'), controller)
 */
export const clearRelatedCache = (resource) => {
  return async (req, res, next) => {
    // Store original end method
    const originalEnd = res.end.bind(res);

    res.end = function (...args) {
      // Only clear cache on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patterns = [
          `${resource}:*`,
          `api:/${resource}*`,
          `api:/search*`,
        ];

        patterns.forEach((pattern) => {
          deleteCacheByPattern(pattern)
            .catch((err) => logger.error(`Cache clear error: ${err.message}`));
        });
      }

      return originalEnd(...args);
    };

    next();
  };
};

/**
 * No-cache middleware for sensitive data
 * Usage: router.get('/account', authenticate, noCache, controller)
 */
export const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

export default cacheResponse;
