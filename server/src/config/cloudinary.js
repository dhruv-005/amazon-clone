// ============================================
// CLOUDINARY CONFIGURATION - Image & Video Storage
// ============================================

import { v2 as cloudinary } from 'cloudinary';
import config from './index.js';
import logger from './logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

/**
 * Upload a single file to Cloudinary
 * @param {string} filePath - Local file path or base64 string
 * @param {string} folder - Cloudinary folder name
 * @param {object} options - Additional upload options
 * @returns {object} Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'amazon-clone', options = {}) => {
  try {
    const defaultOptions = {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);

    logger.info(`File uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {string[]} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {object[]} Array of upload results
 */
export const uploadMultipleToCloudinary = async (filePaths, folder = 'amazon-clone') => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, folder)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error(`Cloudinary multi-upload error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {object} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {string[]} publicIds - Array of public IDs
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    logger.info(`Deleted ${publicIds.length} files from Cloudinary`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary multi-delete error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate optimized URL for an image
 * @param {string} publicId - Cloudinary public ID
 * @param {object} transformations - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...transformations,
  });
};

/**
 * Generate thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} Thumbnail URL
 */
export const getThumbnailUrl = (publicId, width = 200, height = 200) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    fetch_format: 'auto',
    quality: 'auto',
  });
};

export default cloudinary;
