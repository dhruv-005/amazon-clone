import logger from '../config/logger.js';
import config from '../config/index.js';

// In-Memory Queue (Runs background jobs safely without requiring external Redis)
class InMemoryQueue {
  constructor(name) {
    this.name = name;
    this.handlers = [];
  }

  process(handler) {
    this.handlers.push(handler);
  }

  async add(data, options = {}) {
    const delay = options.delay || 0;
    setTimeout(async () => {
      for (const handler of this.handlers) {
        try {
          await handler({ data });
        } catch (err) {
          logger.error(`[Job:${this.name}] Handler error: ${err.message}`);
        }
      }
    }, delay);
    return { id: `mem_${Date.now()}` };
  }
}

const isValidRedisUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return false;
  if (config.env === 'production' && (trimmed.includes('localhost') || trimmed.includes('127.0.0.1'))) {
    return false;
  }
  return trimmed.startsWith('redis://') || trimmed.startsWith('rediss://');
};

export const createQueue = (queueName) => {
  const redisUrl = config.redis?.url;

  if (!isValidRedisUrl(redisUrl)) {
    // Always use in-memory queue when Redis URL is not configured
    return new InMemoryQueue(queueName);
  }

  try {
    const Bull = require('bull');
    const queue = new Bull(queueName, redisUrl, {
      redis: {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      },
      defaultJobOptions: {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: true,
      },
    });

    queue.on('error', () => {});
    return queue;
  } catch (error) {
    return new InMemoryQueue(queueName);
  }
};

// System Queues
export const emailQueue = createQueue('email_queue');
export const orderQueue = createQueue('order_queue');
export const notificationQueue = createQueue('notification_queue');
export const cleanupQueue = createQueue('cleanup_queue');
export const analyticsQueue = createQueue('analytics_queue');
export const inventoryQueue = createQueue('inventory_queue');
export const reminderQueue = createQueue('reminder_queue');

export default {
  createQueue,
  emailQueue,
  orderQueue,
  notificationQueue,
  cleanupQueue,
  analyticsQueue,
  inventoryQueue,
  reminderQueue,
};
