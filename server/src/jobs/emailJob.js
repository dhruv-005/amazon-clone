import { emailQueue } from './queue.js';
import emailService from '../services/emailService.js';
import logger from '../config/logger.js';

export const EMAIL_JOB_TYPES = {
  WELCOME: 'WELCOME',
  VERIFICATION_OTP: 'VERIFICATION_OTP',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ORDER_CONFIRMATION: 'ORDER_CONFIRMATION',
  ORDER_DISPATCHED: 'ORDER_DISPATCHED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  REFUND_PROCESSED: 'REFUND_PROCESSED',
};

/**
 * Worker Process Loop
 */
emailQueue.process(async (job) => {
  const { type, payload } = job.data;
  logger.info(`[EmailJob] Processing email job of type: ${type}`);

  switch (type) {
    case EMAIL_JOB_TYPES.WELCOME:
      await emailService.sendAccountWelcome(payload.user);
      break;

    case EMAIL_JOB_TYPES.VERIFICATION_OTP:
      await emailService.sendVerificationOTP(payload.user, payload.otp);
      break;

    case EMAIL_JOB_TYPES.PASSWORD_RESET:
      await emailService.sendPasswordReset(payload.user, payload.resetToken);
      break;

    case EMAIL_JOB_TYPES.ORDER_CONFIRMATION:
      await emailService.sendOrderReceipt(payload.user, payload.order);
      break;

    case EMAIL_JOB_TYPES.ORDER_DISPATCHED:
      await emailService.sendOrderDispatched(payload.user, payload.order);
      break;

    case EMAIL_JOB_TYPES.ORDER_DELIVERED:
      await emailService.sendOrderDelivered(payload.user, payload.order);
      break;

    case EMAIL_JOB_TYPES.REFUND_PROCESSED:
      await emailService.sendRefundConfirmation(payload.user, payload.order, payload.refundAmount);
      break;

    default:
      logger.warn(`[EmailJob] Unhandled email job type: ${type}`);
  }
});

/**
 * Producer Helpers
 */
export const queueWelcomeEmail = (user) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.WELCOME, payload: { user } });
};

export const queueVerificationOTP = (user, otp) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.VERIFICATION_OTP, payload: { user, otp } });
};

export const queuePasswordReset = (user, resetToken) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.PASSWORD_RESET, payload: { user, resetToken } });
};

export const queueOrderReceipt = (user, order) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.ORDER_CONFIRMATION, payload: { user, order } });
};

export const queueOrderDispatched = (user, order) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.ORDER_DISPATCHED, payload: { user, order } });
};

export const queueOrderDelivered = (user, order) => {
  return emailQueue.add({ type: EMAIL_JOB_TYPES.ORDER_DELIVERED, payload: { user, order } });
};

export const queueRefundConfirmation = (user, order, refundAmount) => {
  return emailQueue.add({
    type: EMAIL_JOB_TYPES.REFUND_PROCESSED,
    payload: { user, order, refundAmount },
  });
};

export default {
  EMAIL_JOB_TYPES,
  queueWelcomeEmail,
  queueVerificationOTP,
  queuePasswordReset,
  queueOrderReceipt,
  queueOrderDispatched,
  queueOrderDelivered,
  queueRefundConfirmation,
};
