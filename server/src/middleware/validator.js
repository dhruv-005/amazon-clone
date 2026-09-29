// ============================================
// REQUEST VALIDATION MIDDLEWARE
// ============================================

import { body, param, query, validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

/**
 * Run validation and return errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    throw new ApiError(
      400,
      'Validation failed',
      formattedErrors
    );
  }

  next();
};

// ---- AUTH VALIDATORS ----

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('phone')
    .optional()
    .isMobilePhone('en-IN').withMessage('Please enter a valid Indian phone number'),
  validate,
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  validate,
];

export const resetPasswordValidator = [
  param('token')
    .notEmpty().withMessage('Reset token is required'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validate,
];

// ---- PRODUCT VALIDATORS ----

export const createProductValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('price.original')
    .isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('price.current')
    .isFloat({ min: 0 }).withMessage('Current price must be a positive number'),
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('brand')
    .optional()
    .isMongoId().withMessage('Invalid brand ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('bulletPoints')
    .optional()
    .isArray().withMessage('Bullet points must be an array'),
  body('specifications')
    .optional()
    .isArray().withMessage('Specifications must be an array'),
  validate,
];

export const productIdValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  validate,
];

// ---- ORDER VALIDATORS ----

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must have at least 1 item'),
  body('items.*.product')
    .isMongoId().withMessage('Invalid product ID in order items'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phoneNumber')
    .notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.addressLine1')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('payment.method')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet', 'emi'])
    .withMessage('Invalid payment method'),
  validate,
];

// ---- REVIEW VALIDATORS ----

export const createReviewValidator = [
  body('product')
    .isMongoId().withMessage('Invalid product ID'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Review must be 10-5000 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),
  validate,
];

// ---- ADDRESS VALIDATORS ----

export const createAddressValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required'),
  body('addressLine1')
    .trim()
    .notEmpty().withMessage('Address line 1 is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('addressType')
    .optional()
    .isIn(['home', 'work', 'other']).withMessage('Invalid address type'),
  validate,
];

// ---- SEARCH VALIDATORS ----

export const searchValidator = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Search query must be 1-200 characters'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be positive'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be positive'),
  query('rating')
    .optional()
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  query('sort')
    .optional()
    .isIn(['price-low', 'price-high', 'rating', 'newest', 'popular', 'featured'])
    .withMessage('Invalid sort option'),
  validate,
];

// ---- PAGINATION VALIDATOR ----

export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
    .toInt(),
  validate,
];

export default validate;
