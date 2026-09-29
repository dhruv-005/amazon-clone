import Question from '../models/Question.js';
import Product from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse, sendPaginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parsePagination } from '../utils/pagination.js';

export const getProductQuestions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const filter = { product: req.params.productId, isApproved: true };

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .sort({ helpfulVotes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name')
      .populate('answers.user', 'name role')
      .lean(),
    Question.countDocuments(filter),
  ]);

  sendPaginatedResponse(res, questions, total, page, limit, 'Questions fetched');
});

export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) throw ApiError.productNotFound();

  const newQuestion = await Question.create({
    product: req.params.productId,
    user: req.user._id,
    question,
  });

  res.status(201).json(new ApiResponse(201, { question: newQuestion }, 'Question submitted'));
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const question = await Question.findById(req.params.id).populate('product');

  if (!question) throw new ApiError(404, 'Question not found');

  const isSellerAnswer = question.product.seller.toString() === req.user._id.toString();

  question.answers.push({
    user: req.user._id,
    text,
    isSellerAnswer,
  });

  question.isAnswered = true;
  await question.save();

  res.status(201).json(new ApiResponse(201, { question }, 'Answer added'));
});

export const voteHelpfulQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulVotes: 1 } },
    { new: true }
  );

  if (!question) throw new ApiError(404, 'Question not found');
  res.json(new ApiResponse(200, { helpfulVotes: question.helpfulVotes }));
});
