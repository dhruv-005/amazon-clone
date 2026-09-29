import Return from '../models/Return.js';
import Order from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const requestReturn = asyncHandler(async (req, res) => {
  const { orderId, orderItemId, reason, reasonDescription, images, refundType, pickupAddress } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) throw ApiError.orderNotFound();
  if (!order.isReturnable) throw new ApiError(400, 'Order is past the 10-day return window');

  const item = order.items.id(orderItemId);
  if (!item) throw new ApiError(404, 'Item not found in order');

  const existing = await Return.findOne({ order: orderId, orderItem: orderItemId });
  if (existing) throw ApiError.conflict('Return already requested for this item');

  const returnRequest = await Return.create({
    order: orderId,
    orderItem: orderItemId,
    user: req.user._id,
    product: item.product,
    reason,
    reasonDescription,
    images,
    refundType,
    refundAmount: item.price * item.quantity,
    pickupAddress,
    status: 'requested',
  });

  item.status = 'returned';
  await order.save();

  res.status(201).json(new ApiResponse(201, { returnRequest }, 'Return request submitted'));
});

export const getUserReturns = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [returns, total] = await Promise.all([
    Return.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product', 'title images price')
      .lean(),
    Return.countDocuments({ user: req.user._id }),
  ]);

  sendPaginatedResponse(res, returns, total, page, limit, 'Returns fetched');
});

export const updateReturnStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes, pickupDate, trackingNumber } = req.body;

  const returnRequest = await Return.findById(req.params.id);
  if (!returnRequest) throw new ApiError(404, 'Return request not found');

  returnRequest.status = status;
  if (adminNotes) returnRequest.adminNotes = adminNotes;
  if (pickupDate) returnRequest.pickupDate = pickupDate;
  if (trackingNumber) returnRequest.trackingNumber = trackingNumber;
  returnRequest.processedBy = req.user._id;
  returnRequest.processedAt = new Date();

  await returnRequest.save();
  res.json(new ApiResponse(200, { returnRequest }, 'Return status updated'));
});
