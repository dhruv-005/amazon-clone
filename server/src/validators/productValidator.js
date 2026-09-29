import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validator.js';

export const validateCreateProduct = [
  body('title')
    .trim()
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid Category ObjectId'),

  body('price.original')
    .notEmpty().withMessage('Original price is required')
    .isFloat({ min: 0 }).withMessage('Original price must be a positive number'),

  body('price.current')
    .notEmpty().withMessage('Current price is required')
    .isFloat({ min: 0 }).withMessage('Current price must be a positive number')
    .custom((value, { req }) => {
      if (req.body.price?.original && value > req.body.price.original) {
        throw new Error('Current price cannot exceed original price');
      }
      return true;
    }),

  body('stock')
    .notEmpty().withMessage('Stock quantity is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('brand')
    .optional()
    .isMongoId().withMessage('Invalid Brand ObjectId'),

  body('bulletPoints')
    .optional()
    .isArray().withMessage('Bullet points must be an array of strings'),

  body('specifications')
    .optional()
    .isArray().withMessage('Specifications must be an array of key-value pairs'),

  body('specifications.*.key')
    .optional()
    .trim()
    .notEmpty().withMessage('Specification key cannot be empty'),

  body('specifications.*.value')
    .optional()
    .trim()
    .notEmpty().withMessage('Specification value cannot be empty'),

  validate,
];

export const validateUpdateProduct = [
  param('id')
    .isMongoId().withMessage('Invalid Product ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

  body('price.current')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  validate,
];

export const validateProductIdParam = [
  param('id')
    .isMongoId().withMessage('Invalid Product ID format'),

  validate,
];

export const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be greater than or equal to 0'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be greater than or equal to 0'),

  query('rating')
    .optional()
    .isFloat({ min: 1, max: 5 }).withMessage('Rating filter must be between 1 and 5'),

  query('sort')
    .optional()
    .isIn(['price-low', 'price-high', 'rating', 'newest', 'popular', 'featured', 'relevance'])
    .withMessage('Invalid sort parameter'),

  validate,
];

export default {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductIdParam,
  validateProductQuery,
};
