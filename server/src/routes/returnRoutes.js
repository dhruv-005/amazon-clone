import { Router } from 'express';
import {
  requestReturn,
  getUserReturns,
  updateReturnStatus,
} from '../controllers/returnController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

router.use(authenticate);

// User Routes
router.post('/', requestReturn);
router.get('/my-returns', getUserReturns);

// Admin Operations
router.put('/:id/status', isAdmin, updateReturnStatus);

export default router;
