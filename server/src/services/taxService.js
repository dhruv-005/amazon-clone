export const calculateGST = (price, rate = 18, isInterState = false) => {
  const taxAmount = (price * rate) / 100;

  if (isInterState) {
    return {
      rate,
      igst: Math.round(taxAmount * 100) / 100,
      cgst: 0,
      sgst: 0,
      totalTax: Math.round(taxAmount * 100) / 100,
    };
  }

  const halfTax = Math.round((taxAmount / 2) * 100) / 100;
  return {
    rate,
    igst: 0,
    cgst: halfTax,
    sgst: halfTax,
    totalTax: Math.round(taxAmount * 100) / 100,
  };
};

export default {
  calculateGST,
};
