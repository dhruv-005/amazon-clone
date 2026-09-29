import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  saveForLater,
  moveToCart,
  applyCoupon,
  removeCoupon,
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);

// Save for Later Actions
router.post('/save-for-later/:itemId', saveForLater);
router.post('/move-to-cart/:itemId', moveToCart);

// Coupon Actions
router.post('/apply-coupon', applyCoupon);
router.delete('/remove-coupon', removeCoupon);

export default router;
