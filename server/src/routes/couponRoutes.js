import { Router } from 'express';
import {
  getCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCouponCode,
} from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

router.post('/validate', authenticate, validateCouponCode);
router.get('/code/:code', getCouponByCode);

// Admin Management
router.get('/', authenticate, isAdmin, getCoupons);
router.post('/', authenticate, isAdmin, createCoupon);
router.put('/:id', authenticate, isAdmin, updateCoupon);
router.delete('/:id', authenticate, isAdmin, deleteCoupon);

export default router;
