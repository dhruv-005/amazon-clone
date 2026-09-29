import { Router } from 'express';
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { authenticate } from '../middleware/auth.js';
import { createAddressValidator } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.post('/', createAddressValidator, createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/default', setDefaultAddress);

export default router;
