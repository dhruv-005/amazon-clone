// ============================================
// PRICE & TAX CALCULATION UTILITIES
// ============================================

/**
 * Calculate discount percentage
 * @param {number} originalPrice
 * @param {number} currentPrice
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (currentPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Calculate price after discount
 * @param {number} originalPrice
 * @param {number} discountPercent
 * @returns {number} Discounted price
 */
export const applyDiscount = (originalPrice, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return originalPrice;
  const discounted = originalPrice * (1 - discountPercent / 100);
  return Math.round(discounted * 100) / 100;
};

/**
 * Calculate GST amount
 * @param {number} price - Base price
 * @param {number} gstRate - GST rate (5, 12, 18, 28)
 * @returns {object} { cgst, sgst, igst, totalTax, priceWithTax }
 */
export const calculateGST = (price, gstRate = 18) => {
  const totalTax = Math.round((price * gstRate / 100) * 100) / 100;

  return {
    cgst: Math.round((totalTax / 2) * 100) / 100,
    sgst: Math.round((totalTax / 2) * 100) / 100,
    igst: totalTax,
    totalTax,
    gstRate,
    priceWithTax: Math.round((price + totalTax) * 100) / 100,
  };
};

/**
 * Extract base price from GST-inclusive price
 * @param {number} inclusivePrice - Price including GST
 * @param {number} gstRate - GST rate
 * @returns {object} { basePrice, taxAmount }
 */
export const extractBasePrice = (inclusivePrice, gstRate = 18) => {
  const basePrice = Math.round((inclusivePrice / (1 + gstRate / 100)) * 100) / 100;
  const taxAmount = Math.round((inclusivePrice - basePrice) * 100) / 100;

  return { basePrice, taxAmount, gstRate };
};

/**
 * Calculate shipping cost
 * @param {number} orderTotal - Order subtotal
 * @param {boolean} isPrime - Prime member
 * @param {number} weight - Package weight in kg
 * @returns {object} { shippingCost, isFree, estimatedDays }
 */
export const calculateShipping = (orderTotal, isPrime = false, weight = 0.5) => {
  const FREE_SHIPPING_THRESHOLD = 499;
  const BASE_SHIPPING_COST = 40;
  const EXTRA_WEIGHT_COST = 20; // per kg above 1kg

  let shippingCost = 0;
  let isFree = false;

  if (isPrime) {
    shippingCost = 0;
    isFree = true;
  } else if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    shippingCost = 0;
    isFree = true;
  } else {
    shippingCost = BASE_SHIPPING_COST;
    if (weight > 1) {
      shippingCost += Math.ceil(weight - 1) * EXTRA_WEIGHT_COST;
    }
  }

  const estimatedDays = isPrime ? 1 : (orderTotal >= FREE_SHIPPING_THRESHOLD ? 3 : 5);

  return { shippingCost, isFree, estimatedDays };
};

/**
 * Calculate order totals
 * @param {Array} items - Order items [{ price, quantity, gstRate }]
 * @param {object} options - { couponDiscount, isPrime, shippingCost }
 * @returns {object} Complete pricing breakdown
 */
export const calculateOrderTotals = (items, options = {}) => {
  const {
    couponDiscount = 0,
    isPrime = false,
    couponCode = null,
  } = options;

  // Calculate subtotal and tax
  let subtotal = 0;
  let totalTax = 0;
  let totalSavings = 0;

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const gst = calculateGST(item.price, item.gstRate || 18);
    totalTax += gst.totalTax * item.quantity;

    if (item.originalPrice && item.originalPrice > item.price) {
      totalSavings += (item.originalPrice - item.price) * item.quantity;
    }
  });

  // Calculate shipping
  const shipping = calculateShipping(subtotal, isPrime);

  // Apply coupon
  const finalCouponDiscount = Math.min(couponDiscount, subtotal);

  // Calculate final total
  const total = Math.max(0, subtotal + shipping.shippingCost - finalCouponDiscount);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: shipping.shippingCost,
    isFreeShipping: shipping.isFree,
    tax: Math.round(totalTax * 100) / 100,
    discount: Math.round(totalSavings * 100) / 100,
    couponDiscount: Math.round(finalCouponDiscount * 100) / 100,
    couponCode,
    total: Math.round(total * 100) / 100,
    savings: Math.round((totalSavings + finalCouponDiscount) * 100) / 100,
    estimatedDeliveryDays: shipping.estimatedDays,
  };
};

/**
 * Format price with currency symbol
 * @param {number} amount
 * @param {string} currency
 * @returns {string} Formatted price
 */
export const formatPrice = (amount, currency = 'INR') => {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || '₹';

  return `${symbol}${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculate EMI options
 * @param {number} totalAmount
 * @returns {Array} EMI options
 */
export const calculateEMI = (totalAmount) => {
  if (totalAmount < 1500) return [];

  const interestRates = { 3: 0, 6: 12, 9: 13, 12: 14, 18: 15, 24: 16 };
  const emiOptions = [];

  for (const [months, annualRate] of Object.entries(interestRates)) {
    const monthlyRate = annualRate / 12 / 100;
    let emi;

    if (monthlyRate === 0) {
      emi = totalAmount / parseInt(months);
    } else {
      emi = (totalAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayable = emi * parseInt(months);
    const interest = totalPayable - totalAmount;

    emiOptions.push({
      months: parseInt(months),
      emi: Math.round(emi),
      totalPayable: Math.round(totalPayable),
      interest: Math.round(interest),
      interestRate: annualRate,
      isNoCost: annualRate === 0,
    });
  }

  return emiOptions;
};

/**
 * Calculate seller payout after commission
 * @param {number} salePrice
 * @param {number} commissionRate
 * @param {number} gstRate
 * @returns {object} Payout breakdown
 */
export const calculateSellerPayout = (salePrice, commissionRate = 15, gstRate = 18) => {
  const commission = Math.round((salePrice * commissionRate / 100) * 100) / 100;
  const commissionGST = Math.round((commission * gstRate / 100) * 100) / 100;
  const totalDeduction = commission + commissionGST;
  const payout = Math.round((salePrice - totalDeduction) * 100) / 100;

  return {
    salePrice,
    commission,
    commissionRate,
    commissionGST,
    totalDeduction,
    payout,
  };
};

export default {
  calculateDiscount,
  applyDiscount,
  calculateGST,
  extractBasePrice,
  calculateShipping,
  calculateOrderTotals,
  formatPrice,
  calculateEMI,
  calculateSellerPayout,
};
