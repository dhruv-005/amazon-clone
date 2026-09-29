import { Router } from 'express';
import {
  getProductQuestions,
  askQuestion,
  answerQuestion,
  voteHelpfulQuestion,
} from '../controllers/questionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public Read
router.get('/product/:productId', getProductQuestions);

// Authenticated Actions
router.post('/product/:productId', authenticate, askQuestion);
router.post('/:id/answer', authenticate, answerQuestion);
router.post('/:id/helpful', authenticate, voteHelpfulQuestion);

export default router;
