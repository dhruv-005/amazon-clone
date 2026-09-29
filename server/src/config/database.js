// ============================================
// MONGODB DATABASE CONNECTION
// ============================================

import mongoose from 'mongoose';
import config from './index.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // These options are no longer needed in Mongoose 7+
      // but kept for backward compatibility awareness
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from DB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to SIGTERM');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
