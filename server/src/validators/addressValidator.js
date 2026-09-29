import { body, param } from 'express-validator';
import { validate } from '../middleware/validator.js';

export const validateCreateAddress = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),

  body('alternatePhone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit alternate phone number'),

  body('addressLine1')
    .trim()
    .notEmpty().withMessage('Flat, House no., Building, Company, Apartment is required'),

  body('addressLine2')
    .optional()
    .trim(),

  body('landmark')
    .optional()
    .trim(),

  body('city')
    .trim()
    .notEmpty().withMessage('Town/City is required'),

  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),

  body('pincode')
    .trim()
    .notEmpty().withMessage('6-digit PIN code is required')
    .matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit Indian PIN code'),

  body('addressType')
    .optional()
    .isIn(['home', 'work', 'other']).withMessage('Address type must be home, work, or other'),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean'),

  body('deliveryInstructions')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Instructions cannot exceed 500 characters'),

  validate,
];

export const validateUpdateAddress = [
  param('id')
    .isMongoId().withMessage('Invalid Address ID format'),

  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),

  body('pincode')
    .optional()
    .trim()
    .matches(/^[1-9][0-9]{5}$/).withMessage('Please provide a valid 6-digit Indian PIN code'),

  body('addressType')
    .optional()
    .isIn(['home', 'work', 'other']).withMessage('Address type must be home, work, or other'),

  validate,
];

export const validateAddressIdParam = [
  param('id')
    .isMongoId().withMessage('Invalid Address ID format'),

  validate,
];

export default {
  validateCreateAddress,
  validateUpdateAddress,
  validateAddressIdParam,
};
