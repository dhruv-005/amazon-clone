export const seedBanners = (adminId) => [
  {
    title: 'Great Republic Festival Deals',
    subtitle: 'Up to 75% off on Electronics, Laptops & Home Appliances',
    description: 'Shop with SBI Credit Card for an extra 10% instant discount',
    image: {
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
      alt: 'Republic Day Sale Banner',
    },
    link: '/deals',
    linkType: 'deal',
    position: 'hero',
    order: 1,
    isActive: true,
    backgroundColor: '#131921',
    textColor: '#ffffff',
    createdBy: adminId,
  },
  {
    title: 'Upgrade to iPhone 15 Today',
    subtitle: 'Starting from ₹71,290 with No Cost EMI up to 12 months',
    image: {
      url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1920&q=80',
      alt: 'iPhone 15 Banner',
    },
    link: '/products/apple-iphone-15-128-gb-black',
    linkType: 'product',
    position: 'hero',
    order: 2,
    isActive: true,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    createdBy: adminId,
  },
  {
    title: 'Top Rated Audio & Headphones',
    subtitle: 'Immerse in pure sound with Sony, boAt, Bose and Sennheiser',
    image: {
      url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1920&q=80',
      alt: 'Audio Headphone Sale',
    },
    link: '/category/electronics',
    linkType: 'category',
    position: 'hero',
    order: 3,
    isActive: true,
    backgroundColor: '#1a1a1a',
    textColor: '#ff9900',
    createdBy: adminId,
  },
];

export default seedBanners;
