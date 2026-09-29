import { Router } from 'express';
import {
  placeCODOrder,
  getPaymentStatus,
  processRefund,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// COD Payment
router.post('/cod', placeCODOrder);

// Payment Status
router.get('/status/:orderId', getPaymentStatus);

// Refund
router.post('/refund', processRefund);

export default router;
