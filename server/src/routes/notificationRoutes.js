import { Router } from 'express';
import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getUserNotifications);
router.put('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

export default router;
