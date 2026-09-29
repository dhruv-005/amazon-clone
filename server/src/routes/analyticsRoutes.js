import { Router } from 'express';
import {
  getSalesOverview,
  getTopCategories,
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

// Admin Only
router.use(authenticate, isAdmin);

router.get('/sales-overview', getSalesOverview);
router.get('/top-categories', getTopCategories);

export default router;
