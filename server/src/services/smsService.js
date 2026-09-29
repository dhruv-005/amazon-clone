import logger from '../config/logger.js';

export const sendSMS = async (phoneNumber, message) => {
  // Mock SMS Provider Gateway (e.g., Twilio / Fast2SMS)
  try {
    logger.info(`[SMS to ${phoneNumber}]: ${message}`);
    return { success: true, timestamp: new Date() };
  } catch (error) {
    logger.error(`SMS send failed to ${phoneNumber}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const sendOrderUpdateSMS = async (phoneNumber, orderNumber, status) => {
  const message = `Amazon Clone: Order #${orderNumber} is now ${status}. Track at amazonclone.com`;
  return sendSMS(phoneNumber, message);
};

export default {
  sendSMS,
  sendOrderUpdateSMS,
};
