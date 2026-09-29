import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),

  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object'),

  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn']).withMessage('Unsupported language code'),

  body('preferences.currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Unsupported currency code'),

  validate,
];

export const validateUpdatePreferences = [
  body('notifications')
    .optional()
    .isObject().withMessage('Notification preferences must be an object'),

  body('newsletter')
    .optional()
    .isBoolean().withMessage('Newsletter subscription must be true or false'),

  validate,
];

export default {
  validateUpdateProfile,
  validateUpdatePreferences,
};
