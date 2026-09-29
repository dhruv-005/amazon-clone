import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getSystemWideMetrics = async () => {
  const [userCount, productCount, orderCount] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
  ]);

  const revenueAggregate = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'returned'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
  ]);

  return {
    totalUsers: userCount,
    totalProducts: productCount,
    totalOrders: orderCount,
    totalRevenue: revenueAggregate[0]?.totalRevenue || 0,
  };
};

export const getRevenueTimeline = async (days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $nin: ['cancelled', 'returned'] },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$pricing.total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export default {
  getSystemWideMetrics,
  getRevenueTimeline,
};
