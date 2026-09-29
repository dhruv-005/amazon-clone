export interface Notification {
  _id: string;
  user: string;
  type:
    | 'order_placed'
    | 'order_shipped'
    | 'order_delivered'
    | 'order_cancelled'
    | 'deal_alert'
    | 'price_drop'
    | 'system';
  title: string;
  message: string;
  data?: {
    orderId?: string;
    productId?: string;
    link?: string;
  };
  isRead: boolean;
  createdAt: string;
}
