'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types/order';
import OrderStatus from './OrderStatus';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
  onReturn?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onCancel,
  onReturn,
}) => {
  const isDelivered = order.status === 'delivered';
  const isCancellable = ['placed', 'confirmed', 'processing'].includes(order.status);

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm text-xs">
      {/* Top Meta Bar */}
      <div className="bg-[#f0f2f2] px-4 py-3 border-b border-gray-300 flex flex-wrap justify-between items-center gap-4 text-gray-600">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="uppercase text-[10px] block font-bold text-gray-500">Order Placed</span>
            <span className="text-gray-900 font-medium">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div>
            <span className="uppercase text-[10px] block font-bold text-gray-500">Total</span>
            <span className="text-gray-900 font-bold">
              ₹{order.pricing?.total?.toLocaleString('en-IN') || 0}
            </span>
          </div>

          <div>
            <span className="uppercase text-[10px] block font-bold text-gray-500">Ship To</span>
            <span className="text-[#007185] font-medium cursor-pointer hover:underline truncate max-w-[120px] block">
              {order.shippingAddress?.fullName || 'Customer'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="uppercase text-[10px] block font-bold text-gray-500">Order # {order.orderNumber}</span>
          <div className="flex items-center gap-2 mt-0.5 justify-end">
            <Link
              href={`/orders/${order._id}`}
              className="text-[#007185] hover:text-[#c45500] hover:underline"
            >
              View order details
            </Link>
          </div>
        </div>
      </div>

      {/* Main Order Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Delivery / Status Headline */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {isDelivered
                ? `Delivered on ${new Date(order.deliveredAt || order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                : `Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
            </h3>
            <p className="text-[11px] text-gray-500">Package handed directly to resident</p>
          </div>
          <OrderStatus status={order.status} />
        </div>

        {/* Ordered Items List */}
        <div className="space-y-4 divide-y divide-gray-100">
          {order.items?.map((item, idx) => {
            const productObj = typeof item.product === 'object' ? item.product : null;
            const productId = productObj?._id || (typeof item.product === 'string' ? item.product : '');

            return (
              <div key={idx} className="pt-3 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 bg-white flex-shrink-0 border border-gray-200 rounded p-1">
                    <Image
                      src={item.image || productObj?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.title || 'Product'}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${productId}`}
                      className="font-medium text-gray-900 hover:text-[#c45500] hover:underline line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-gray-500">
                      Qty: {item.quantity} | ₹{item.price?.toLocaleString('en-IN')}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Link
                        href={`/products/${productId}`}
                        className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-3 py-1 rounded-full font-medium shadow-sm border border-[#fcd200]"
                      >
                        Buy it again
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0 justify-end">
                  <Link
                    href={`/orders/${order._id}/tracking`}
                    className="w-full text-center px-4 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 shadow-sm font-medium"
                  >
                    Track package
                  </Link>
                  {isCancellable && onCancel && (
                    <button
                      onClick={() => onCancel(order._id)}
                      className="w-full text-center px-4 py-1.5 border border-red-300 text-red-600 rounded-md bg-white hover:bg-red-50 font-medium"
                    >
                      Cancel order
                    </button>
                  )}
                  {isDelivered && onReturn && (
                    <button
                      onClick={() => onReturn(order._id)}
                      className="w-full text-center px-4 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 font-medium"
                    >
                      Return item
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
