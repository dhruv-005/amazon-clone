'use client';

import React from 'react';
import Link from 'next/link';

const helpTopics = [
  { title: 'Your Orders', desc: 'Track packages, edit or cancel orders', icon: '📦', href: '/orders' },
  { title: 'Returns & Refunds', desc: 'Return items, check refund status', icon: '🔄', href: '/orders' },
  { title: 'Payment Settings', desc: 'Cash on Delivery and invoice assistance', icon: '💳', href: '/account' },
  { title: 'Account Settings', desc: 'Change email, password, or addresses', icon: '👤', href: '/account' },
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-xs text-gray-800">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Hello. What can we help you with?
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Amazon Clone Customer Service and Help Center
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {helpTopics.map((topic) => (
          <Link
            key={topic.title}
            href={topic.href}
            className="p-5 bg-white border border-gray-300 hover:border-orange-500 rounded-lg shadow-sm hover:shadow transition flex flex-col items-center text-center space-y-2 group"
          >
            <span className="text-3xl">{topic.icon}</span>
            <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600">
              {topic.title}
            </h3>
            <p className="text-gray-500 text-[11px]">{topic.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Need more help?</h2>
        <p className="text-gray-600">
          Our automated Assistant and customer support team are available 24/7. Click the chat button on the bottom-right corner of your screen to start a live support session.
        </p>
      </div>
    </div>
  );
}
