export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariantOption {
  _id?: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
  images?: string[];
  isAvailable: boolean;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ProductRatings {
  average: number;
  count: number;
  distribution?: RatingDistribution;
}

export interface DealInfo {
  isDeal: boolean;
  dealPrice?: number;
  dealStart?: string;
  dealEnd?: string;
  dealType?: 'lightning' | 'daily' | 'clearance' | 'prime_exclusive' | 'festive';
}

export interface ProductShipping {
  isFreeShipping: boolean;
  shippingCost: number;
  estimatedDays: number;
  isPrimeEligible: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  richDescription?: string;
  bulletPoints: string[];
  brand?: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  brandName?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  seller: {
    _id: string;
    name: string;
    businessName?: string;
    ratings?: { average: number; count: number };
  };
  price: {
    original: number;
    current: number;
    discount: number;
    currency: string;
  };
  variants?: ProductVariant[];
  images: ProductImage[];
  specifications: ProductSpecification[];
  stock: number;
  sku?: string;
  ratings: ProductRatings;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  isApproved: boolean;
  dealInfo?: DealInfo;
  shipping: ProductShipping;
  totalSold: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}
