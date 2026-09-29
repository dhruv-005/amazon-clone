// ============================================
// APPLICATION CONSTANTS
// ============================================

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  ADMIN: 'admin',
};

// Order Status
export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  COD: 'cod',
  WALLET: 'wallet',
  EMI: 'emi',
};

// Product Condition
export const PRODUCT_CONDITION = {
  NEW: 'new',
  USED_LIKE_NEW: 'used_like_new',
  USED_GOOD: 'used_good',
  USED_ACCEPTABLE: 'used_acceptable',
  REFURBISHED: 'refurbished',
};

// Deal Types
export const DEAL_TYPES = {
  LIGHTNING: 'lightning',
  DAILY: 'daily',
  CLEARANCE: 'clearance',
  PRIME_EXCLUSIVE: 'prime_exclusive',
  FESTIVE: 'festive',
};

// Coupon Types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  FREE_SHIPPING: 'free_shipping',
  BUY_ONE_GET_ONE: 'buy_one_get_one',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_PLACED: 'order_placed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  ORDER_CANCELLED: 'order_cancelled',
  ORDER_RETURNED: 'order_returned',
  PRICE_DROP: 'price_drop',
  DEAL_ALERT: 'deal_alert',
  REVIEW_REMINDER: 'review_reminder',
  BACK_IN_STOCK: 'back_in_stock',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
};

// Return Reasons
export const RETURN_REASONS = {
  DEFECTIVE: 'defective',
  WRONG_ITEM: 'wrong_item',
  NOT_AS_DESCRIBED: 'not_as_described',
  SIZE_TOO_SMALL: 'size_too_small',
  SIZE_TOO_LARGE: 'size_too_large',
  QUALITY_ISSUE: 'quality_issue',
  NO_LONGER_NEEDED: 'no_longer_needed',
  BETTER_PRICE: 'better_price',
  OTHER: 'other',
};

// Shipping Carriers
export const SHIPPING_CARRIERS = {
  AMAZON_LOGISTICS: 'amazon_logistics',
  BLUE_DART: 'blue_dart',
  DELHIVERY: 'delhivery',
  ECOM_EXPRESS: 'ecom_express',
  FEDEX: 'fedex',
  INDIA_POST: 'india_post',
  DTDC: 'dtdc',
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 300,        // 5 minutes
  MEDIUM: 1800,      // 30 minutes
  LONG: 3600,        // 1 hour
  VERY_LONG: 86400,  // 24 hours
  PRODUCT: 1800,     // 30 minutes
  CATEGORY: 3600,    // 1 hour
  SEARCH: 300,       // 5 minutes
  USER: 900,         // 15 minutes
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PRODUCT_LIMIT: 24,
  REVIEW_LIMIT: 10,
  ORDER_LIMIT: 10,
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,     // 10MB
  MAX_DOCUMENT_SIZE: 20 * 1024 * 1024,  // 20MB
  MAX_IMAGES_PER_PRODUCT: 9,
  MAX_REVIEW_IMAGES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
};

// Prime Membership
export const PRIME = {
  MONTHLY_PRICE: 129,
  YEARLY_PRICE: 1499,
  FREE_SHIPPING_THRESHOLD: 0,  // Free shipping on all orders
  DELIVERY_DAYS: 1,            // Next day delivery
};

// Tax Rates (GST - India)
export const TAX_RATES = {
  GST_0: 0,
  GST_5: 5,
  GST_12: 12,
  GST_18: 18,
  GST_28: 28,
};

// OTP Settings
export const OTP_SETTINGS = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3,
};

// Review Settings
export const REVIEW_SETTINGS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT_LENGTH: 10,
  MAX_COMMENT_LENGTH: 5000,
};

export default {
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PRODUCT_CONDITION,
  DEAL_TYPES,
  COUPON_TYPES,
  NOTIFICATION_TYPES,
  RETURN_REASONS,
  SHIPPING_CARRIERS,
  CACHE_TTL,
  PAGINATION,
  UPLOAD_LIMITS,
  PRIME,
  TAX_RATES,
  OTP_SETTINGS,
  REVIEW_SETTINGS,
};
