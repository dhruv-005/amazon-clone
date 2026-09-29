// ============================================
// REDIS CONFIGURATION - Caching & Session Store
// ============================================

import Redis from 'ioredis';
import config from './index.js';
import logger from './logger.js';

let redisClient = null;

/**
 * Initialize Redis Connection
 */
const connectRedis = () => {
  try {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis Connected Successfully');
    });

    redisClient.on('error', (err) => {
      logger.error(`❌ Redis Connection Error: ${err.message}`);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    return redisClient;
  } catch (error) {
    logger.error(`Redis initialization failed: ${error.message}`);
    return null;
  }
};

/**
 * Get Redis Client Instance
 */
export const getRedisClient = () => {
  if (!redisClient) {
    connectRedis();
  }
  return redisClient;
};

/**
 * Cache Helper - Get cached data
 * @param {string} key - Cache key
 * @returns {any} Parsed cached data or null
 */
export const getCache = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Redis GET error [${key}]: ${error.message}`);
    return null;
  }
};

/**
 * Cache Helper - Set cached data
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 */
export const setCache = async (key, value, ttl = 3600) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Redis SET error [${key}]: ${error.message}`);
  }
};

/**
 * Cache Helper - Delete cached data
 * @param {string} key - Cache key
 */
export const deleteCache = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    logger.error(`Redis DEL error [${key}]: ${error.message}`);
  }
};

/**
 * Cache Helper - Delete by pattern
 * @param {string} pattern - Key pattern (e.g., "product:*")
 */
export const deleteCacheByPattern = async (pattern) => {
  try {
    const client = getRedisClient();
    if (!client) return;

    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      logger.info(`Deleted ${keys.length} cache keys matching: ${pattern}`);
    }
  } catch (error) {
    logger.error(`Redis pattern delete error: ${error.message}`);
  }
};

/**
 * Close Redis Connection
 */
export const closeRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis connection closed');
    }
  } catch (error) {
    logger.error(`Redis close error: ${error.message}`);
  }
};

export default connectRedis;
