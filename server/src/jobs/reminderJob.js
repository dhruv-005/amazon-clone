import { reminderQueue } from './queue.js';
import Cart from '../models/Cart.js';
import notificationService from '../services/notificationService.js';
import logger from '../config/logger.js';

export const REMINDER_JOB_TYPES = {
  ABANDONED_CART_CHECK: 'ABANDONED_CART_CHECK',
};

reminderQueue.process(async (job) => {
  const { type } = job.data;
  logger.info(`[ReminderJob] Executing: ${type}`);

  if (type === REMINDER_JOB_TYPES.ABANDONED_CART_CHECK) {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Carts with items not modified in 48 hours
    const carts = await Cart.find({
      'items.0': { $exists: true },
      updatedAt: { $lt: twoDaysAgo },
    }).populate('user', '_id name email');

    for (const cart of carts) {
      if (cart.user?._id) {
        await notificationService.sendNotification({
          userId: cart.user._id,
          type: 'deal_alert',
          title: 'You left items in your cart!',
          message: `Hi ${cart.user.name}, you have ${cart.items.length} items waiting in your Amazon cart. Complete your checkout today!`,
          data: { cartLink: '/cart' },
        });
      }
    }
    logger.info(`[ReminderJob] Sent cart reminders to ${carts.length} users`);
  }
});

export const triggerAbandonedCartCheck = () => {
  return reminderQueue.add({ type: REMINDER_JOB_TYPES.ABANDONED_CART_CHECK });
};

export default {
  REMINDER_JOB_TYPES,
  triggerAbandonedCartCheck,
};
