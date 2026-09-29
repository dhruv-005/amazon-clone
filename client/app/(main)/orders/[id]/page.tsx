'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetOrderByIdQuery } from '@/store/api/orderApi';
import OrderDetails from '@/components/order/OrderDetails';
import OrderTimeline from '@/components/order/OrderTimeline';
import TrackingMap from '@/components/order/TrackingMap';
import Breadcrumb from '@/components/ui/Breadcrumb';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function OrderViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, isLoading } = useGetOrderByIdQuery(id, { skip: !id });
  const order = data?.data?.order;

  if (isLoading || !order) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Your Account', href: '/account' },
          { label: 'Your Orders', href: '/orders' },
          { label: `Order #${order.orderNumber}` },
        ]}
      />

      <OrderTimeline
        status={order.status}
        updates={order.tracking?.updates}
      />

      <TrackingMap destinationCity={order.shippingAddress?.city} />

      <OrderDetails order={order} />
    </div>
  );
}
