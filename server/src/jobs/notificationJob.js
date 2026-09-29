import { notificationQueue } from './queue.js';
import notificationService from '../services/notificationService.js';
import logger from '../config/logger.js';

notificationQueue.process(async (job) => {
  const { userId, type, title, message, data } = job.data;
  logger.info(`[NotificationJob] Sending alert '${title}' to user ${userId}`);

  try {
    await notificationService.sendNotification({
      userId,
      type,
      title,
      message,
      data,
    });
  } catch (err) {
    logger.error(`[NotificationJob] Failed to dispatch notification: ${err.message}`);
    throw err;
  }
});

export const scheduleNotification = (notificationData, delayMs = 0) => {
  return notificationQueue.add(notificationData, { delay: delayMs });
};

export default {
  scheduleNotification,
};
