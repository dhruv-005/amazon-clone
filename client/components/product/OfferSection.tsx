'use client';

import React from 'react';

export const OfferSection: React.FC = () => {
  const offers = [
    {
      title: 'Bank Offer',
      desc: 'Upto ₹1,500 discount on select Credit Cards',
    },
    {
      title: 'No Cost EMI',
      desc: 'Avail No Cost EMI on select cards for orders above ₹3,000',
    },
    {
      title: 'Cashback',
      desc: 'Get flat ₹50 cashback on your first COD order',
    },
  ];

  return (
    <div className="space-y-2 select-none">
      <h4 className="text-xs font-bold text-gray-900">Offers</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {offers.map((offer, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded p-2.5 bg-gray-50 hover:bg-orange-50/50 hover:border-orange-300 transition text-xs"
          >
            <span className="font-bold text-gray-900 block mb-0.5">{offer.title}</span>
            <p className="text-gray-600 line-clamp-2">{offer.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferSection;
