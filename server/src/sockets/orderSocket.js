import Order from '../models/Order.js';
import logger from '../config/logger.js';

/**
 * Register Live Order Tracking Socket Listeners
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export const registerOrderSocket = (io, socket) => {
  const userId = socket.user?._id?.toString();

  // Join order tracking room
  socket.on('order:track', async ({ orderId }) => {
    try {
      const order = await Order.findById(orderId).select('user orderNumber status tracking').lean();
      if (!order) {
        return socket.emit('order:error', { message: 'Order not found' });
      }

      // Allow order owner or admins/sellers to track
      const isOwner = userId && order.user.toString() === userId;
      const isAdminOrSeller = socket.user?.role === 'admin' || socket.user?.role === 'seller';

      if (isOwner || isAdminOrSeller || !userId) {
        socket.join(`order:${orderId}`);
        socket.emit('order:tracking_state', {
          orderId,
          status: order.status,
          tracking: order.tracking,
        });
      } else {
        socket.emit('order:error', { message: 'Unauthorized tracking access' });
      }
    } catch (error) {
      logger.error(`Socket order:track error: ${error.message}`);
    }
  });

  // Leave order tracking room
  socket.on('order:untrack', ({ orderId }) => {
    socket.leave(`order:${orderId}`);
  });

  // Courier/Delivery live location stream updates (Admin or Delivery Driver)
  socket.on('order:location_update', async ({ orderId, coordinates, locationName }) => {
    if (socket.user?.role !== 'admin' && socket.user?.role !== 'seller') {
      return socket.emit('order:error', { message: 'Unauthorized location broadcaster' });
    }

    try {
      const updateData = {
        orderId,
        coordinates, // { lat: Number, lng: Number }
        locationName,
        timestamp: new Date(),
      };

      // Broadcast to everyone currently viewing the live tracking map for this order
      io.to(`order:${orderId}`).emit('order:live_location', updateData);
    } catch (error) {
      logger.error(`Socket order:location_update error: ${error.message}`);
    }
  });
};

export default registerOrderSocket;
