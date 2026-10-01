import Redis from 'ioredis';
import config from './index.js';
import logger from './logger.js';

let redisClient = null;

const isValidRedisUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return false;
  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    return config.env !== 'production';
  }
  return trimmed.startsWith('redis://') || trimmed.startsWith('rediss://');
};

const connectRedis = () => {
  if (!isValidRedisUrl(config.redis?.url)) {
    return null;
  }

  try {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 1) return null; // stop reconnecting immediately
        return 1000;
      },
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis Connected Successfully');
    });

    redisClient.on('error', () => {
      // suppress error spam
      redisClient = null;
    });

    return redisClient;
  } catch (error) {
    redisClient = null;
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  } catch {
    // silent fallback
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch {
    // silent fallback
  }
};

export const deleteCacheByPattern = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch {
    // silent fallback
  }
};

export const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch {}
  }
};

export default connectRedis;
