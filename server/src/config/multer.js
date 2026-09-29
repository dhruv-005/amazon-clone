// ============================================
// MULTER CONFIGURATION - File Upload Handling
// ============================================

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './index.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Memory Storage (for Cloudinary upload)
 * Files are kept in memory as Buffer objects
 */
const memoryStorage = multer.memoryStorage();

/**
 * Disk Storage (for local uploads)
 */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File Filter - Validate file types
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = config.upload.allowedTypes;

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed: ${allowedTypes.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Document Filter (PDF, DOC, etc.)
 */
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

// ---- EXPORT UPLOAD MIDDLEWARES ----

/**
 * Single Image Upload (Memory)
 * Usage: uploadSingleImage('image')
 */
export const uploadSingleImage = (fieldName = 'image') =>
  multer({
    storage: memoryStorage,
    fileFilter: imageFilter,
    limits: {
      fileSize: config.upload.maxFileSize,
      files: 1,
    },
  }).single(fieldName);

/**
 * Multiple Image Upload (Memory)
 * Usage: uploadMultipleImages('images', 10)
 */
export const uploadMultipleImages = (fieldName = 'images', maxCount = 10) =>
  multer({
    storage: memoryStorage,
    fileFilter: imageFilter,
    limits: {
      fileSize: config.upload.maxFileSize,
      files: maxCount,
    },
  }).array(fieldName, maxCount);

/**
 * Mixed Upload (Images + Documents)
 * Usage: uploadMixed()
 */
export const uploadMixed = () =>
  multer({
    storage: memoryStorage,
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  }).fields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 5 },
    { name: 'avatar', maxCount: 1 },
  ]);

/**
 * Single Document Upload
 * Usage: uploadDocument('document')
 */
export const uploadDocument = (fieldName = 'document') =>
  multer({
    storage: memoryStorage,
    fileFilter: documentFilter,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB for documents
      files: 1,
    },
  }).single(fieldName);

/**
 * Local Disk Upload (for temporary files)
 */
export const uploadToLocal = (fieldName = 'file') =>
  multer({
    storage: diskStorage,
    fileFilter: imageFilter,
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  }).single(fieldName);

/**
 * Error handling middleware for Multer
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${config.upload.maxFileSize / (1024 * 1024)}MB`,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

export default multer;
