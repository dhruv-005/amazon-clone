import { analyticsQueue } from './queue.js';
import Order from '../models/Order.js';
import Seller from '../models/Seller.js';
import logger from '../config/logger.js';

export const ANALYTICS_JOB_TYPES = {
  RECALCULATE_SELLER_METRICS: 'RECALCULATE_SELLER_METRICS',
};

analyticsQueue.process(async (job) => {
  const { type, payload } = job.data;
  logger.info(`[AnalyticsJob] Processing: ${type}`);

  if (type === ANALYTICS_JOB_TYPES.RECALCULATE_SELLER_METRICS) {
    const { sellerId } = payload;
    const stats = await Order.aggregate([
      { $match: { 'items.seller': sellerId, status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $addToSet: '$_id' },
        },
      },
    ]);

    if (stats.length > 0) {
      await Seller.findOneAndUpdate(
        { user: sellerId },
        {
          totalSales: stats[0].totalSales,
          totalRevenue: stats[0].totalRevenue,
          totalOrders: stats[0].totalOrders.length,
        }
      );
    }
  }
});

export const triggerSellerMetricsRecalculation = (sellerId) => {
  return analyticsQueue.add({
    type: ANALYTICS_JOB_TYPES.RECALCULATE_SELLER_METRICS,
    payload: { sellerId },
  });
};

export default {
  ANALYTICS_JOB_TYPES,
  triggerSellerMetricsRecalculation,
};
