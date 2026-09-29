export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export const formatDateFull = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getEstimatedDeliveryDate = (days = 2): string => {
  const target = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return target.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};
