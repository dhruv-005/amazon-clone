import { Router } from 'express';
import {
  registerSeller,
  getSellerDashboard,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  getSellerAnalytics,
  getSellerReviews,
  respondToReview,
} from '../controllers/sellerController.js';
import { authenticate } from '../middleware/auth.js';
import { isSeller } from '../middleware/seller.js';

const router = Router();

// Registration
router.post('/register', authenticate, registerSeller);

// Seller Protected Sub-routes
router.use(authenticate, isSeller);

router.get('/dashboard', getSellerDashboard);
router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.get('/analytics', getSellerAnalytics);
router.get('/reviews', getSellerReviews);
router.post('/reviews/:id/respond', respondToReview);

export default router;
