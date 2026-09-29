import { Router } from 'express';
import {
  search,
  getSuggestions,
  getAutocomplete,
  getSearchHistory,
  clearSearchHistory,
} from '../controllers/searchController.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { searchLimiter } from '../middleware/rateLimiter.js';
import { searchValidator } from '../middleware/validator.js';

const router = Router();

router.get('/', searchLimiter, searchValidator, optionalAuth, search);
router.get('/suggestions', getSuggestions);
router.get('/autocomplete', getAutocomplete);

// User Search History
router.get('/history', authenticate, getSearchHistory);
router.delete('/history', authenticate, clearSearchHistory);

export default router;
