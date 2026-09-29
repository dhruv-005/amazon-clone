import { cleanupQueue } from './queue.js';
import User from '../models/User.js';
import SearchHistory from '../models/SearchHistory.js';
import BrowsingHistory from '../models/BrowsingHistory.js';
import logger from '../config/logger.js';

export const CLEANUP_JOB_TYPES = {
  EXPIRED_OTPS: 'EXPIRED_OTPS',
  OLD_HISTORIES: 'OLD_HISTORIES',
};

cleanupQueue.process(async (job) => {
  const { type } = job.data;
  logger.info(`[CleanupJob] Running system cleanup: ${type}`);

  switch (type) {
    case CLEANUP_JOB_TYPES.EXPIRED_OTPS: {
      const result = await User.updateMany(
        { 'otp.expiresAt': { $lt: new Date() } },
        { $unset: { otp: 1 } }
      );
      logger.info(`[CleanupJob] Cleaned expired OTPs from ${result.modifiedCount} user records`);
      break;
    }

    case CLEANUP_JOB_TYPES.OLD_HISTORIES: {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const [searchRes, browseRes] = await Promise.all([
        SearchHistory.deleteMany({ createdAt: { $lt: ninetyDaysAgo } }),
        BrowsingHistory.deleteMany({ viewedAt: { $lt: ninetyDaysAgo } }),
      ]);
      logger.info(`[CleanupJob] Pruned ${searchRes.deletedCount} searches & ${browseRes.deletedCount} browsing views`);
      break;
    }

    default:
      logger.warn(`[CleanupJob] Unknown cleanup type: ${type}`);
  }
});

/**
 * Triggers a recurring daily cleanup routine
 */
export const runDailySystemCleanup = () => {
  cleanupQueue.add({ type: CLEANUP_JOB_TYPES.EXPIRED_OTPS });
  cleanupQueue.add({ type: CLEANUP_JOB_TYPES.OLD_HISTORIES });
};

export default {
  CLEANUP_JOB_TYPES,
  runDailySystemCleanup,
};
