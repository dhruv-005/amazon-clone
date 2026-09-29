// ============================================
// STRIPE PAYMENT CONFIGURATION
// ============================================

import Stripe from 'stripe';
import config from './index.js';
import logger from './logger.js';

let stripe = null;

/**
 * Initialize Stripe
 */
const initStripe = () => {
  try {
    if (!config.stripe.secretKey) {
      logger.warn('⚠️  Stripe secret key not found. Payment features disabled.');
      return null;
    }

    stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-04-10',
      maxNetworkRetries: 3,
      timeout: 30000,
    });

    logger.info('✅ Stripe Initialized Successfully');
    return stripe;
  } catch (error) {
    logger.error(`Stripe initialization error: ${error.message}`);
    return null;
  }
};

/**
 * Get Stripe Instance
 */
export const getStripe = () => {
  if (!stripe) {
    initStripe();
  }
  return stripe;
};

/**
 * Create Payment Intent
 * @param {number} amount - Amount in smallest currency unit (e.g., paise)
 * @param {string} currency - Currency code (e.g., 'inr', 'usd')
 * @param {object} metadata - Additional metadata
 * @returns {object} Payment intent object
 */
export const createPaymentIntent = async (amount, currency = 'inr', metadata = {}) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) throw new Error('Stripe not initialized');

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return paymentIntent;
  } catch (error) {
    logger.error(`Create payment intent error: ${error.message}`);
    throw error;
  }
};

/**
 * Create Checkout Session
 * @param {object} lineItems - Array of line items
 * @param {string} successUrl - Redirect URL on success
 * @param {string} cancelUrl - Redirect URL on cancel
 * @returns {object} Checkout session
 */
export const createCheckoutSession = async (lineItems, successUrl, cancelUrl) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) throw new Error('Stripe not initialized');

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ['IN', 'US', 'GB', 'CA'],
      },
      billing_address_collection: 'required',
    });

    return session;
  } catch (error) {
    logger.error(`Create checkout session error: ${error.message}`);
    throw error;
  }
};

/**
 * Verify Webhook Signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {object} Verified event
 */
export const verifyWebhookSignature = (payload, signature) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) throw new Error('Stripe not initialized');

    const event = stripeInstance.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    );

    return event;
  } catch (error) {
    logger.error(`Webhook verification error: ${error.message}`);
    throw error;
  }
};

/**
 * Create Refund
 * @param {string} paymentIntentId - Payment intent ID
 * @param {number} amount - Refund amount (optional, defaults to full)
 * @returns {object} Refund object
 */
export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) throw new Error('Stripe not initialized');

    const refundOptions = { payment_intent: paymentIntentId };
    if (amount) refundOptions.amount = amount;

    const refund = await stripeInstance.refunds.create(refundOptions);
    logger.info(`Refund created: ${refund.id}`);
    return refund;
  } catch (error) {
    logger.error(`Create refund error: ${error.message}`);
    throw error;
  }
};

export default initStripe;
