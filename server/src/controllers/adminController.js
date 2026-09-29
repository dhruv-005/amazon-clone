import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Seller from '../models/Seller.js';
import Review from '../models/Review.js';
import Setting from '../models/Setting.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingSellers,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Seller.countDocuments({ isVerified: false }),
    Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email').lean(),
  ]);

  const revenueAggregate = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'returned'] } } },
    { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
  ]);

  res.json(new ApiResponse(200, {
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingSellers,
      totalRevenue: revenueAggregate[0]?.totalRevenue || 0,
    },
    recentOrders,
  }));
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { role, search, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status === 'banned') filter.isBanned = true;
  if (status === 'active') { filter.isActive = true; filter.isBanned = false; }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password').lean(),
    User.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, users, total, page, limit, 'Users fetched');
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'seller', 'admin'].includes(role)) {
    throw new ApiError(400, 'Invalid role');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');

  if (!user) throw ApiError.userNotFound();
  res.json(new ApiResponse(200, { user }, 'User role updated'));
});

export const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.userNotFound();

  user.isBanned = !user.isBanned;
  await user.save();

  res.json(new ApiResponse(200, { isBanned: user.isBanned }, `User ${user.isBanned ? 'banned' : 'unbanned'}`));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { isApproved, isActive, search } = req.query;

  const filter = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.title = { $regex: search, $options: 'i' };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name email')
      .populate('category', 'name')
      .lean(),
    Product.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, products, total, page, limit, 'Products fetched');
});

export const toggleProductApproval = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.productNotFound();

  product.isApproved = !product.isApproved;
  await product.save();

  res.json(new ApiResponse(200, { isApproved: product.isApproved }, 'Product approval toggled'));
});

export const getSellers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { isVerified } = req.query;

  const filter = {};
  if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

  const [sellers, total] = await Promise.all([
    Seller.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone avatar')
      .lean(),
    Seller.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, sellers, total, page, limit, 'Sellers fetched');
});

export const verifySeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(404, 'Seller profile not found');

  seller.isVerified = true;
  seller.verifiedAt = new Date();
  await seller.save();

  res.json(new ApiResponse(200, { seller }, 'Seller verified'));
});

export const getSystemSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.find().lean();
  res.json(new ApiResponse(200, { settings }));
});

export const updateSystemSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    throw new ApiError(400, 'Settings object required');
  }

  await Setting.bulkUpdate(settings, req.user._id);
  res.json(new ApiResponse(200, null, 'Settings updated'));
});
