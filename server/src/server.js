import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import config from './config/index.js';
import logger from './config/logger.js';
import utilLogger from './utils/logger.js';
import connectDB from './config/database.js';
import connectRedis from './config/redis.js';
import { initSockets } from './sockets/index.js';
import { runDailySystemCleanup } from './jobs/cleanupJob.js';

const startServer = async () => {
  try {
    // 1. Connect MongoDB
    console.log('🔄 Connecting to MongoDB...');
    const mongoConn = await connectDB();
    const dbStatus = mongoConn ? 'Connected' : 'Disconnected';

    // 2. Connect Redis (Optional in local dev, gracefully falls back)
    console.log('🔄 Initializing Redis cache...');
    const redisClient = connectRedis();
    const redisStatus = redisClient ? 'Connected' : 'In-Memory Fallback';

    // 3. Create HTTP Server & Bind Express
    const httpServer = http.createServer(app);

    // 4. Initialize Socket.IO Server
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: [config.clientUrl, 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Attach Socket.IO to Express app for route access
    app.set('io', io);

    // Register WebSocket Handlers
    initSockets(io);

    // 5. Start Listening
    const PORT = config.port;
    httpServer.listen(PORT, () => {
      utilLogger.startup({
        port: PORT,
        env: config.env,
        dbStatus,
        redisStatus,
      });

      // Schedule automated background tasks
      try {
        runDailySystemCleanup();
        logger.info('✅ Background cron & cleanup workers scheduled');
      } catch (err) {
        logger.warn(`Could not schedule background jobs: ${err.message}`);
      }
    });

    // 6. Graceful Shutdown Signals
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      httpServer.close(() => {
        logger.info('HTTP Server closed.');
        process.exit(0);
      });

      // Force close if graceful shutdown takes too long
      setTimeout(() => {
        logger.error('Forcefully terminating process after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // 7. Unhandled Exceptions & Rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection:', { reason, promise });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception thrown:', { message: error.message, stack: error.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error(`❌ Fatal server boot error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

startServer();
