import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import searchRoutes from './searchRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import couponRoutes from './couponRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import addressRoutes from './addressRoutes.js';
import questionRoutes from './questionRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import dealRoutes from './dealRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import brandRoutes from './brandRoutes.js';
import returnRoutes from './returnRoutes.js';
import chatRoutes from './chatRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

// Health Check API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mounting Sub-routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/payments', paymentRoutes);
router.use('/search', searchRoutes);
router.use('/seller', sellerRoutes);
router.use('/coupons', couponRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/addresses', addressRoutes);
router.use('/questions', questionRoutes);
router.use('/upload', uploadRoutes);
router.use('/deals', dealRoutes);
router.use('/banners', bannerRoutes);
router.use('/brands', brandRoutes);
router.use('/returns', returnRoutes);
router.use('/chats', chatRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
