import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSalesOverview = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const startDate = new Date(Date.now() - parseInt(period, 10) * 24 * 60 * 60 * 1000);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $nin: ['cancelled', 'returned'] },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(new ApiResponse(200, { salesData }));
});

export const getTopCategories = asyncHandler(async (req, res) => {
  const topCategories = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'productDoc',
      },
    },
    { $unwind: '$productDoc' },
    {
      $group: {
        _id: '$productDoc.category',
        salesCount: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 1,
        name: '$category.name',
        salesCount: 1,
        revenue: 1,
      },
    },
  ]);

  res.json(new ApiResponse(200, { topCategories }));
});
