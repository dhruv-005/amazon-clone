import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTokens, setAuthCookies, clearAuthCookies } from '../utils/generateToken.js';
import { verifyOTP } from '../utils/generateOTP.js';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '../config/email.js';
import { getClientIP } from '../utils/helpers.js';
import crypto from 'crypto';

// @desc    Register new user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw ApiError.conflict('Email already registered. Please login instead.');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    role: 'customer',
  });

  const otp = user.generateOTP();
  await user.save();

  await sendVerificationEmail(user.email, user.name, otp).catch(() => {});
  await sendWelcomeEmail(user.email, user.name).catch(() => {});

  const { accessToken, refreshToken } = generateTokens(user);
  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json(new ApiResponse(201, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  }, 'Registration successful. Please verify your email.'));
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account deactivated. Contact support.');
  }

  if (user.isBanned) {
    throw new ApiError(403, 'Account banned. Contact support.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  user.lastLogin = new Date();
  user.loginHistory = user.loginHistory || [];
  user.loginHistory.unshift({
    ip: getClientIP(req),
    userAgent: req.headers['user-agent']?.substring(0, 200),
    timestamp: new Date(),
  });
  if (user.loginHistory.length > 20) user.loginHistory = user.loginHistory.slice(0, 20);
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);
  setAuthCookies(res, accessToken, refreshToken);

  res.json(new ApiResponse(200, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isPrime: user.isPrime,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  }, 'Login successful'));
});

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
export const refreshToken = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = generateTokens(req.user);
  setAuthCookies(res, accessToken, refreshToken);
  res.json(new ApiResponse(200, { accessToken, refreshToken }, 'Token refreshed'));
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    '-password -otp -resetPasswordToken -resetPasswordExpire'
  );
  res.json(new ApiResponse(200, { user }));
});

// @desc    Send OTP
// @route   POST /api/auth/send-otp
export const sendOTP = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isVerified) {
    throw new ApiError(400, 'Email already verified.');
  }

  const otp = user.generateOTP();
  await user.save();
  await sendVerificationEmail(user.email, user.name, otp).catch(() => {});

  res.json(new ApiResponse(200, null, 'OTP sent to your email'));
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  const result = verifyOTP(otp, user.otp?.code, user.otp?.expiresAt, user.otp?.attempts);

  if (!result.isValid) {
    await user.save();
    throw new ApiError(400, result.reason);
  }

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  res.json(new ApiResponse(200, null, 'Email verified successfully'));
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json(new ApiResponse(200, null, 'If the email exists, a reset link has been sent.'));
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save();
  await sendPasswordResetEmail(user.email, user.name, resetToken).catch(() => {});

  res.json(new ApiResponse(200, null, 'Password reset link sent'));
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token.');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);
  setAuthCookies(res, accessToken, refreshToken);

  res.json(new ApiResponse(200, { accessToken }, 'Password reset successful'));
});

// @desc    Change password
// @route   PUT /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Password changed. Please login again.'));
});
