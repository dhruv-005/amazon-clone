import Coupon from '../models/Coupon.js';

export const validateAndApplyCoupon = async (code, subtotal, userId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) throw new Error('Invalid coupon code');
  if (!coupon.isValid) throw new Error('Coupon has expired or reached usage limits');

  if (subtotal < coupon.minPurchase) {
    throw new Error(`Minimum purchase of ₹${coupon.minPurchase} required`);
  }

  if (coupon.usedBy && userId) {
    const userUsage = coupon.usedBy.filter((u) => u.user?.toString() === userId.toString()).length;
    if (userUsage >= coupon.perUserLimit) {
      throw new Error(`You have already used this coupon maximum allowed times (${coupon.perUserLimit})`);
    }
  }

  const discountAmount = coupon.applyCoupon(subtotal);

  return {
    code: coupon.code,
    discount: discountAmount,
    type: coupon.type,
    finalTotal: Math.max(0, subtotal - discountAmount),
  };
};

export default {
  validateAndApplyCoupon,
};
