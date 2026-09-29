import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { calculateOrderTotals } from '../utils/priceCalculator.js';
import { generateOrderNumber } from '../utils/helpers.js';
import { getEstimatedDelivery } from '../utils/dateHelper.js';
import { sendOrderConfirmationEmail } from '../config/email.js';
import { emitToUser } from '../config/socket.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, notes, isGift, giftMessage } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, 'Order must have at least one item');
  }

  // Validate products and stock
  const products = await Product.find({
    _id: { $in: items.map((i) => i.product) },
  });

  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);
    if (!product) throw new ApiError(404, `Product not found: ${item.product}`);
    if (product.stock < item.quantity) {
      throw ApiError.insufficientStock(`${product.title} - only ${product.stock} left`);
    }
    return {
      product: product._id,
      seller: product.seller,
      title: product.title,
      image: product.images?.[0]?.url,
      price: product.price.current,
      originalPrice: product.price.original,
      quantity: item.quantity,
      variant: item.variant,
    };
  });

  // Calculate pricing
  const pricing = calculateOrderTotals(orderItems, {
    isPrime: req.user.isPrime,
    couponDiscount: req.body.couponDiscount || 0,
    couponCode: req.body.couponCode,
  });

  const delivery = getEstimatedDelivery(3, req.user.isPrime);

  // Create order (COD by default)
  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: 'cod',
      status: 'completed',
      gateway: 'cod',
      paidAt: new Date(),
    },
    pricing,
    estimatedDelivery: delivery.estimatedDate,
    notes,
    isGift,
    giftMessage,
    isPrimeOrder: req.user.isPrime,
    status: 'confirmed',
  });

  // Decrease stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, totalSold: item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], $unset: { couponApplied: 1 } }
  );

  // Send confirmation email
  await sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch(() => {});

  // Notify via socket
  emitToUser(req.user._id.toString(), 'order-placed', {
    orderId: order._id,
    orderNumber: order.orderNumber,
  });

  res.status(201).json(new ApiResponse(201, { order }, 'Order placed successfully (COD)'));
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'title slug images')
      .lean(),
    Order.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, orders, total, page, limit, 'Orders fetched');
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate('items.product', 'title slug images price')
    .lean();

  if (!order) throw ApiError.orderNotFound();
  res.json(new ApiResponse(200, { order }));
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) throw ApiError.orderNotFound();
  if (!order.isCancellable) throw new ApiError(400, 'Order cannot be cancelled');

  order.status = 'cancelled';
  order.cancellationReason = req.body.reason || 'Cancelled by user';
  order.cancelledBy = 'user';
  order.items.forEach((item) => {
    if (item.status !== 'delivered') item.status = 'cancelled';
  });
  await order.save();

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, totalSold: -item.quantity },
    });
  }

  emitToUser(req.user._id.toString(), 'order-cancelled', { orderId: order._id });
  res.json(new ApiResponse(200, { order }, 'Order cancelled'));
});

export const getOrderTracking = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .select('tracking status estimatedDelivery deliveredAt')
    .lean();

  if (!order) throw ApiError.orderNotFound();
  res.json(new ApiResponse(200, { tracking: order }));
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { 'items.seller': req.user._id };

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate('user', 'name email phone').lean(),
    Order.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, orders, total, page, limit);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, carrier } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.orderNotFound();

  const validTransitions = {
    placed: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['out_for_delivery'],
    out_for_delivery: ['delivered'],
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
  }

  order.updateStatus(status, trackingNumber ? {
    status,
    description: `Shipped via ${carrier}`,
    location: '',
  } : null);

  if (trackingNumber) {
    order.tracking.trackingNumber = trackingNumber;
    order.tracking.carrier = carrier;
  }
  await order.save();

  emitToUser(order.user.toString(), 'order-status', { orderId: order._id, status });
  res.json(new ApiResponse(200, { order }, 'Order status updated'));
});
