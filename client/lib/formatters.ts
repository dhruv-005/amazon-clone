export const formatPrice = (amount: number): string => {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
};

export const formatRating = (rating: number): string => {
  return Number(rating || 0).toFixed(1);
};
