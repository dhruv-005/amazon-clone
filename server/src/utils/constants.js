// ============================================
// UTILITY CONSTANTS
// ============================================

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Cookie Names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  CART_ID: 'cartId',
  SESSION: 'sessionId',
};

// Sort Options
export const SORT_OPTIONS = {
  PRICE_LOW: { 'price.current': 1 },
  PRICE_HIGH: { 'price.current': -1 },
  RATING: { 'ratings.average': -1 },
  NEWEST: { createdAt: -1 },
  POPULAR: { totalSold: -1 },
  FEATURED: { isFeatured: -1, createdAt: -1 },
  RELEVANCE: { score: { $meta: 'textScore' } },
  NAME_ASC: { title: 1 },
  NAME_DESC: { title: -1 },
  DISCOUNT: { 'price.discount': -1 },
};

// Sort Key Mapping
export const SORT_MAP = {
  'price-low': SORT_OPTIONS.PRICE_LOW,
  'price-high': SORT_OPTIONS.PRICE_HIGH,
  'rating': SORT_OPTIONS.RATING,
  'newest': SORT_OPTIONS.NEWEST,
  'popular': SORT_OPTIONS.POPULAR,
  'featured': SORT_OPTIONS.FEATURED,
  'relevance': SORT_OPTIONS.RELEVANCE,
  'name-asc': SORT_OPTIONS.NAME_ASC,
  'name-desc': SORT_OPTIONS.NAME_DESC,
  'discount': SORT_OPTIONS.DISCOUNT,
};

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 100, height: 100 },
  SMALL: { width: 200, height: 200 },
  MEDIUM: { width: 400, height: 400 },
  LARGE: { width: 800, height: 800 },
  XLARGE: { width: 1200, height: 1200 },
  BANNER: { width: 1920, height: 600 },
  AVATAR: { width: 300, height: 300 },
};

// Cloudinary Folders
export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'amazon-clone/products',
  CATEGORIES: 'amazon-clone/categories',
  AVATARS: 'amazon-clone/avatars',
  BANNERS: 'amazon-clone/banners',
  REVIEWS: 'amazon-clone/reviews',
  BRANDS: 'amazon-clone/brands',
  DOCUMENTS: 'amazon-clone/documents',
  INVOICES: 'amazon-clone/invoices',
  CHAT: 'amazon-clone/chat',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_IN: /^[6-9]\d{9}$/,
  PINCODE_IN: /^[1-9][0-9]{5}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  MONGO_ID: /^[0-9a-fA-F]{24}$/,
  UPI: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
};

// Response Messages
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful. Please verify your email.',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',

  // Products
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_NOT_FOUND: 'Product not found',

  // Orders
  ORDER_PLACED: 'Order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_NOT_CANCELLABLE: 'This order cannot be cancelled',

  // Cart
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  CART_UPDATED: 'Cart updated successfully',
  CART_CLEARED: 'Cart cleared',

  // Reviews
  REVIEW_CREATED: 'Review submitted successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  ALREADY_REVIEWED: 'You have already reviewed this product',

  // General
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
};

export default {
  HTTP_STATUS,
  COOKIE_NAMES,
  SORT_OPTIONS,
  SORT_MAP,
  IMAGE_SIZES,
  CLOUDINARY_FOLDERS,
  REGEX,
  MESSAGES,
};
