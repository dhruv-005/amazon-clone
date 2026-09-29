import { SHIPPING_CARRIERS } from '../config/constants.js';

export const calculateShippingFee = (subtotal, isPrime = false, weightKg = 0.5) => {
  if (isPrime) return 0;
  if (subtotal >= 499) return 0;

  const baseRate = 40;
  const extraWeightFee = weightKg > 1 ? Math.ceil(weightKg - 1) * 20 : 0;
  return baseRate + extraWeightFee;
};

export const generateTrackingDetails = (carrier = SHIPPING_CARRIERS.AMAZON_LOGISTICS) => {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  const trackingNumber = `TRK-${rand}`;

  return {
    carrier,
    trackingNumber,
    trackingUrl: `https://track.amazonclone.com/${trackingNumber}`,
    updates: [
      {
        status: 'Package Received',
        location: 'Hub - Bangalore',
        description: 'Carrier has picked up package',
        timestamp: new Date(),
      },
    ],
  };
};

export default {
  calculateShippingFee,
  generateTrackingDetails,
};
