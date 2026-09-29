import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.uploadedFile) {
    throw new ApiError(400, 'No file uploaded');
  }

  res.status(201).json(new ApiResponse(201, { file: req.uploadedFile }, 'File uploaded'));
});

export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.uploadedFiles || req.uploadedFiles.length === 0) {
    throw new ApiError(400, 'No files uploaded');
  }

  res.status(201).json(new ApiResponse(201, { files: req.uploadedFiles }, 'Files uploaded'));
});

export const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required');

  await deleteFromCloudinary(publicId);
  res.json(new ApiResponse(200, null, 'File deleted from storage'));
});
