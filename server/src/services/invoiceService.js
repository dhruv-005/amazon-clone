import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoiceHTML = (order, user) => {
  const itemsHtml = order.items
    .map(
      (item, index) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${index + 1}</td>
        <td style="padding: 8px;"><strong>${item.title}</strong></td>
        <td style="padding: 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 8px; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Tax Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 30px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ff9900; padding-bottom: 10px; }
          .logo { font-size: 24px; font-weight: bold; color: #131921; }
          .logo span { color: #ff9900; }
          .invoice-title { text-align: right; }
          .meta-table { width: 100%; margin: 20px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th { background: #f3f3f3; padding: 10px 8px; text-align: left; border-bottom: 2px solid #ddd; }
          .totals { width: 40%; margin-left: auto; margin-top: 20px; }
          .totals-table { width: 100%; border-collapse: collapse; }
          .totals-table td { padding: 6px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">amazon<span>clone</span></div>
          <div class="invoice-title">
            <h2>TAX INVOICE</h2>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <table class="meta-table">
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <strong>Sold By:</strong><br/>
              Amazon Clone Retail Services Pvt Ltd<br/>
              GSTIN: 29AAAAA0000A1Z5<br/>
              Bangalore, Karnataka, India
            </td>
            <td style="width: 50%; vertical-align: top;">
              <strong>Billing & Shipping Address:</strong><br/>
              ${order.shippingAddress.fullName}<br/>
              ${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 || ''}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
              Phone: ${order.shippingAddress.phoneNumber}
            </td>
          </tr>
        </table>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 50%;">Description</th>
              <th style="width: 10%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 20%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">₹${order.pricing.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Shipping & Handling:</td>
              <td style="text-align: right;">${order.pricing.shipping === 0 ? '₹0.00' : `₹${order.pricing.shipping}`}</td>
            </tr>
            <tr>
              <td>Estimated GST (18%):</td>
              <td style="text-align: right;">₹${order.pricing.tax.toLocaleString('en-IN')}</td>
            </tr>
            ${order.pricing.discount > 0 ? `<tr><td>Discount:</td><td style="text-align: right; color: green;">-₹${order.pricing.discount.toLocaleString('en-IN')}</td></tr>` : ''}
            <tr style="border-top: 2px solid #333; font-weight: bold; font-size: 16px;">
              <td style="padding-top: 10px;">Grand Total:</td>
              <td style="text-align: right; padding-top: 10px;">₹${order.pricing.total.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
};

export default {
  generateInvoiceHTML,
};
