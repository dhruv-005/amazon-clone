// ============================================
// EMAIL CONFIGURATION - Nodemailer Transport
// ============================================

import nodemailer from 'nodemailer';
import config from './index.js';
import logger from './logger.js';

let transporter = null;

/**
 * Initialize Email Transporter
 */
const initEmailTransporter = () => {
  try {
    if (!config.email.user || !config.email.pass) {
      logger.warn('⚠️  Email credentials not found. Email features disabled.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        logger.error(`Email transporter verification failed: ${error.message}`);
      } else {
        logger.info('✅ Email Transporter Ready');
      }
    });

    return transporter;
  } catch (error) {
    logger.error(`Email transporter init error: ${error.message}`);
    return null;
  }
};

/**
 * Get Email Transporter
 */
export const getTransporter = () => {
  if (!transporter) {
    initEmailTransporter();
  }
  return transporter;
};

/**
 * Send Email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @param {array} options.attachments - Attachments array
 * @returns {object} Send result
 */
export const sendEmail = async ({ to, subject, html, text, attachments = [] }) => {
  try {
    const emailTransporter = getTransporter();
    if (!emailTransporter) {
      logger.warn(`Email not sent (no transporter): To ${to}, Subject: ${subject}`);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"Amazon Clone" <${config.email.from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
      attachments,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId} to ${to}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(`Send email error: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #232f3e; padding: 20px; text-align: center;">
        <h1 style="color: #ff9900; margin: 0;">amazon clone</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #232f3e;">Welcome to Amazon Clone, ${name}!</h2>
        <p style="color: #555; line-height: 1.6;">
          Thank you for creating an account. We're excited to have you on board!
        </p>
        <p style="color: #555; line-height: 1.6;">
          Start exploring millions of products at unbeatable prices.
        </p>
        <a href="${config.clientUrl}" 
           style="display: inline-block; background: #ff9900; color: #fff; 
                  padding: 12px 30px; text-decoration: none; border-radius: 4px;
                  font-weight: bold; margin-top: 15px;">
          Start Shopping
        </a>
      </div>
      <div style="background: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Amazon Clone. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Welcome to Amazon Clone! 🎉',
    html,
  });
};

/**
 * Send OTP / Verification Email
 */
export const sendVerificationEmail = async (to, name, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #232f3e; padding: 20px; text-align: center;">
        <h1 style="color: #ff9900; margin: 0;">amazon clone</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #232f3e;">Verify Your Email, ${name}</h2>
        <p style="color: #555;">Use the following OTP to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; 
                       color: #232f3e; background: #f0f0f0; padding: 15px 30px; 
                       border-radius: 8px;">
            ${otp}
          </span>
        </div>
        <p style="color: #999; font-size: 13px;">
          This OTP will expire in 10 minutes. Do not share it with anyone.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Your Verification OTP: ${otp}`,
    html,
  });
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (to, name, resetToken) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #232f3e; padding: 20px; text-align: center;">
        <h1 style="color: #ff9900; margin: 0;">amazon clone</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #232f3e;">Reset Your Password</h2>
        <p style="color: #555;">Hi ${name},</p>
        <p style="color: #555;">
          We received a request to reset your password. Click the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; background: #ff9900; color: #fff; 
                    padding: 14px 40px; text-decoration: none; border-radius: 4px;
                    font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 13px;">
          If you didn't request this, please ignore this email.
          This link expires in 1 hour.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Password Reset Request',
    html,
  });
};

/**
 * Send Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async (to, name, order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.title}" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #232f3e; padding: 20px; text-align: center;">
        <h1 style="color: #ff9900; margin: 0;">amazon clone</h1>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #232f3e;">Order Confirmed! 🎉</h2>
        <p style="color: #555;">Hi ${name},</p>
        <p style="color: #555;">
          Thank you for your order! Your order number is 
          <strong style="color: #ff9900;">${order.orderNumber}</strong>
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #232f3e;">
          Total: ₹${order.pricing.total.toLocaleString()}
        </div>
        <a href="${config.clientUrl}/orders/${order._id}" 
           style="display: inline-block; background: #ff9900; color: #fff; 
                  padding: 12px 30px; text-decoration: none; border-radius: 4px;
                  font-weight: bold; margin-top: 20px;">
          Track Your Order
        </a>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html,
  });
};

export default initEmailTransporter;
