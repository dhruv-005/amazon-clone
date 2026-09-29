import Product from '../models/Product.js';
import Order from '../models/Order.js';
import BrowsingHistory from '../models/BrowsingHistory.js';
import mongoose from 'mongoose';

export const getFrequentlyBoughtTogether = async (productId, limit = 4) => {
  const targetId = new mongoose.Types.ObjectId(productId);

  const matchedOrders = await Order.aggregate([
    { $match: { 'items.product': targetId, status: 'delivered' } },
    { $unwind: '$items' },
    { $match: { 'items.product': { $ne: targetId } } },
    { $group: { _id: '$items.product', frequency: { $sum: 1 } } },
    { $sort: { frequency: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: '$product._id',
        title: '$product.title',
        slug: '$product.slug',
        images: '$product.images',
        price: '$product.price',
        ratings: '$product.ratings',
        frequency: 1,
      },
    },
  ]);

  return matchedOrders;
};

export const getSimilarProducts = async (product, limit = 8) => {
  return Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [
      { category: product.category },
      { tags: { $in: product.tags || [] } },
      { brand: product.brand },
    ],
  })
    .sort({ 'ratings.average': -1, totalSold: -1 })
    .limit(limit)
    .select('title slug images price ratings stock isPrimeEligible')
    .lean();
};

export const getUserPersonalizedFeed = async (userId, limit = 12) => {
  if (!userId) {
    return Product.find({ isActive: true, isApproved: true })
      .sort({ totalSold: -1, 'ratings.average': -1 })
      .limit(limit)
      .lean();
  }

  const history = await BrowsingHistory.find({ user: userId })
    .sort({ viewedAt: -1 })
    .limit(8)
    .populate('product', 'category brand tags')
    .lean();

  const categories = history.map((h) => h.product?.category).filter(Boolean);
  const brands = history.map((h) => h.product?.brand).filter(Boolean);

  if (!categories.length && !brands.length) {
    return Product.find({ isActive: true, isApproved: true })
      .sort({ totalSold: -1 })
      .limit(limit)
      .lean();
  }

  return Product.find({
    isActive: true,
    isApproved: true,
    $or: [{ category: { $in: categories } }, { brand: { $in: brands } }],
  })
    .sort({ 'ratings.average': -1, totalSold: -1 })
    .limit(limit)
    .lean();
};

export default {
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getUserPersonalizedFeed,
};
