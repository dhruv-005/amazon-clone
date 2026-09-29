import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateAvatar,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getBrowsingHistory,
  clearBrowsingHistory,
  getNotifications,
  markNotificationRead,
  updatePreferences,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { processAvatarUpload } from '../middleware/upload.js';
import { createAddressValidator } from '../middleware/validator.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/avatar', processAvatarUpload, updateAvatar);
router.put('/preferences', updatePreferences);

// Addresses Sub-resource
router.get('/addresses', getAddresses);
router.post('/addresses', createAddressValidator, addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Browsing History
router.get('/browsing-history', getBrowsingHistory);
router.delete('/browsing-history', clearBrowsingHistory);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

export default router;
