import { orderQueue } from './queue.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import logger from '../config/logger.js';
import { emitToUser } from '../config/socket.js';

export const ORDER_JOB_TYPES = {
  AUTO_CANCEL_UNPAID: 'AUTO_CANCEL_UNPAID',
  UPDATE_DELIVERY_STATUS: 'UPDATE_DELIVERY_STATUS',
};

orderQueue.process(async (job) => {
  const { type, payload } = job.data;
  logger.info(`[OrderJob] Processing task ${type} for order ${payload.orderId}`);

  switch (type) {
    case ORDER_JOB_TYPES.AUTO_CANCEL_UNPAID: {
      const order = await Order.findById(payload.orderId);
      if (order && order.payment.status === 'pending' && order.payment.method !== 'cod') {
        order.status = 'cancelled';
        order.cancellationReason = 'Payment window expired (auto-cancelled)';
        order.cancelledBy = 'system';
        await order.save();

        // Release inventory back
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, totalSold: -item.quantity },
          });
        }

        emitToUser(order.user.toString(), 'order-cancelled', {
          orderId: order._id,
          reason: order.cancellationReason,
        });

        logger.info(`[OrderJob] Order #${order.orderNumber} auto-cancelled due to payment timeout`);
      }
      break;
    }

    case ORDER_JOB_TYPES.UPDATE_DELIVERY_STATUS: {
      const order = await Order.findById(payload.orderId);
      if (order && order.status === 'shipped') {
        order.status = 'out_for_delivery';
        order.tracking.updates.push({
          status: 'Out for Delivery',
          location: order.shippingAddress.city,
          description: 'Package is out with the local delivery agent',
          timestamp: new Date(),
        });
        await order.save();
        emitToUser(order.user.toString(), 'order-status', { orderId: order._id, status: 'out_for_delivery' });
      }
      break;
    }

    default:
      logger.warn(`[OrderJob] Unknown job type: ${type}`);
  }
});

/**
 * Schedule an auto-cancellation check for unpaid orders in 30 minutes
 */
export const scheduleUnpaidOrderCancellation = (orderId) => {
  const delay = 30 * 60 * 1000; // 30 mins
  return orderQueue.add(
    { type: ORDER_JOB_TYPES.AUTO_CANCEL_UNPAID, payload: { orderId } },
    { delay }
  );
};

export default {
  ORDER_JOB_TYPES,
  scheduleUnpaidOrderCancellation,
};
