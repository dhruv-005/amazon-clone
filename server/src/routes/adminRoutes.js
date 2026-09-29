import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  toggleBanUser,
  getAllProducts,
  toggleProductApproval,
  getSellers,
  verifySeller,
  getSystemSettings,
  updateSystemSettings,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin, logAdminAction } from '../middleware/admin.js';

const router = Router();

// Guard all admin routes
router.use(authenticate, isAdmin, logAdminAction);

router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/ban', toggleBanUser);

// Product Management
router.get('/products', getAllProducts);
router.put('/products/:id/approve', toggleProductApproval);

// Seller Verification
router.get('/sellers', getSellers);
router.put('/sellers/:id/verify', verifySeller);

// System Configuration
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

export default router;
