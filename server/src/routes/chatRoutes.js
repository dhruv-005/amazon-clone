import { Router } from 'express';
import {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', getOrCreateChat);
router.get('/', getUserChats);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

export default router;
