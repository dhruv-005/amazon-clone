import Coupon from '../models/Coupon.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const getCoupons = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};

  if (req.query.active === 'true') {
    const now = new Date();
    filter.isActive = true;
    filter.startDate = { $lte: now };
    filter.endDate = { $gte: now };
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Coupon.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, coupons, total, page, limit, 'Coupons fetched');
});

export const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() }).lean();
  if (!coupon) throw new ApiError(404, 'Coupon code not found');
  res.json(new ApiResponse(200, { coupon }));
});

export const createCoupon = asyncHandler(async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existing) throw ApiError.conflict('Coupon code already exists');

  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase(),
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { coupon }, 'Coupon created'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { ...req.body, code: req.body.code ? req.body.code.toUpperCase() : undefined },
    { new: true, runValidators: true }
  );

  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, { coupon }, 'Coupon updated'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, null, 'Coupon deleted'));
});

export const validateCouponCode = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) throw new ApiError(404, 'Invalid coupon code');
  if (!coupon.isValid) throw new ApiError(400, 'Coupon is inactive or expired');

  if (subtotal < coupon.minPurchase) {
    throw new ApiError(400, `Minimum purchase amount of ₹${coupon.minPurchase} required`);
  }

  const discount = coupon.applyCoupon(Number(subtotal));

  res.json(new ApiResponse(200, {
    code: coupon.code,
    discount,
    type: coupon.type,
    finalAmount: Math.max(0, subtotal - discount),
  }, 'Coupon is valid'));
});
