import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getDealProducts,
  getRelatedProducts,
  getFrequentlyBoughtTogether,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { isSeller, isVerifiedSeller } from '../middleware/seller.js';
import { processProductImages } from '../middleware/upload.js';
import { createProductValidator, productIdValidator } from '../middleware/validator.js';

const router = Router();

// Public Read Endpoints
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/deals', getDealProducts);
router.get('/slug/:slug', optionalAuth, getProductBySlug);
router.get('/:id', optionalAuth, productIdValidator, getProductById);
router.get('/:id/related', productIdValidator, getRelatedProducts);
router.get('/:id/frequently-bought', productIdValidator, getFrequentlyBoughtTogether);

// Seller/Admin Write Endpoints
router.post(
  '/',
  authenticate,
  isSeller,
  isVerifiedSeller,
  processProductImages,
  createProductValidator,
  createProduct
);
router.put(
  '/:id',
  authenticate,
  isSeller,
  productIdValidator,
  processProductImages,
  updateProduct
);
router.delete('/:id', authenticate, isSeller, productIdValidator, deleteProduct);

export default router;
