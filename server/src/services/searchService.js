import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { SORT_MAP } from '../utils/constants.js';

export const executeProductSearch = async (params = {}) => {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort = 'relevance',
    inStock,
    page = 1,
    limit = 20,
  } = params;

  const skip = (Number(page) - 1) * Number(limit);
  const filter = { isActive: true, isApproved: true };

  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (minPrice || maxPrice) {
    filter['price.current'] = {};
    if (minPrice) filter['price.current'].$gte = Number(minPrice);
    if (maxPrice) filter['price.current'].$lte = Number(maxPrice);
  }

  if (rating) {
    filter['ratings.average'] = { $gte: Number(rating) };
  }

  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  let sortCriteria = SORT_MAP[sort] || { createdAt: -1 };
  let projection = {};

  if (q && sort === 'relevance') {
    projection = { score: { $meta: 'textScore' } };
    sortCriteria = { score: { $meta: 'textScore' } };
  }

  const [products, total] = await Promise.all([
    Product.find(filter, projection)
      .sort(sortCriteria)
      .skip(skip)
      .limit(Number(limit))
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getSearchAutocomplete = async (prefix = '') => {
  if (!prefix || prefix.length < 1) return [];

  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const products = await Product.find({
    isActive: true,
    title: { $regex: `^${escaped}`, $options: 'i' },
  })
    .select('title slug category')
    .limit(8)
    .populate('category', 'name')
    .lean();

  return products.map((p) => ({
    title: p.title,
    slug: p.slug,
    categoryName: p.category?.name,
  }));
};

export default {
  executeProductSearch,
  getSearchAutocomplete,
};
