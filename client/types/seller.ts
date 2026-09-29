export interface Seller {
  _id: string;
  user: string;
  businessName: string;
  businessType: string;
  description?: string;
  logo?: string;
  banner?: string;
  ratings: {
    average: number;
    count: number;
  };
  isVerified: boolean;
  isActive: boolean;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
}

export interface SellerDashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue30Days: number;
  sellerRating: number;
  ratingCount: number;
}
