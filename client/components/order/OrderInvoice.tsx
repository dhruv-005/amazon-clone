'use client';

import React from 'react';
import { Order } from '@/types/order';

interface OrderInvoiceProps {
  order: Order;
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order }) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8 max-w-3xl mx-auto space-y-6 text-xs text-gray-800 print:border-none print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-orange-500 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            amazon<span className="text-orange-500">.in</span>
          </h1>
          <p className="text-[10px] text-gray-500">Tax Invoice / Bill of Supply / Cash Receipt</p>
        </div>
        <div className="text-right space-y-1">
          <button
            onClick={handlePrint}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-4 py-1 rounded font-semibold print:hidden shadow-sm"
          >
            Print Invoice
          </button>
          <p className="font-bold text-gray-900">Invoice #: {order.orderNumber}</p>
          <p className="text-gray-500">Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Sold By:</h4>
          <p>Amazon Clone Retail Services Pvt Ltd</p>
          <p>Bangalore Fulfillment Centre, Karnataka - 560103</p>
          <p>GSTIN: 29AAAAA0000A1Z5</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Billing & Shipping Address:</h4>
          <p className="font-semibold">{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.addressLine1}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          <p>Phone: {order.shippingAddress?.phoneNumber}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Item</th>
            <th className="border border-gray-300 p-2 text-center">Qty</th>
            <th className="border border-gray-300 p-2 text-right">Gross Amount</th>
            <th className="border border-gray-300 p-2 text-right">Tax (GST)</th>
            <th className="border border-gray-300 p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2 font-medium">{item.title}</td>
              <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
              <td className="border border-gray-300 p-2 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
              <td className="border border-gray-300 p-2 text-right">₹{(item.price * 0.18).toFixed(2)}</td>
              <td className="border border-gray-300 p-2 text-right font-bold">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Box */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{order.pricing?.shipping || 0}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-1 font-bold text-sm text-gray-900">
            <span>Grand Total:</span>
            <span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;
