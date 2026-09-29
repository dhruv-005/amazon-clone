import { Router } from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  trackBannerClick,
} from '../controllers/bannerController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

// Public Read & Analytics
router.get('/', getActiveBanners);
router.post('/:id/click', trackBannerClick);

// Admin Management
router.get('/all', authenticate, isAdmin, getAllBanners);
router.post('/', authenticate, isAdmin, createBanner);
router.put('/:id', authenticate, isAdmin, updateBanner);
router.delete('/:id', authenticate, isAdmin, deleteBanner);

export default router;
