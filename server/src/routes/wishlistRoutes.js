import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCartFromWishlist,
  checkWishlistStatus,
} from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.post('/move-to-cart/:productId', moveToCartFromWishlist);
router.get('/status/:productId', checkWishlistStatus);

export default router;
