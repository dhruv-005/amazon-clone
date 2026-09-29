import mongoose from 'mongoose';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const registerSeller = asyncHandler(async (req, res) => {
  const existing = await Seller.findOne({ user: req.user._id });
  if (existing) throw ApiError.conflict('Seller account already registered');

  const seller = await Seller.create({
    ...req.body,
    user: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

  res.status(201).json(new ApiResponse(201, { seller }, 'Seller application submitted successfully'));
});

export const getSellerDashboard = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id });
  if (!seller) throw new ApiError(404, 'Seller profile not found');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalProducts, totalOrders, recentOrders, pendingOrders] = await Promise.all([
    Product.countDocuments({ seller: req.user._id, isActive: true }),
    Order.countDocuments({ 'items.seller': req.user._id }),
    Order.find({ 'items.seller': req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean(),
    Order.countDocuments({
      'items.seller': req.user._id,
      status: { $in: ['placed', 'confirmed', 'processing'] },
    }),
  ]);

  const revenueData = await Order.aggregate([
    {
      $match: {
        'items.seller': req.user._id,
        status: { $nin: ['cancelled', 'returned'] },
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    { $unwind: '$items' },
    { $match: { 'items.seller': req.user._id } },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
  ]);

  res.json(new ApiResponse(200, {
    stats: {
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue30Days: revenueData[0]?.total || 0,
      sellerRating: seller.ratings.average,
      ratingCount: seller.ratings.count,
    },
    recentOrders,
  }));
});

export const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ user: req.user._id }).lean();
  if (!seller) throw new ApiError(404, 'Seller profile not found');
  res.json(new ApiResponse(200, { seller }));
});

export const updateSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOneAndUpdate(
    { user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!seller) throw new ApiError(404, 'Seller profile not found');
  res.json(new ApiResponse(200, { seller }, 'Seller profile updated'));
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { search, category, inStock, status } = req.query;

  const filter = { seller: req.user._id };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  } else if (inStock === 'false') {
    filter.stock = 0;
  }
  if (status === 'active') {
    filter.isActive = true;
  } else if (status === 'inactive') {
    filter.isActive = false;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .lean(),
    Product.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, products, total, page, limit, 'Seller products fetched');
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status } = req.query;

  const filter = { 'items.seller': req.user._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone')
      .lean(),
    Order.countDocuments(filter),
  ]);

  const sanitizedOrders = orders.map((order) => ({
    ...order,
    items: order.items.filter(
      (item) => item.seller.toString() === req.user._id.toString()
    ),
  }));

  sendPaginatedResponse(res, sanitizedOrders, total, page, limit, 'Seller orders fetched');
});

export const getSellerAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const days = parseInt(period, 10);
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const salesTrend = await Order.aggregate([
    {
      $match: {
        'items.seller': req.user._id,
        status: { $nin: ['cancelled', 'returned'] },
        createdAt: { $gte: startDate },
      },
    },
    { $unwind: '$items' },
    { $match: { 'items.seller': req.user._id } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        unitsSold: { $sum: '$items.quantity' },
        orders: { $addToSet: '$_id' },
      },
    },
    {
      $project: {
        _id: 1,
        revenue: 1,
        unitsSold: 1,
        orderCount: { $size: '$orders' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topSellingProducts = await Order.aggregate([
    {
      $match: {
        'items.seller': req.user._id,
        status: { $nin: ['cancelled', 'returned'] },
      },
    },
    { $unwind: '$items' },
    { $match: { 'items.seller': req.user._id } },
    {
      $group: {
        _id: '$items.product',
        title: { $first: '$items.title' },
        image: { $first: '$items.image' },
        unitsSold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 10 },
  ]);

  res.json(new ApiResponse(200, { salesTrend, topSellingProducts }));
});

export const getSellerReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const sellerProducts = await Product.find({ seller: req.user._id }).distinct('_id');

  const filter = { product: { $in: sellerProducts } };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name avatar')
      .populate('product', 'title images')
      .lean(),
    Review.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, reviews, total, page, limit, 'Seller reviews fetched');
});

export const respondToReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const review = await Review.findById(req.params.id).populate('product');

  if (!review) throw new ApiError(404, 'Review not found');
  if (review.product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only respond to reviews on your own products');
  }

  review.sellerResponse = {
    comment,
    respondedAt: new Date(),
    respondedBy: req.user._id,
  };

  await review.save();
  res.json(new ApiResponse(200, { review }, 'Response submitted'));
});
