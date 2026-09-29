import { getCache, setCache, deleteCache, deleteCacheByPattern } from '../config/redis.js';

export const getOrSetCache = async (key, fetchCallback, ttl = 3600) => {
  const cached = await getCache(key);
  if (cached) return cached;

  const data = await fetchCallback();
  if (data !== undefined && data !== null) {
    await setCache(key, data, ttl);
  }
  return data;
};

export const purgeEntityCache = async (entityPrefix) => {
  return deleteCacheByPattern(`${entityPrefix}:*`);
};

export default {
  getOrSetCache,
  purgeEntityCache,
  getCache,
  setCache,
  deleteCache,
};
