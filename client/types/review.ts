export interface ReviewImage {
  url: string;
  publicId?: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title?: string;
  comment: string;
  images: ReviewImage[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  totalVotes: number;
  sellerResponse?: {
    comment: string;
    respondedAt: string;
  };
  isApproved: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}
