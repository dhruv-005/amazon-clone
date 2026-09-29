import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validator.js';

export const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

  body('items.*.product')
    .notEmpty().withMessage('Product ID is required for each item')
    .isMongoId().withMessage('Invalid Product ID in items list'),

  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 10 }).withMessage('Quantity per item must be between 1 and 10'),

  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Shipping full name is required'),

  body('shippingAddress.phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),

  body('shippingAddress.addressLine1')
    .trim()
    .notEmpty().withMessage('Street address line 1 is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('shippingAddress.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit Indian PIN code'),

  body('payment.method')
    .optional()
    .isIn(['cod'])
    .withMessage('only cash on Delivery is available'),

  validate,
];

export const validateOrderIdParam = [
  param('id')
    .isMongoId().withMessage('Invalid Order ID format'),

  validate,
];

export const validateOrderStatusUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid Order ID format'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'])
    .withMessage('Invalid order status transition'),

  body('trackingNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Tracking number cannot be empty when provided'),

  body('carrier')
    .optional()
    .trim()
    .notEmpty().withMessage('Carrier name cannot be empty when provided'),

  validate,
];

export const validateCancelOrder = [
  param('id')
    .isMongoId().withMessage('Invalid Order ID format'),

  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Cancellation reason cannot exceed 500 characters'),

  validate,
];

export default {
  validateCreateOrder,
  validateOrderIdParam,
  validateOrderStatusUpdate,
  validateCancelOrder,
};
