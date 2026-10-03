import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  sendOTP,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { authenticate, optionalAuth, verifyRefreshToken } from '../middleware/auth.js';
import {
  authLimiter,
  registerLimiter,
  passwordResetLimiter,
  otpLimiter,
} from '../middleware/rateLimiter.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../middleware/validator.js';

const router = Router();

// Register & Login
router.post('/register', registerLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);

// Logout (Uses optionalAuth so it always clears cookies even if token is expired)
router.post('/logout', optionalAuth, logout);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Current User
router.get('/me', authenticate, getMe);

// OTP Verification
router.post('/send-otp', authenticate, otpLimiter, sendOTP);
router.post('/verify-otp', authenticate, otpLimiter, verifyEmailOTP);

// Password Management
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, resetPasswordValidator, resetPassword);
router.put('/change-password', authenticate, changePassword);

export default router;
