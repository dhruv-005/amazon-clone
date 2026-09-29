'use client';

import React from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCreateOrderMutation } from '@/store/api/orderApi';
import { clearCartLocal } from '@/store/slices/cartSlice';
import { setRecentOrder, resetCheckout } from '@/store/slices/checkoutSlice';
import DeliveryOptions from './DeliveryOptions';
import GiftOptions from './GiftOptions';
import Button from '../ui/Button';

interface ReviewStepProps {
  onOrderPlaced: (order: any) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onOrderPlaced }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { selectedAddress, isGift, giftMessage, orderNotes } = useAppSelector(
    (state) => state.checkout
  );

  const [createOrderApi, { isLoading }] = useCreateOrderMutation();

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Missing delivery address');
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        variant: item.variant,
      })),
      shippingAddress: selectedAddress,
      payment: {
        method: 'cod',
        gateway: 'cod',
      },
      notes: orderNotes,
      isGift,
      giftMessage,
    };

    try {
      const res = await createOrderApi(payload).unwrap();
      dispatch(clearCartLocal());
      onOrderPlaced(res.data.order);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
        3. Review items and delivery
      </h2>

      {/* Delivery Speed Selector */}
      <DeliveryOptions />

      {/* Items List in Order */}
      <div className="space-y-4 divide-y divide-gray-100">
        {cartItems.map((item) => (
          <div key={item._id} className="pt-3 flex gap-4 text-xs">
            <div className="relative w-20 h-20 bg-white flex-shrink-0">
              <Image
                src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                alt={item.product?.title || ''}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-gray-900 line-clamp-2">
                {item.product?.title}
              </h4>
              <p className="text-gray-600">
                Quantity: <strong>{item.quantity}</strong>
              </p>
              <p className="text-[#b12704] font-bold">
                ₹{(item.product?.price?.current * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gift Options */}
      <GiftOptions />

      {/* Place Order CTA */}
      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-600">
            By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          isLoading={isLoading}
          onClick={handlePlaceOrder}
          className="w-full sm:w-auto px-8"
        >
          Place Your Order (COD)
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
