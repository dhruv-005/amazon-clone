import { getStripe, createPaymentIntent, createRefund as stripeRefund } from '../config/stripe.js';
import { getRazorpay, createRazorpayOrder, verifyRazorpaySignature, createRazorpayRefund } from '../config/razorpay.js';
import Transaction from '../models/Transaction.js';
import { generateTransactionId } from '../utils/helpers.js';
import logger from '../config/logger.js';

export const initializePayment = async ({ order, gateway, user }) => {
  const amountInPaise = Math.round(order.pricing.total * 100);

  if (gateway === 'stripe') {
    const paymentIntent = await createPaymentIntent(amountInPaise, 'inr', {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      userId: user._id.toString(),
    });

    await Transaction.create({
      order: order._id,
      user: user._id,
      transactionId: generateTransactionId(),
      gateway: 'stripe',
      gatewayTransactionId: paymentIntent.id,
      type: 'payment',
      amount: order.pricing.total,
      status: 'pending',
      method: order.payment.method,
    });

    return {
      gateway: 'stripe',
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    };
  }

  if (gateway === 'razorpay') {
    const rzpOrder = await createRazorpayOrder(amountInPaise, 'INR', order.orderNumber, {
      orderId: order._id.toString(),
    });

    await Transaction.create({
      order: order._id,
      user: user._id,
      transactionId: generateTransactionId(),
      gateway: 'razorpay',
      gatewayTransactionId: rzpOrder.id,
      type: 'payment',
      amount: order.pricing.total,
      status: 'pending',
      method: order.payment.method,
    });

    return {
      gateway: 'razorpay',
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  if (gateway === 'cod') {
    await Transaction.create({
      order: order._id,
      user: user._id,
      transactionId: generateTransactionId(),
      gateway: 'cod',
      type: 'payment',
      amount: order.pricing.total,
      status: 'pending',
      method: 'cod',
    });

    return { gateway: 'cod', message: 'Cash on delivery selected' };
  }

  throw new Error(`Unsupported payment gateway: ${gateway}`);
};

export const verifyPayment = async ({ gateway, paymentId, orderId, signature, razorpayOrderId }) => {
  if (gateway === 'razorpay') {
    const isValid = verifyRazorpaySignature(razorpayOrderId, paymentId, signature);
    if (!isValid) throw new Error('Razorpay signature verification failed');

    await Transaction.findOneAndUpdate(
      { gatewayTransactionId: razorpayOrderId },
      { status: 'completed', processedAt: new Date() }
    );
    return true;
  }

  if (gateway === 'stripe') {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentId);
    if (intent.status !== 'succeeded') throw new Error(`Stripe payment state: ${intent.status}`);

    await Transaction.findOneAndUpdate(
      { gatewayTransactionId: paymentId },
      { status: 'completed', processedAt: new Date() }
    );
    return true;
  }

  if (gateway === 'cod') {
    return true;
  }

  return false;
};

export const issueRefund = async ({ order, amount, reason }) => {
  const refundAmount = amount || order.pricing.total;
  let gatewayRefundId = null;

  try {
    if (order.payment.gateway === 'stripe' && order.payment.transactionId) {
      const refund = await stripeRefund(order.payment.transactionId, Math.round(refundAmount * 100));
      gatewayRefundId = refund.id;
    } else if (order.payment.gateway === 'razorpay' && order.payment.transactionId) {
      const refund = await createRazorpayRefund(order.payment.transactionId, Math.round(refundAmount * 100));
      gatewayRefundId = refund.id;
    }

    const transaction = await Transaction.create({
      order: order._id,
      user: order.user,
      transactionId: generateTransactionId(),
      gateway: order.payment.gateway,
      gatewayTransactionId: gatewayRefundId,
      type: 'refund',
      amount: refundAmount,
      status: 'completed',
      description: reason || 'Order refund',
      processedAt: new Date(),
    });

    return transaction;
  } catch (error) {
    logger.error(`Refund failed for order #${order.orderNumber}: ${error.message}`);
    throw error;
  }
};

export default {
  initializePayment,
  verifyPayment,
  issueRefund,
};
