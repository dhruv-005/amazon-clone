import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';
import { processReviewImages } from '../middleware/upload.js';
import { createReviewValidator } from '../middleware/validator.js';

const router = Router();

// Public Read
router.get('/product/:productId', getProductReviews);

// Authenticated Actions
router.post(
  '/',
  authenticate,
  reviewLimiter,
  processReviewImages,
  createReviewValidator,
  createReview
);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/helpful', authenticate, markHelpful);
router.post('/:id/report', authenticate, reportReview);

export default router;
