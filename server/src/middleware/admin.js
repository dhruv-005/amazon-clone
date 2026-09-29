import { ApiError } from '../utils/apiError.js';

/**
 * Check if authenticated user has 'admin' role
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin privileges required.');
  }

  next();
};

/**
 * Check if user is Super Admin
 */
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Super Admin privileges required.');
  }

  next();
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(permission)) {
      throw new ApiError(403, `Access denied. Missing '${permission}' permission.`);
    }

    next();
  };
};

/**
 * Admin action logger middleware
 */
export const logAdminAction = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    req.adminAction = {
      adminId: req.user._id,
      adminEmail: req.user.email,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      timestamp: new Date(),
    };
  }
  next();
};

export default isAdmin;
