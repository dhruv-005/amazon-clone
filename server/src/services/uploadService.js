import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from '../config/cloudinary.js';
import logger from '../config/logger.js';

export const uploadImageBuffer = async (buffer, mimetype, folder = 'amazon-clone', options = {}) => {
  try {
    const base64 = `data:${mimetype};base64,${buffer.toString('base64')}`;
    return await uploadToCloudinary(base64, folder, options);
  } catch (error) {
    logger.error(`Buffer upload failed: ${error.message}`);
    throw error;
  }
};

export const uploadMultipleBuffers = async (files, folder = 'amazon-clone') => {
  try {
    const base64Array = files.map(
      (file) => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );
    return await uploadMultipleToCloudinary(base64Array, folder);
  } catch (error) {
    logger.error(`Multiple buffer upload failed: ${error.message}`);
    throw error;
  }
};

export const removeFile = async (publicId) => {
  if (!publicId) return;
  return deleteFromCloudinary(publicId);
};

export const removeMultipleFiles = async (publicIds = []) => {
  if (!publicIds.length) return;
  return deleteMultipleFromCloudinary(publicIds);
};

export default {
  uploadImageBuffer,
  uploadMultipleBuffers,
  removeFile,
  removeMultipleFiles,
};
