import { Router } from 'express';
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
} from '../controllers/dealController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

// Public Read
router.get('/', getDeals);
router.get('/:id', getDealById);

// Admin Management
router.post('/', authenticate, isAdmin, createDeal);
router.put('/:id', authenticate, isAdmin, updateDeal);
router.delete('/:id', authenticate, isAdmin, deleteDeal);

export default router;
