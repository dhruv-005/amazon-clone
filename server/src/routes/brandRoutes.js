import { Router } from 'express';
import {
  getBrands,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

// Public Read
router.get('/', getBrands);
router.get('/slug/:slug', getBrandBySlug);

// Admin Management
router.post('/', authenticate, isAdmin, createBrand);
router.put('/:id', authenticate, isAdmin, updateBrand);
router.delete('/:id', authenticate, isAdmin, deleteBrand);

export default router;
