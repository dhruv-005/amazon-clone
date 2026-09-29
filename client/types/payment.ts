export interface PaymentDetails {
  method: 'cod';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway: 'cod';
  amount: number;
  paidAt?: string;
}
