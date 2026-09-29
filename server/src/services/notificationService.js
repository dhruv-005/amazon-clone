import Notification from '../models/Notification.js';
import { emitToUser } from '../config/socket.js';
import logger from '../config/logger.js';

export const sendNotification = async ({
  userId,
  type,
  title,
  message,
  data = {},
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      isRead: false,
    });

    // Real-time socket delivery
    emitToUser(userId.toString(), 'new_notification', notification);

    return notification;
  } catch (error) {
    logger.error(`Notification delivery failed for user ${userId}: ${error.message}`);
  }
};

export const notifyOrderStatusUpdate = async (user, order, status) => {
  const statusTitles = {
    confirmed: 'Order Confirmed',
    processing: 'Order Processing',
    shipped: 'Order Dispatched',
    delivered: 'Order Delivered',
    cancelled: 'Order Cancelled',
  };

  const title = statusTitles[status] || 'Order Status Update';
  const message = `Your order #${order.orderNumber} status is now: ${status.toUpperCase()}`;

  return sendNotification({
    userId: user._id,
    type: `order_${status}`,
    title,
    message,
    data: { orderId: order._id, orderNumber: order.orderNumber },
  });
};

export default {
  sendNotification,
  notifyOrderStatusUpdate,
};
