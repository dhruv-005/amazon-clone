// ============================================
// FILE UPLOAD PROCESSING MIDDLEWARE
// ============================================

import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadMixed,
  uploadDocument,
  handleMulterError,
} from '../config/multer.js';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';

/**
 * Process single image upload to Cloudinary
 * Usage: router.post('/avatar', processSingleUpload('avatar', 'avatars'), controller)
 */
export const processSingleUpload = (fieldName, folder = 'amazon-clone') => {
  return [
    uploadSingleImage(fieldName),
    handleMulterError,
    asyncHandler(async (req, res, next) => {
      if (!req.file) {
        return next();
      }

      try {
        // Convert buffer to base64 for Cloudinary
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await uploadToCloudinary(base64, folder, {
          width: 800,
          height: 800,
          crop: 'limit',
        });

        req.uploadedFile = result;
        next();
      } catch (error) {
        logger.error(`Upload processing error: ${error.message}`);
        throw new ApiError(500, 'File upload failed. Please try again.');
      }
    }),
  ];
};

/**
 * Process multiple image uploads to Cloudinary
 * Usage: router.post('/product-images', processMultipleUploads('images', 'products'), controller)
 */
export const processMultipleUploads = (fieldName, folder = 'amazon-clone') => {
  return [
    uploadMultipleImages(fieldName, 10),
    handleMulterError,
    asyncHandler(async (req, res, next) => {
      if (!req.files || req.files.length === 0) {
        return next();
      }

      try {
        const base64Files = req.files.map((file) =>
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        );

        const results = await uploadMultipleToCloudinary(base64Files, folder);

        req.uploadedFiles = results;
        next();
      } catch (error) {
        logger.error(`Multi-upload processing error: ${error.message}`);
        throw new ApiError(500, 'File upload failed. Please try again.');
      }
    }),
  ];
};

/**
 * Process product images (primary + gallery)
 * Usage: router.post('/products', processProductImages, controller)
 */
export const processProductImages = [
  uploadMultipleImages('images', 9),
  handleMulterError,
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, 'At least one product image is required.');
    }

    try {
      const base64Files = req.files.map((file) =>
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );

      const results = await uploadMultipleToCloudinary(base64Files, 'products');

      // Mark first image as primary
      req.uploadedFiles = results.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        alt: req.body.title || 'Product image',
        isPrimary: index === 0,
        order: index,
      }));

      next();
    } catch (error) {
      logger.error(`Product image upload error: ${error.message}`);
      throw new ApiError(500, 'Image upload failed.');
    }
  }),
];

/**
 * Process avatar upload
 * Usage: router.put('/profile/avatar', processAvatarUpload, controller)
 */
export const processAvatarUpload = [
  uploadSingleImage('avatar'),
  handleMulterError,
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      throw new ApiError(400, 'Avatar image is required.');
    }

    try {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await uploadToCloudinary(base64, 'avatars', {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
      });

      req.uploadedFile = result;
      next();
    } catch (error) {
      logger.error(`Avatar upload error: ${error.message}`);
      throw new ApiError(500, 'Avatar upload failed.');
    }
  }),
];

/**
 * Process document upload (for seller verification)
 * Usage: router.post('/seller/documents', processDocumentUpload, controller)
 */
export const processDocumentUpload = [
  uploadDocument('document'),
  handleMulterError,
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      throw new ApiError(400, 'Document is required.');
    }

    try {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await uploadToCloudinary(base64, 'documents', {
        resource_type: 'raw',
      });

      req.uploadedFile = result;
      next();
    } catch (error) {
      logger.error(`Document upload error: ${error.message}`);
      throw new ApiError(500, 'Document upload failed.');
    }
  }),
];

/**
 * Process review images
 * Usage: router.post('/reviews', processReviewImages, controller)
 */
export const processReviewImages = [
  uploadMultipleImages('images', 5),
  handleMulterError,
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      req.uploadedFiles = [];
      return next();
    }

    try {
      const base64Files = req.files.map((file) =>
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      );

      const results = await uploadMultipleToCloudinary(base64Files, 'reviews');

      req.uploadedFiles = results.map((result) => ({
        url: result.url,
        publicId: result.publicId,
      }));

      next();
    } catch (error) {
      logger.error(`Review image upload error: ${error.message}`);
      throw new ApiError(500, 'Image upload failed.');
    }
  }),
];

export default processSingleUpload;
