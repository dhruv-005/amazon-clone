import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { rating, sort, verified } = req.query;
  const filter = { product: req.params.productId, isApproved: true };

  if (rating) filter.rating = Number(rating);
  if (verified === 'true') filter.isVerifiedPurchase = true;

  const sortOption = sort === 'helpful' ? { helpfulVotes: -1 }
    : sort === 'highest' ? { rating: -1 }
    : sort === 'lowest' ? { rating: 1 }
    : { createdAt: -1 };

  const [reviews, total] = await Promise.all([
    Review.find(filter).sort(sortOption).skip(skip).limit(limit)
      .populate('user', 'name avatar')
      .lean(),
    Review.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, reviews, total, page, limit);
});

export const createReview = asyncHandler(async (req, res) => {
  const { product: productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.productNotFound();

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) throw ApiError.alreadyReviewed();

  const hasPurchased = await Order.exists({
    user: req.user._id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
    images: req.uploadedFiles || [],
    isVerifiedPurchase: !!hasPurchased,
  });

  product.updateRating(rating);
  await product.save();

  const populated = await Review.findById(review._id).populate('user', 'name avatar').lean();
  res.status(201).json(new ApiResponse(201, { review: populated }, 'Review submitted'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw new ApiError(404, 'Review not found');

  const oldRating = review.rating;
  const { rating, title, comment } = req.body;

  if (rating) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment) review.comment = comment;
  review.isEdited = true;
  await review.save();

  if (rating && rating !== oldRating) {
    const product = await Product.findById(review.product);
    product.updateRating(rating, oldRating);
    await product.save();
  }

  res.json(new ApiResponse(200, { review }, 'Review updated'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw new ApiError(404, 'Review not found');

  const product = await Product.findById(review.product);
  product.updateRating(0, review.rating);
  product.ratings.count = Math.max(0, product.ratings.count - 1);
  await product.save();

  await Review.deleteOne({ _id: review._id });
  res.json(new ApiResponse(200, null, 'Review deleted'));
});

export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  const alreadyVoted = review.helpfulUsers.includes(req.user._id);
  if (alreadyVoted) {
    review.helpfulUsers = review.helpfulUsers.filter((id) => id.toString() !== req.user._id.toString());
    review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
  } else {
    review.helpfulUsers.push(req.user._id);
    review.helpfulVotes += 1;
  }
  review.totalVotes += 1;
  await review.save();

  res.json(new ApiResponse(200, { helpfulVotes: review.helpfulVotes, totalVotes: review.totalVotes }));
});

export const reportReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.reportedBy.includes(req.user._id)) {
    throw new ApiError(400, 'You have already reported this review');
  }

  review.reportedBy.push(req.user._id);
  review.reportCount += 1;
  await review.save();

  res.json(new ApiResponse(200, null, 'Review reported'));
});
