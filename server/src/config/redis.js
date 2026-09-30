// ============================================
// REDIS CONFIGURATION - Caching & Session Store
// ============================================

import Redis from 'ioredis';
import config from './index.js';
import logger from './logger.js';

let redisClient = null;
let isRedisDisabled = false;

/**
 * Initialize Redis Connection
 */
const connectRedis = () => {
  if (!config.redis.url) {
    if (!isRedisDisabled) {
      logger.info('Redis URL is empty. Caching is disabled (In-Memory fallback active).');
      isRedisDisabled = true;
    }
    return null;
  }

  try {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        // Stop trying to reconnect if it fails once
        if (times > 1) {
          logger.warn('Redis connection failed. Falling back to In-Memory cache.');
          isRedisDisabled = true;
          return null;
        }
        return 1000;
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis Connected Successfully');
    });

    redisClient.on('error', (err) => {
      logger.error(`❌ Redis Error: ${err.message}`);
      isRedisDisabled = true;
    });

    return redisClient;
  } catch (error) {
    logger.error(`Redis initialization failed: ${error.message}`);
    isRedisDisabled = true;
    return null;
  }
};

/**
 * Get Redis Client Instance
 */
export const getRedisClient = () => {
  if (isRedisDisabled) return null;
  if (!redisClient) {
    connectRedis();
  }
  return redisClient;
};

/**
 * Cache Helper - Get cached data
 */
export const getCache = async (key) => {
  if (isRedisDisabled) return null;
  try {
    const client = getRedisClient();
    if (!client) return null;

    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Cache Helper - Set cached data
 */
export const setCache = async (key, value, ttl = 3600) => {
  if (isRedisDisabled) return;
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    // Silent fail
  }
};

/**
 * Cache Helper - Delete cached data
 */
export const deleteCache = async (key) => {
  if (isRedisDisabled) return;
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    // Silent fail
  }
};

/**
 * Cache Helper - Delete by pattern
 */
export const deleteCacheByPattern = async (pattern) => {
  if (isRedisDisabled) return;
  try {
    const client = getRedisClient();
    if (!client) return;

    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    // Silent fail
  }
};

/**
 * Close Redis Connection
 */
export const closeRedis = async () => {
  try {
    if (redisClient) {
      await redisClient.quit();
    }
  } catch (error) {
    // Silent fail
  }
};

export default connectRedis;
