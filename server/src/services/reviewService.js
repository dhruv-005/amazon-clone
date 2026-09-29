import Product from '../models/Product.js';
import Review from '../models/Review.js';

export const recalculateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ]);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalVotes = 0;
  let scoreSum = 0;

  stats.forEach((item) => {
    distribution[item._id] = item.count;
    totalVotes += item.count;
    scoreSum += item._id * item.count;
  });

  const average = totalVotes > 0 ? Math.round((scoreSum / totalVotes) * 10) / 10 : 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: {
      average,
      count: totalVotes,
      distribution,
    },
  });

  return { average, count: totalVotes, distribution };
};

export default {
  recalculateProductRatings,
};
