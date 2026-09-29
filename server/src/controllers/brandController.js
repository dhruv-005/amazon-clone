import Brand from '../models/Brand.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

export const getBrands = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.featured === 'true') filter.isFeatured = true;

  const brands = await Brand.find(filter).sort({ name: 1 }).lean();
  res.json(new ApiResponse(200, { brands }));
});

export const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) throw new ApiError(404, 'Brand not found');
  res.json(new ApiResponse(200, { brand }));
});

export const createBrand = asyncHandler(async (req, res) => {
  const existing = await Brand.findOne({ name: req.body.name });
  if (existing) throw ApiError.conflict('Brand already exists');

  const brand = await Brand.create({
    ...req.body,
    slug: slugify(req.body.name),
  });

  res.status(201).json(new ApiResponse(201, { brand }, 'Brand created'));
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!brand) throw new ApiError(404, 'Brand not found');
  res.json(new ApiResponse(200, { brand }, 'Brand updated'));
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, { isActive: false });
  if (!brand) throw new ApiError(404, 'Brand not found');
  res.json(new ApiResponse(200, null, 'Brand deactivated'));
});
