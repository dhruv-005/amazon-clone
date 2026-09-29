import Category from '../models/Category.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getCache, setCache, deleteCacheByPattern } from '../config/redis.js';
import { CACHE_TTL } from '../config/constants.js';

export const getCategories = asyncHandler(async (req, res) => {
  const cacheKey = 'categories:all';
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const categories = await Category.find({ isActive: true })
    .sort({ level: 1, order: 1, name: 1 })
    .populate('parent', 'name slug')
    .lean();

  const response = new ApiResponse(200, { categories });
  await setCache(cacheKey, response, CACHE_TTL.CATEGORY);
  res.json(response);
});

export const getCategoryTree = asyncHandler(async (req, res) => {
  const cacheKey = 'categories:tree';
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const categories = await Category.find({ isActive: true })
    .sort({ level: 1, order: 1 })
    .lean();

  const buildTree = (parentId = null) => {
    return categories
      .filter((cat) => (parentId ? cat.parent?.toString() === parentId.toString() : !cat.parent))
      .map((cat) => ({
        ...cat,
        children: buildTree(cat._id),
      }));
  };

  const tree = buildTree();
  const response = new ApiResponse(200, { categories: tree });
  await setCache(cacheKey, response, CACHE_TTL.CATEGORY);
  res.json(response);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('parent', 'name slug')
    .lean();

  if (!category) throw ApiError.categoryNotFound();
  res.json(new ApiResponse(200, { category }));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('parent', 'name slug')
    .populate('children')
    .lean();

  if (!category) throw ApiError.categoryNotFound();
  res.json(new ApiResponse(200, { category }));
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, parent, description, image, icon, filters } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) throw ApiError.conflict('Category already exists');

  let level = 0;
  if (parent) {
    const parentCat = await Category.findById(parent);
    if (!parentCat) throw new ApiError(400, 'Parent category not found');
    level = parentCat.level + 1;
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await Category.create({
    name, slug, parent, level, description, image, icon, filters,
  });

  await deleteCacheByPattern('categories:*');
  res.status(201).json(new ApiResponse(201, { category }, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) throw ApiError.categoryNotFound();
  await deleteCacheByPattern('categories:*');
  res.json(new ApiResponse(200, { category }, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.categoryNotFound();

  const hasChildren = await Category.exists({ parent: category._id });
  if (hasChildren) throw new ApiError(400, 'Cannot delete category with subcategories');

  category.isActive = false;
  await category.save();
  await deleteCacheByPattern('categories:*');
  res.json(new ApiResponse(200, null, 'Category deleted'));
});
