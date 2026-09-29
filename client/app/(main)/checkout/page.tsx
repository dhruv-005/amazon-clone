'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import AddressStep from '@/components/checkout/AddressStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useAppSelector((state) => state.cart);
  const { currentStep } = useAppSelector((state) => state.checkout);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  if (placedOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <OrderConfirmation order={placedOrder} />
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#eaeded] pb-12">
      {/* Checkout Step Breadcrumbs */}
      <CheckoutSteps currentStep={currentStep} />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Step Wizard */}
        <div className="lg:col-span-8 space-y-4">
          {currentStep === 1 && <AddressStep />}
          {currentStep === 2 && <PaymentStep />}
          {currentStep === 3 && (
            <ReviewStep onOrderPlaced={(order) => setPlacedOrder(order)} />
          )}
        </div>

        {/* Right Column: Order Summary Pricing Box */}
        <div className="lg:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
