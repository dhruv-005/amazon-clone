export const generateProductTags = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  const stopwords = new Set(['the', 'and', 'with', 'for', 'this', 'that', 'from', 'your']);

  const words = text
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopwords.has(word));

  const freq = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map((entry) => entry[0]);
};

export const analyzeSentiment = (commentText) => {
  const positive = ['great', 'excellent', 'amazing', 'perfect', 'love', 'best', 'good', 'awesome'];
  const negative = ['bad', 'worst', 'horrible', 'broken', 'poor', 'slow', 'waste', 'fake'];

  const lower = commentText.toLowerCase();
  let score = 0;

  positive.forEach((word) => { if (lower.includes(word)) score += 1; });
  negative.forEach((word) => { if (lower.includes(word)) score -= 1; });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
};

export default {
  generateProductTags,
  analyzeSentiment,
};
