// ============================================
// REQUEST VALIDATION MIDDLEWARE (Flexible & Safe)
// ============================================

import { body, param, query, validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

/**
 * Run validation and return errors with detailed field logs
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    throw new ApiError(
      400,
      `Validation failed: ${formattedErrors.map((e) => `${e.field} (${e.message})`).join(', ')}`,
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
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
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
    .optional({ checkFalsy: true })
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
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
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('category')
    .notEmpty().withMessage('Category is required'),
  body('price.current')
    .notEmpty().withMessage('Current price is required'),
  body('stock')
    .optional({ checkFalsy: true }),
  validate,
];

export const productIdValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required'),
  validate,
];

// ---- ORDER VALIDATORS ----

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must have at least 1 item'),
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
    .notEmpty().withMessage('Pincode is required'),
  validate,
];

// ---- REVIEW VALIDATORS ----

export const createReviewValidator = [
  body('product')
    .notEmpty().withMessage('Product ID is required'),
  body('rating')
    .notEmpty().withMessage('Rating is required'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required'),
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
    .notEmpty().withMessage('Pincode is required'),
  validate,
];

// ---- SEARCH & FILTER VALIDATORS (Tolerant of empty strings) ----

export const searchValidator = [
  query('q')
    .optional({ checkFalsy: true })
    .trim(),
  query('category')
    .optional({ checkFalsy: true })
    .trim(),
  query('page')
    .optional({ checkFalsy: true }),
  query('limit')
    .optional({ checkFalsy: true }),
  query('minPrice')
    .optional({ checkFalsy: true }),
  query('maxPrice')
    .optional({ checkFalsy: true }),
  query('rating')
    .optional({ checkFalsy: true }),
  query('brand')
    .optional({ checkFalsy: true }),
  query('sort')
    .optional({ checkFalsy: true }),
  query('inStock')
    .optional({ checkFalsy: true }),
  validate,
];

export const paginationValidator = [
  query('page')
    .optional({ checkFalsy: true }),
  query('limit')
    .optional({ checkFalsy: true }),
  validate,
];

export default validate;
