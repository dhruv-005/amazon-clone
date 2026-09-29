import Banner from '../models/Banner.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getActiveBanners = asyncHandler(async (req, res) => {
  const { position = 'hero' } = req.query;
  const now = new Date();

  const filter = {
    position,
    isActive: true,
    $or: [
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: { $gte: now } },
    ],
  };

  const banners = await Banner.find(filter).sort({ order: 1 }).lean();
  res.json(new ApiResponse(200, { banners }));
});

export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ position: 1, order: 1 }).lean();
  res.json(new ApiResponse(200, { banners }));
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { banner }, 'Banner created'));
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!banner) throw new ApiError(404, 'Banner not found');
  res.json(new ApiResponse(200, { banner }, 'Banner updated'));
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  res.json(new ApiResponse(200, null, 'Banner deleted'));
});

export const trackBannerClick = asyncHandler(async (req, res) => {
  await Banner.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
  res.json(new ApiResponse(200, null, 'Click recorded'));
});
