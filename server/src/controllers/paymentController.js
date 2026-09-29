import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTransactionId } from '../utils/helpers.js';
import { emitToUser } from '../config/socket.js';

// @desc    Place COD Order (Cash on Delivery)
// @route   POST /api/payments/cod
// @access  Private
export const placeCODOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw ApiError.orderNotFound();

  if (order.payment.status === 'completed') {
    throw new ApiError(400, 'Order already confirmed');
  }

  // Mark COD as confirmed
  order.payment.status = 'completed';
  order.payment.paidAt = new Date();
  order.payment.gateway = 'cod';
  order.payment.method = 'cod';
  order.status = 'confirmed';
  await order.save();

  // Create transaction record
  await Transaction.create({
    order: order._id,
    user: req.user._id,
    transactionId: generateTransactionId(),
    gateway: 'cod',
    type: 'payment',
    amount: order.pricing.total,
    status: 'completed',
    method: 'cod',
    description: 'Cash on Delivery',
    processedAt: new Date(),
  });

  // Notify user via socket
  emitToUser(req.user._id.toString(), 'payment-success', {
    orderId: order._id,
    orderNumber: order.orderNumber,
  });

  res.json(new ApiResponse(200, { order }, 'COD order confirmed successfully'));
});

// @desc    Verify COD order status
// @route   GET /api/payments/status/:orderId
// @access  Private
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id,
  }).select('payment orderNumber status pricing.total');

  if (!order) throw ApiError.orderNotFound();

  res.json(new ApiResponse(200, {
    orderNumber: order.orderNumber,
    paymentStatus: order.payment.status,
    orderStatus: order.status,
    amount: order.pricing.total,
    method: order.payment.method,
  }));
});

// @desc    Process refund for COD order
// @route   POST /api/payments/refund
// @access  Private
export const processRefund = asyncHandler(async (req, res) => {
  const { orderId, reason } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw ApiError.orderNotFound();

  if (order.status !== 'delivered' && order.status !== 'confirmed') {
    throw new ApiError(400, 'Order is not eligible for refund');
  }

  order.payment.status = 'refunded';
  order.status = 'refunded';
  await order.save();

  await Transaction.create({
    order: order._id,
    user: req.user._id,
    transactionId: generateTransactionId(),
    gateway: 'cod',
    type: 'refund',
    amount: order.pricing.total,
    status: 'completed',
    description: reason || 'COD refund processed',
    processedAt: new Date(),
  });

  res.json(new ApiResponse(200, null, 'Refund processed successfully'));
});
