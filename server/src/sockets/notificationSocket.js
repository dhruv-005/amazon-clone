import Notification from '../models/Notification.js';
import logger from '../config/logger.js';

/**
 * Register Real-Time Notification Socket Listeners
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export const registerNotificationSocket = (io, socket) => {
  const userId = socket.user?._id?.toString();

  // Mark a single notification as read in real-time
  socket.on('notification:read', async ({ notificationId }) => {
    if (!userId) return;

    try {
      await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { $set: { isRead: true, readAt: new Date() } }
      );

      // Emit back to all user's connected tabs/devices
      io.to(`user:${userId}`).emit('notification:updated', {
        notificationId,
        isRead: true,
      });
    } catch (error) {
      logger.error(`Socket notification:read error: ${error.message}`);
    }
  });

  // Mark all notifications as read
  socket.on('notification:read_all', async () => {
    if (!userId) return;

    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      io.to(`user:${userId}`).emit('notification:all_read');
    } catch (error) {
      logger.error(`Socket notification:read_all error: ${error.message}`);
    }
  });

  // Request unread notification badge count
  socket.on('notification:get_unread_count', async () => {
    if (!userId) return;

    try {
      const count = await Notification.countDocuments({
        user: userId,
        isRead: false,
      });

      socket.emit('notification:unread_count', { count });
    } catch (error) {
      logger.error(`Socket notification:get_unread_count error: ${error.message}`);
    }
  });
};

export default registerNotificationSocket;
