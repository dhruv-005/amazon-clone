import Deal from '../models/Deal.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const getDeals = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const now = new Date();

  const filter = {
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  };

  if (req.query.type) filter.type = req.query.type;

  const [deals, total] = await Promise.all([
    Deal.find(filter)
      .sort({ 'products.dealPrice': 1 })
      .skip(skip)
      .limit(limit)
      .populate('products.product', 'title slug images price ratings')
      .lean(),
    Deal.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, deals, total, page, limit, 'Deals fetched');
});

export const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate('products.product')
    .lean();

  if (!deal) throw new ApiError(404, 'Deal not found');
  res.json(new ApiResponse(200, { deal }));
});

export const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { deal }, 'Deal created'));
});

export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!deal) throw new ApiError(404, 'Deal not found');
  res.json(new ApiResponse(200, { deal }, 'Deal updated'));
});

export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndDelete(req.params.id);
  if (!deal) throw new ApiError(404, 'Deal not found');
  res.json(new ApiResponse(200, null, 'Deal deleted'));
});
