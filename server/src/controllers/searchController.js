import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SearchHistory from '../models/SearchHistory.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { SORT_MAP } from '../utils/constants.js';
import { getCache, setCache } from '../config/redis.js';
import { CACHE_TTL } from '../config/constants.js';

export const search = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, rating, brand, sort, inStock } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  if (!q || q.trim().length < 1) {
    return res.json(new ApiResponse(200, { products: [], total: 0 }));
  }

  const cacheKey = `search:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const filter = { isActive: true, isApproved: true, $text: { $search: q } };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    filter['price.current'] = {};
    if (minPrice) filter['price.current'].$gte = Number(minPrice);
    if (maxPrice) filter['price.current'].$lte = Number(maxPrice);
  }
  if (rating) filter['ratings.average'] = { $gte: Number(rating) };
  if (inStock === 'true') filter.stock = { $gt: 0 };

  const sortOption = sort === 'relevance' ? { score: { $meta: 'textScore' } } : (SORT_MAP[sort] || { score: { $meta: 'textScore' } });

  const [products, total] = await Promise.all([
    Product.find(filter, { score: { $meta: 'textScore' } })
      .sort(sortOption).skip(skip).limit(limit)
      .populate('category', 'name slug')
      .select('title slug images price ratings totalSold brandName')
      .lean(),
    Product.countDocuments(filter),
  ]);

  if (req.user) {
    SearchHistory.create({
      user: req.user._id,
      query: q,
      category,
      resultCount: total,
    }).catch(() => {});
  }

  const response = new ApiResponse(200, {
    products,
    query: q,
    total,
    pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total },
  });

  await setCache(cacheKey, response, CACHE_TTL.SEARCH);
  res.json(response);
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json(new ApiResponse(200, { suggestions: [] }));

  const cacheKey = `suggestions:${q}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const products = await Product.find({
    isActive: true,
    title: { $regex: q, $options: 'i' },
  })
    .select('title slug category')
    .populate('category', 'name')
    .limit(8)
    .lean();

  const categories = await Category.find({
    isActive: true,
    name: { $regex: q, $options: 'i' },
  })
    .select('name slug')
    .limit(3)
    .lean();

  const suggestions = [
    ...categories.map((c) => ({ title: c.name, type: 'category', slug: c.slug })),
    ...products.map((p) => ({ title: p.title, type: 'product', slug: p.slug, category: p.category?.name })),
  ];

  const response = new ApiResponse(200, { suggestions });
  await setCache(cacheKey, response, 300);
  res.json(response);
});

export const getAutocomplete = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 1) return res.json(new ApiResponse(200, { results: [] }));

  const results = await Product.find({
    isActive: true,
    $or: [
      { title: { $regex: `^${q}`, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { brandName: { $regex: q, $options: 'i' } },
    ],
  })
    .select('title')
    .limit(10)
    .lean();

  const uniqueTitles = [...new Set(results.map((r) => r.title))];
  res.json(new ApiResponse(200, { results: uniqueTitles }));
});

export const getSearchHistory = asyncHandler(async (req, res) => {
  const history = await SearchHistory.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('query createdAt')
    .lean();

  const unique = [...new Map(history.map((h) => [h.query, h])).values()];
  res.json(new ApiResponse(200, { history: unique }));
});

export const clearSearchHistory = asyncHandler(async (req, res) => {
  await SearchHistory.deleteMany({ user: req.user._id });
  res.json(new ApiResponse(200, null, 'Search history cleared'));
});
