import { inventoryQueue } from './queue.js';
import Product from '../models/Product.js';
import notificationService from '../services/notificationService.js';
import logger from '../config/logger.js';

inventoryQueue.process(async (job) => {
  const { productId } = job.data;
  const product = await Product.findById(productId).populate('seller', '_id email name');

  if (!product) return;

  // If stock is below critical threshold (<= 5)
  if (product.stock <= 5 && product.stock > 0) {
    logger.warn(`[InventoryJob] Low stock alert: Product ${product.title} has ${product.stock} left`);
    if (product.seller?._id) {
      await notificationService.sendNotification({
        userId: product.seller._id,
        type: 'system',
        title: 'Low Stock Alert',
        message: `Your product "${product.title}" has only ${product.stock} units remaining in stock.`,
        data: { productId: product._id },
      });
    }
  } else if (product.stock === 0) {
    logger.warn(`[InventoryJob] Out of stock alert: Product ${product.title}`);
    if (product.seller?._id) {
      await notificationService.sendNotification({
        userId: product.seller._id,
        type: 'system',
        title: 'Out of Stock Alert',
        message: `Your product "${product.title}" is now completely OUT OF STOCK.`,
        data: { productId: product._id },
      });
    }
  }
});

export const checkProductStock = (productId) => {
  return inventoryQueue.add({ productId });
};

export default {
  checkProductStock,
};
