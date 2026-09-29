// ============================================
// RAZORPAY PAYMENT CONFIGURATION (India)
// ============================================

import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from './index.js';
import logger from './logger.js';

let razorpayInstance = null;

/**
 * Initialize Razorpay
 */
const initRazorpay = () => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      logger.warn('⚠️  Razorpay keys not found. Razorpay features disabled.');
      return null;
    }

    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });

    logger.info('✅ Razorpay Initialized Successfully');
    return razorpayInstance;
  } catch (error) {
    logger.error(`Razorpay initialization error: ${error.message}`);
    return null;
  }
};

/**
 * Get Razorpay Instance
 */
export const getRazorpay = () => {
  if (!razorpayInstance) {
    initRazorpay();
  }
  return razorpayInstance;
};

/**
 * Create Razorpay Order
 * @param {number} amount - Amount in paise (₹1 = 100 paise)
 * @param {string} currency - Currency code
 * @param {string} receipt - Receipt ID
 * @param {object} notes - Additional notes
 * @returns {object} Razorpay order
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const instance = getRazorpay();
    if (!instance) throw new Error('Razorpay not initialized');

    const options = {
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await instance.orders.create(options);
    logger.info(`Razorpay order created: ${order.id}`);
    return order;
  } catch (error) {
    logger.error(`Create Razorpay order error: ${error.message}`);
    throw error;
  }
};

/**
 * Verify Razorpay Payment Signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} Is valid
 */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;

    if (!isValid) {
      logger.warn('Razorpay signature verification failed');
    }

    return isValid;
  } catch (error) {
    logger.error(`Razorpay signature verification error: ${error.message}`);
    return false;
  }
};

/**
 * Fetch Payment Details
 * @param {string} paymentId - Razorpay payment ID
 * @returns {object} Payment details
 */
export const fetchPayment = async (paymentId) => {
  try {
    const instance = getRazorpay();
    if (!instance) throw new Error('Razorpay not initialized');

    const payment = await instance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    logger.error(`Fetch Razorpay payment error: ${error.message}`);
    throw error;
  }
};

/**
 * Create Refund via Razorpay
 * @param {string} paymentId - Payment ID
 * @param {number} amount - Refund amount in paise
 * @returns {object} Refund details
 */
export const createRazorpayRefund = async (paymentId, amount) => {
  try {
    const instance = getRazorpay();
    if (!instance) throw new Error('Razorpay not initialized');

    const refund = await instance.payments.refund(paymentId, {
      amount,
      speed: 'optimum',
    });

    logger.info(`Razorpay refund created: ${refund.id}`);
    return refund;
  } catch (error) {
    logger.error(`Razorpay refund error: ${error.message}`);
    throw error;
  }
};

export default initRazorpay;
