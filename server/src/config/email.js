// ============================================
// EMAIL CONFIGURATION - Nodemailer (Production Safe)
// ============================================

import nodemailer from 'nodemailer';
import config from './index.js';
import logger from './logger.js';

let transporter = null;
let isEmailDisabled = false;

/**
 * Initialize Email Transporter with Cloud Safe Settings
 */
const initEmailTransporter = () => {
  if (!config.email.user || !config.email.pass || config.email.user.includes('your_email')) {
    logger.info('Email credentials not configured. Email service disabled.');
    isEmailDisabled = true;
    return null;
  }

  try {
    const isPort465 = Number(config.email.port) === 465;

    transporter = nodemailer.createTransport({
      host: config.email.host || 'smtp.gmail.com',
      port: Number(config.email.port) || 465,
      secure: isPort465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      connectionTimeout: 4000, // 4s timeout (never hangs the server)
      greetingTimeout: 4000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection asynchronously without blocking server start
    transporter.verify((error) => {
      if (error) {
        logger.warn(`Email server not reachable (${error.message}). Emails will be skipped.`);
        isEmailDisabled = true;
      } else {
        logger.info('✅ Email Transporter Ready');
      }
    });

    return transporter;
  } catch (error) {
    logger.warn(`Email transporter init failed: ${error.message}`);
    isEmailDisabled = true;
    return null;
  }
};

/**
 * Get Email Transporter
 */
export const getTransporter = () => {
  if (isEmailDisabled) return null;
  if (!transporter) {
    initEmailTransporter();
  }
  return transporter;
};

/**
 * Send Email safely (never crashes or hangs the API)
 */
export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  if (isEmailDisabled) {
    return { success: false, message: 'Email service inactive' };
  }

  try {
    const emailTransporter = getTransporter();
    if (!emailTransporter) {
      return { success: false, message: 'No email transporter available' };
    }

    const mailOptions = {
      from: `"Amazon Clone" <${config.email.from || config.email.user}>`,
      to,
      subject,
      html,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
      attachments,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info(`Email delivered to ${to} (${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.warn(`Email delivery skipped to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #232f3e;">Welcome to Amazon Clone, ${name}!</h2>
      <p>Thank you for creating your account. Start shopping millions of products today.</p>
    </div>
  `;
  return sendEmail({ to, subject: 'Welcome to Amazon Clone! 🎉', html });
};

export const sendVerificationEmail = async (to, name, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #232f3e;">Verify Your Email, ${name}</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #ff9900; padding: 15px; background: #f0f2f2; text-align: center;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #888;">Valid for 10 minutes.</p>
    </div>
  `;
  return sendEmail({ to, subject: `Your Verification Code: ${otp}`, html });
};

export const sendPasswordResetEmail = async (to, name, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #232f3e;">Reset Your Password</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #ffd814; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Reset Password
      </a>
    </div>
  `;
  return sendEmail({ to, subject: 'Password Reset Request', html });
};

export const sendOrderConfirmationEmail = async (to, name, order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #067d62;">Order Confirmed: #${order.orderNumber}</h2>
      <p>Hi ${name}, thank you for your order! It is now being prepared for delivery.</p>
      <p><strong>Payment Mode:</strong> Cash on Delivery</p>
      <p><strong>Total:</strong> ₹${order.pricing.total.toLocaleString('en-IN')}</p>
    </div>
  `;
  return sendEmail({ to, subject: `Order Confirmed - #${order.orderNumber}`, html });
};

export default initEmailTransporter;
