export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPrimeOnly?: boolean;
}
