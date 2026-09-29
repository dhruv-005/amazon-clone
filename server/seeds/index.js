import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import config from '../src/config/index.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Brand from '../src/models/Brand.js';
import Product from '../src/models/Product.js';
import Coupon from '../src/models/Coupon.js';
import Banner from '../src/models/Banner.js';
import Deal from '../src/models/Deal.js';
import Review from '../src/models/Review.js';
import Order from '../src/models/Order.js';
import Setting from '../src/models/Setting.js';

import seedUsers from './users.js';
import seedCategories from './categories.js';
import seedBrands from './brands.js';
import generateProducts from './products.js';
import seedCoupons from './coupons.js';
import seedBanners from './banners.js';
import seedDeals from './deals.js';
import seedReviews from './reviews.js';
import seedOrders from './orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const runSeeder = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Database...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('🧹 Purging existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
      Deal.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log('✅ Database cleaned!');

    // 1. Seed Default Settings
    console.log('⚙️ Seeding default platform settings...');
    await Setting.seedDefaults();

    // 2. Seed Users
    console.log('👤 Seeding users & sellers...');
    const usersData = await seedUsers();
    const createdUsers = await User.insertMany(usersData);
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const sellerUser = createdUsers.find((u) => u.role === 'seller');

    // 3. Seed Categories
    console.log('📁 Seeding product categories...');
    const createdCategories = await Category.insertMany(seedCategories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // 4. Seed Brands
    console.log('🏷️ Seeding brands...');
    const createdBrands = await Brand.insertMany(seedBrands);
    const brandMap = {};
    createdBrands.forEach((b) => {
      brandMap[b.name] = b._id;
    });

    // 5. Seed Products
    console.log('📦 Seeding products with full catalogs...');
    const productsData = generateProducts(categoryMap, brandMap, sellerUser._id);
    const createdProducts = await Product.insertMany(productsData);

    // 6. Seed Coupons
    console.log('🎟️ Seeding discount promo coupons...');
    await Coupon.insertMany(seedCoupons(adminUser._id));

    // 7. Seed Banners
    console.log('🖼️ Seeding promotional hero banners...');
    await Banner.insertMany(seedBanners(adminUser._id));

    // 8. Seed Deals
    console.log('⚡ Seeding Lightning & Daily Deals...');
    await Deal.insertMany(seedDeals(createdProducts, adminUser._id));

    // 9. Seed Reviews
    console.log('⭐ Seeding customer reviews & ratings...');
    await Review.insertMany(seedReviews(createdUsers, createdProducts));

    // 10. Seed Orders
    console.log('🚚 Seeding sample historical orders...');
    await Order.insertMany(seedOrders(createdUsers, createdProducts));

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 AMAZON CLONE DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`👤 Users:       ${createdUsers.length}`);
    console.log(`📁 Categories:  ${createdCategories.length}`);
    console.log(`🏷️ Brands:      ${createdBrands.length}`);
    console.log(`📦 Products:    ${createdProducts.length}`);
    console.log('\n🔑 TEST CREDENTIALS:');
    console.log('  Admin:    admin@amazonclone.com     / Password@123');
    console.log('  Customer: customer@amazonclone.com  / Password@123');
    console.log('  Seller:   seller@amazonclone.com    / Password@123');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

runSeeder();
