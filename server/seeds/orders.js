export const seedOrders = (users, products) => {
  const customer = users[1];
  const seller = users[3];
  const prod = products[0];

  return [
    {
      orderNumber: 'ORD-20250115-9X7A2B',
      user: customer._id,
      items: [
        {
          product: prod._id,
          seller: seller._id,
          title: prod.title,
          image: prod.images[0].url,
          price: prod.price.current,
          originalPrice: prod.price.original,
          quantity: 1,
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
      shippingAddress: customer.addresses[0],
      payment: {
        method: 'cod',
        transactionId: 'TXN-COD-89172648',
        status: 'completed',
        gateway: 'cod',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      pricing: {
        subtotal: prod.price.current,
        shipping: 0,
        tax: Math.round(prod.price.current * 0.18),
        discount: 0,
        total: prod.price.current,
        savings: prod.price.original - prod.price.current,
      },
      tracking: {
        carrier: 'Amazon Logistics',
        trackingNumber: 'TRK-IN-98127391',
        trackingUrl: 'https://track.amazonclone.com/TRK-IN-98127391',
        updates: [
          { status: 'Delivered', location: 'Bangalore Hub', description: 'Handed directly to resident', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Out for Delivery', location: 'Bellandur Sub-Hub', description: 'Package out with delivery executive', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Dispatched', location: 'Bangalore Fulfillment Centre', description: 'Package left Amazon facility', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ],
      },
      status: 'delivered',
      isPrimeOrder: true,
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];
};

export default seedOrders;
