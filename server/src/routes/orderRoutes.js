import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getOrderTracking,
  getSellerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { isSeller } from '../middleware/seller.js';
import { orderLimiter } from '../middleware/rateLimiter.js';
import { createOrderValidator } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

// Customer Operations
router.post('/', orderLimiter, createOrderValidator, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/tracking', getOrderTracking);

// Seller/Merchant Operations
router.get('/seller/orders', isSeller, getSellerOrders);
router.put('/seller/orders/:id/status', isSeller, updateOrderStatus);

export default router;
