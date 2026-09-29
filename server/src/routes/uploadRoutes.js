import { Router } from 'express';
import {
  uploadSingle,
  uploadMultiple,
  deleteUploadedFile,
} from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { processSingleUpload, processMultipleUploads } from '../middleware/upload.js';

const router = Router();

router.use(authenticate, uploadLimiter);

router.post('/single', processSingleUpload('file', 'amazon-clone/general'), uploadSingle);
router.post('/multiple', processMultipleUploads('files', 'amazon-clone/general'), uploadMultiple);
router.delete('/delete', deleteUploadedFile);

export default router;
