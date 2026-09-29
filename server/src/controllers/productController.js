import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';
import { SORT_MAP } from '../utils/constants.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';
import { getCache, setCache, deleteCacheByPattern } from '../config/redis.js';
import { CACHE_TTL } from '../config/constants.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { category, minPrice, maxPrice, rating, brand, sort, search, inStock, deal } = req.query;

  const cacheKey = `products:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const filter = { isActive: true, isApproved: true };

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    filter['price.current'] = {};
    if (minPrice) filter['price.current'].$gte = Number(minPrice);
    if (maxPrice) filter['price.current'].$lte = Number(maxPrice);
  }
  if (rating) filter['ratings.average'] = { $gte: Number(rating) };
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (deal === 'true') filter['dealInfo.isDeal'] = true;
  if (search) filter.$text = { $search: search };

  const sortOption = SORT_MAP[sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('brand', 'name')
      .select('-richDescription -specifications -variants')
      .lean(),
    Product.countDocuments(filter),
  ]);

  const response = new ApiResponse(200, {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });

  await setCache(cacheKey, response, CACHE_TTL.PRODUCT);
  res.json(response);
});

export const getProductById = asyncHandler(async (req, res) => {
  const cacheKey = `product:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate('brand', 'name slug logo')
    .populate('seller', 'name businessName ratings')
    .lean();

  if (!product || !product.isActive) throw ApiError.productNotFound();

  await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  if (req.user) {
    const BrowsingHistory = (await import('../models/BrowsingHistory.js')).default;
    await BrowsingHistory.create({
      user: req.user._id,
      product: product._id,
      source: req.query.source || 'direct',
    });
  }

  const response = new ApiResponse(200, { product });
  await setCache(cacheKey, response, CACHE_TTL.PRODUCT);
  res.json(response);
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('brand', 'name slug')
    .lean();

  if (!product) throw ApiError.productNotFound();
  res.json(new ApiResponse(200, { product }));
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true, isApproved: true })
    .sort({ totalSold: -1 })
    .limit(20)
    .select('title slug images price ratings totalSold')
    .lean();

  res.json(new ApiResponse(200, { products }));
});

export const getDealProducts = asyncHandler(async (req, res) => {
  const now = new Date();
  const products = await Product.find({
    'dealInfo.isDeal': true,
    'dealInfo.dealStart': { $lte: now },
    'dealInfo.dealEnd': { $gte: now },
    isActive: true,
  })
    .sort({ 'dealInfo.dealEnd': 1 })
    .limit(50)
    .select('title slug images price dealInfo ratings')
    .lean();

  res.json(new ApiResponse(200, { products }));
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select('category brand tags');
  if (!product) throw ApiError.productNotFound();

  const related = await Product.find({
    _id: { $ne: req.params.id },
    isActive: true,
    $or: [
      { category: product.category },
      { brand: product.brand },
      { tags: { $in: product.tags } },
    ],
  })
    .sort({ totalSold: -1 })
    .limit(12)
    .select('title slug images price ratings')
    .lean();

  res.json(new ApiResponse(200, { products: related }));
});

export const getFrequentlyBoughtTogether = asyncHandler(async (req, res) => {
  const Order = (await import('../models/Order.js')).default;

  const orders = await Order.aggregate([
    { $match: { 'items.product': require('mongoose').Types.ObjectId.createFromHexString(req.params.id), status: 'delivered' } },
    { $unwind: '$items' },
    { $match: { 'items.product': { $ne: require('mongoose').Types.ObjectId.createFromHexString(req.params.id) } } },
    { $group: { _id: '$items.product', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    { $project: { 'product.title': 1, 'product.slug': 1, 'product.images': 1, 'product.price': 1, count: 1 } },
  ]);

  res.json(new ApiResponse(200, { products: orders.map((o) => o.product) }));
});

export const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    seller: req.user._id,
    slug: generateUniqueSlug(req.body.title),
    images: req.uploadedFiles || [],
  };

  const product = await Product.create(productData);
  await deleteCacheByPattern('products:*');

  res.status(201).json(new ApiResponse(201, { product }, 'Product created'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.productNotFound();

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden();
  }

  Object.assign(product, req.body);
  if (req.uploadedFiles?.length > 0) {
    product.images = [...product.images, ...req.uploadedFiles];
  }

  await product.save();
  await deleteCacheByPattern(`product:${product._id}*`);
  await deleteCacheByPattern('products:*');

  res.json(new ApiResponse(200, { product }, 'Product updated'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.productNotFound();

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden();
  }

  product.isActive = false;
  await product.save();
  await deleteCacheByPattern(`product:${product._id}*`);
  await deleteCacheByPattern('products:*');

  res.json(new ApiResponse(200, null, 'Product deleted'));
});
