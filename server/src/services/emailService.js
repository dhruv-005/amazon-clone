import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from '../config/email.js';
import logger from '../config/logger.js';
import config from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '../templates');

/**
 * Replace placeholder variables in HTML templates
 */
const renderTemplate = (templateName, variables = {}) => {
  try {
    const templatePath = path.join(templatesDir, `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      // Fallback simple HTML if template file is missing
      return `<div style="font-family: Arial;"><h2>${variables.title || 'Notification'}</h2><p>${variables.message || ''}</p></div>`;
    }

    let html = fs.readFileSync(templatePath, 'utf8');
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, value ?? '');
    }
    return html;
  } catch (error) {
    logger.error(`Error rendering email template ${templateName}: ${error.message}`);
    return `<p>${variables.message || 'Notification from Amazon Clone'}</p>`;
  }
};

export const sendAccountWelcome = async (user) => {
  const html = renderTemplate('welcome', {
    name: user.name,
    clientUrl: config.clientUrl,
    loginUrl: `${config.clientUrl}/login`,
  });

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Amazon Clone!',
    html,
  });
};

export const sendVerificationOTP = async (user, otp) => {
  const html = renderTemplate('verifyEmail', {
    name: user.name,
    otp,
    expiresIn: '10 minutes',
  });

  return sendEmail({
    to: user.email,
    subject: `Your Verification Code: ${otp}`,
    html,
  });
};

export const sendPasswordReset = async (user, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  const html = renderTemplate('resetPassword', {
    name: user.name,
    resetUrl,
    expiresIn: '1 hour',
  });

  return sendEmail({
    to: user.email,
    subject: 'Reset your Amazon Clone Password',
    html,
  });
};

export const sendOrderReceipt = async (user, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
          <strong>${item.title}</strong><br/>
          <span style="color: #666; font-size: 12px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  const html = renderTemplate('orderConfirmation', {
    name: user.name,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-IN'),
    itemsList: itemsHtml,
    subtotal: `₹${order.pricing.subtotal.toLocaleString('en-IN')}`,
    shipping: order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`,
    tax: `₹${order.pricing.tax.toLocaleString('en-IN')}`,
    total: `₹${order.pricing.total.toLocaleString('en-IN')}`,
    deliveryAddress: `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`,
    trackingUrl: `${config.clientUrl}/orders/${order._id}`,
  });

  return sendEmail({
    to: user.email,
    subject: `Order Confirmed: #${order.orderNumber}`,
    html,
  });
};

export const sendOrderDispatched = async (user, order) => {
  const html = renderTemplate('orderShipped', {
    name: user.name,
    orderNumber: order.orderNumber,
    carrier: order.tracking?.carrier || 'Standard Courier',
    trackingNumber: order.tracking?.trackingNumber || 'N/A',
    trackingUrl: `${config.clientUrl}/orders/${order._id}`,
    estimatedDelivery: new Date(order.estimatedDelivery).toLocaleDateString('en-IN'),
  });

  return sendEmail({
    to: user.email,
    subject: `Shipped: Your order #${order.orderNumber} is on the way`,
    html,
  });
};

export const sendOrderDelivered = async (user, order) => {
  const html = renderTemplate('orderDelivered', {
    name: user.name,
    orderNumber: order.orderNumber,
    reviewUrl: `${config.clientUrl}/orders/${order._id}`,
  });

  return sendEmail({
    to: user.email,
    subject: `Delivered: Your Amazon package #${order.orderNumber}`,
    html,
  });
};

export const sendRefundConfirmation = async (user, order, refundAmount) => {
  const html = renderTemplate('refundProcessed', {
    name: user.name,
    orderNumber: order.orderNumber,
    refundAmount: `₹${refundAmount.toLocaleString('en-IN')}`,
  });

  return sendEmail({
    to: user.email,
    subject: `Refund processed for order #${order.orderNumber}`,
    html,
  });
};

export default {
  sendAccountWelcome,
  sendVerificationOTP,
  sendPasswordReset,
  sendOrderReceipt,
  sendOrderDispatched,
  sendOrderDelivered,
  sendRefundConfirmation,
};
