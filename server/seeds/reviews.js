export const seedReviews = (users, products) => {
  const customer1 = users[1]._id;
  const customer2 = users[2]._id;

  return [
    {
      user: customer1,
      product: products[0]._id,
      rating: 5,
      title: 'Best iPhone yet! Super fast delivery.',
      comment: 'The camera quality is extraordinary, and the Dynamic Island is actually much more useful than I anticipated. Got it within 24 hours thanks to Amazon Prime delivery!',
      isVerifiedPurchase: true,
      helpfulVotes: 48,
      isApproved: true,
    },
    {
      user: customer2,
      product: products[0]._id,
      rating: 4,
      title: 'Great upgrade from iPhone 12',
      comment: 'Battery life easily lasts full day with heavy screen on time. USB-C makes charging convenient while travelling with my laptop charger.',
      isVerifiedPurchase: true,
      helpfulVotes: 12,
      isApproved: true,
    },
    {
      user: customer1,
      product: products[2]._id,
      rating: 5,
      title: 'Unbelievable Noise Cancellation',
      comment: 'I use these during flights and in noisy office spaces. Complete pin-drop silence! Soundstage is warm with punchy bass.',
      isVerifiedPurchase: true,
      helpfulVotes: 32,
      isApproved: true,
    },
    {
      user: customer2,
      product: products[7]._id,
      rating: 5,
      title: 'Life changing book on micro-habits',
      comment: 'If you read only one self-improvement book this year, make it Atomic Habits. The concept of 1% improvement every day is eye opening.',
      isVerifiedPurchase: true,
      helpfulVotes: 95,
      isApproved: true,
    },
  ];
};

export default seedReviews;
