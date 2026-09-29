import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const reserveInventory = async (items = []) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${item.title || item.product}`);
    }

    product.stock -= item.quantity;
    product.totalSold += item.quantity;
    await product.save();
  }
};

export const releaseInventory = async (items = []) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, totalSold: -item.quantity },
    });
  }
};

export default {
  reserveInventory,
  releaseInventory,
};
