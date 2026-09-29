export const seedDeals = (products, adminId) => {
  const now = new Date();
  return [
    {
      title: 'Deal of the Day - Audio Special',
      description: 'Heavy discounts on bestselling wireless headphones',
      type: 'daily',
      products: products.slice(2, 4).map((p) => ({
        product: p._id,
        dealPrice: Math.round(p.price.current * 0.88),
        originalPrice: p.price.original,
        maxQuantity: 100,
        claimedQuantity: 42,
      })),
      startDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      isActive: true,
      minDiscount: 20,
      createdBy: adminId,
    },
    {
      title: 'Lightning Deals on Smart Electronics',
      description: 'Limited-time price drops with fast ending countdown',
      type: 'lightning',
      products: products.slice(0, 2).map((p) => ({
        product: p._id,
        dealPrice: Math.round(p.price.current * 0.93),
        originalPrice: p.price.original,
        maxQuantity: 50,
        claimedQuantity: 38,
      })),
      startDate: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      isActive: true,
      minDiscount: 10,
      createdBy: adminId,
    },
  ];
};

export default seedDeals;
