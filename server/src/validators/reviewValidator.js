import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validator.js';

export const validateCreateReview = [
  body('product')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid Product ID format'),

  body('rating')
    .notEmpty().withMessage('Rating score is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5 stars'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Review headline cannot exceed 100 characters'),

  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Review text must be between 10 and 5,000 characters'),

  validate,
];

export const validateUpdateReview = [
  param('id')
    .isMongoId().withMessage('Invalid Review ID format'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5 stars'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Review headline cannot exceed 100 characters'),

  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Review text must be between 10 and 5,000 characters'),

  validate,
];

export const validateReviewIdParam = [
  param('id')
    .isMongoId().withMessage('Invalid Review ID format'),

  validate,
];

export const validateReviewQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Filter rating must be between 1 and 5'),

  query('sort')
    .optional()
    .isIn(['helpful', 'highest', 'lowest', 'newest']).withMessage('Invalid review sort option'),

  validate,
];

export default {
  validateCreateReview,
  validateUpdateReview,
  validateReviewIdParam,
  validateReviewQuery,
};
