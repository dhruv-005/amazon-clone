import Product from '../models/Product.js';
import Order from '../models/Order.js';
import BrowsingHistory from '../models/BrowsingHistory.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  let recommendedProducts = [];

  if (req.user) {
    const history = await BrowsingHistory.find({ user: req.user._id })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate('product', 'category brand tags')
      .lean();

    const categories = history.map((h) => h.product?.category).filter(Boolean);
    const brands = history.map((h) => h.product?.brand).filter(Boolean);

    if (categories.length > 0 || brands.length > 0) {
      recommendedProducts = await Product.find({
        isActive: true,
        isApproved: true,
        $or: [
          { category: { $in: categories } },
          { brand: { $in: brands } },
        ],
      })
        .sort({ 'ratings.average': -1, totalSold: -1 })
        .limit(12)
        .select('title slug images price ratings totalSold')
        .lean();
    }
  }

  if (recommendedProducts.length === 0) {
    recommendedProducts = await Product.find({ isActive: true, isApproved: true })
      .sort({ totalSold: -1, 'ratings.average': -1 })
      .limit(12)
      .select('title slug images price ratings totalSold')
      .lean();
  }

  res.json(new ApiResponse(200, { products: recommendedProducts }));
});

export const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isApproved: true })
    .sort({ views: -1, totalSold: -1 })
    .limit(16)
    .select('title slug images price ratings totalSold isFeatured')
    .lean();

  res.json(new ApiResponse(200, { products }));
});
