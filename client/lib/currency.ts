export const convertCurrency = (amountInINR: number, targetCurrency: string = 'INR'): string => {
  const rates: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
  };

  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const rate = rates[targetCurrency] || 1;
  const symbol = symbols[targetCurrency] || '₹';
  const converted = amountInINR * rate;

  return `${symbol}${converted.toLocaleString('en-IN', {
    maximumFractionDigits: targetCurrency === 'INR' ? 0 : 2,
  })}`;
};
