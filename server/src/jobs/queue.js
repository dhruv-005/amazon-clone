import logger from '../config/logger.js';
import config from '../config/index.js';
import Bull from 'bull';

// Lightweight, completely silent in-memory queue implementation
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
          logger.error(`[InMemoryQueue:${this.name}] Job error: ${err.message}`);
        }
      }
    }, delay);
    return { id: `mock_${Date.now()}` };
  }
}

/**
 * Check if Redis is genuinely configured with a valid remote URL
 */
const isRedisConfigured = () => {
  const url = config.redis?.url;
  if (!url) return false;
  if (url === 'undefined' || url === 'null' || url === '') return false;
  
  // Do not attempt to connect to a local Redis instance on production servers (Render)
  if (config.env === 'production' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    return false;
  }
  
  return true;
};

/**
 * Factory to create or get a Bull Queue or fall back to an In-Memory Queue
 */
export const createQueue = (queueName) => {
  if (!isRedisConfigured()) {
    // Return completely silent local queue
    return new InMemoryQueue(queueName);
  }

  try {
    const queue = new Bull(queueName, config.redis.url, {
      redis: {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    queue.on('error', (error) => {
      // Suppress connection logs if they fallback gracefully
      logger.debug(`[Queue:${queueName}] Event Error: ${error.message}`);
    });

    queue.on('failed', (job, err) => {
      logger.error(`[Queue:${queueName}] Job ${job?.id} failed: ${err.message}`);
    });

    return queue;
  } catch (error) {
    return new InMemoryQueue(queueName);
  }
};

// Standard system queues
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
