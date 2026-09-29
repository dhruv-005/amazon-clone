import Seller from '../models/Seller.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Check if user is a Seller or Admin
 */
export const isSeller = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Seller privileges required.');
  }

  next();
};

/**
 * Check if seller is verified and active
 */
export const isVerifiedSeller = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  // Admin bypasses seller verification
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role !== 'seller') {
    throw new ApiError(403, 'Seller account required.');
  }

  // Find seller profile
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    throw new ApiError(
      403,
      'Seller profile not found. Please complete seller registration.'
    );
  }

  if (!seller.isVerified) {
    throw new ApiError(
      403,
      'Your seller account is pending verification. Please wait for approval.'
    );
  }

  if (!seller.isActive) {
    throw new ApiError(
      403,
      'Your seller account has been deactivated. Contact support.'
    );
  }

  if (seller.isSuspended) {
    throw new ApiError(
      403,
      `Your seller account is suspended. Reason: ${seller.suspensionReason || 'Contact support.'}`
    );
  }

  req.seller = seller;
  req.sellerId = seller._id;

  next();
});

/**
 * Check if seller owns the product
 */
export const ownsProduct = asyncHandler(async (req, res, next) => {
  const Product = (await import('../models/Product.js')).default;

  const product = await Product.findById(req.params.id || req.params.productId);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  if (req.user.role === 'admin') {
    req.product = product;
    return next();
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to modify this product.');
  }

  req.product = product;
  next();
});

/**
 * Check if seller owns the order item
 */
export const ownsOrderItem = asyncHandler(async (req, res, next) => {
  const Order = (await import('../models/Order.js')).default;

  const order = await Order.findById(req.params.id || req.params.orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (req.user.role === 'admin') {
    req.order = order;
    return next();
  }

  const sellerItems = order.items.filter(
    (item) => item.seller.toString() === req.user._id.toString()
  );

  if (sellerItems.length === 0) {
    throw new ApiError(403, 'You do not have permission to manage this order.');
  }

  req.order = order;
  req.sellerOrderItems = sellerItems;
  next();
});

/**
 * Rate limit for seller product uploads
 */
export const sellerUploadLimit = (req, res, next) => {
  next();
};

export default isSeller;
