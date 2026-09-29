// ============================================
// JWT TOKEN GENERATION & MANAGEMENT
// ============================================

import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate Access Token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId, role = 'customer') => {
  return jwt.sign(
    { id: userId, role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

/**
 * Generate Refresh Token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

/**
 * Generate both Access and Refresh tokens
 * @param {object} user - User object
 * @returns {object} { accessToken, refreshToken }
 */
export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

/**
 * Get token expiry time in milliseconds
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiry
 */
export const getTokenExpiryMs = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  return Math.max(0, decoded.exp * 1000 - Date.now());
};

/**
 * Set auth cookies on response
 * @param {object} res - Express response object
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
    path: '/api/auth',
  });
};

/**
 * Clear auth cookies
 * @param {object} res - Express response object
 */
export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: '/api/auth',
  });
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiryMs,
  setAuthCookies,
  clearAuthCookies,
};
