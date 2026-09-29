// ============================================
// UTILITY LOGGER WRAPPER
// ============================================
// This is a lightweight wrapper around the main Winston logger
// Used in utility files to avoid circular dependencies

import config from '../config/index.js';

/**
 * Log levels with colors for console
 */
const LEVELS = {
  error: { color: '\x1b[31m', label: 'ERROR' },
  warn: { color: '\x1b[33m', label: 'WARN ' },
  info: { color: '\x1b[36m', label: 'INFO ' },
  http: { color: '\x1b[35m', label: 'HTTP ' },
  debug: { color: '\x1b[37m', label: 'DEBUG' },
};

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

/**
 * Format timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Format log message
 */
const formatMessage = (level, message, meta = null) => {
  const { color, label } = LEVELS[level] || LEVELS.info;
  const timestamp = getTimestamp();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';

  return `${DIM}${timestamp}${RESET} ${color}[${label}]${RESET} ${message}${metaStr}`;
};

/**
 * Utility Logger Object
 * Use this in utility files instead of importing the main Winston logger
 */
const utilLogger = {
  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {object} meta - Additional metadata
   */
  error(message, meta = null) {
    console.error(formatMessage('error', message, meta));
    if (meta instanceof Error) {
      console.error(meta.stack);
    }
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {object} meta - Additional metadata
   */
  warn(message, meta = null) {
    console.warn(formatMessage('warn', message, meta));
  },

  /**
   * Log info messages
   * @param {string} message - Info message
   * @param {object} meta - Additional metadata
   */
  info(message, meta = null) {
    console.log(formatMessage('info', message, meta));
  },

  /**
   * Log HTTP request messages
   * @param {string} message - HTTP log message
   * @param {object} meta - Request metadata
   */
  http(message, meta = null) {
    if (config.env !== 'test') {
      console.log(formatMessage('http', message, meta));
    }
  },

  /**
   * Log debug messages (only in development)
   * @param {string} message - Debug message
   * @param {object} meta - Additional metadata
   */
  debug(message, meta = null) {
    if (config.env === 'development') {
      console.log(formatMessage('debug', message, meta));
    }
  },

  /**
   * Log success messages (green)
   * @param {string} message - Success message
   */
  success(message) {
    console.log(`${DIM}${getTimestamp()}${RESET} \x1b[32m[OK   ]${RESET} ${message}`);
  },

  /**
   * Log a divider line
   * @param {string} title - Optional title
   */
  divider(title = '') {
    const line = '═'.repeat(50);
    if (title) {
      console.log(`\n${DIM}${line}${RESET}`);
      console.log(`  \x1b[1m${title}${RESET}`);
      console.log(`${DIM}${line}${RESET}\n`);
    } else {
      console.log(`${DIM}${'─'.repeat(50)}${RESET}`);
    }
  },

  /**
   * Log a table (for debugging data)
   * @param {Array} data - Array of objects
   * @param {string} title - Table title
   */
  table(data, title = 'Data') {
    this.divider(title);
    console.table(data);
  },

  /**
   * Log startup banner
   * @param {object} serverInfo - Server information
   */
  startup(serverInfo = {}) {
    const {
      port = config.port,
      env = config.env,
      dbStatus = 'Unknown',
      redisStatus = 'Unknown',
    } = serverInfo;

    console.log('\n');
    console.log('\x1b[33m╔══════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[33m║\x1b[0m     \x1b[1m🛒 AMAZON CLONE API SERVER\x1b[0m                  \x1b[33m║\x1b[0m');
    console.log('\x1b[33m╠══════════════════════════════════════════════════╣\x1b[0m');
    console.log(`\x1b[33m║\x1b[0m  🌐 Port:      \x1b[36m${String(port).padEnd(33)}\x1b[0m\x1b[33m║\x1b[0m`);
    console.log(`\x1b[33m║\x1b[0m  🏷️  Env:       \x1b[36m${String(env).padEnd(33)}\x1b[0m\x1b[33m║\x1b[0m`);
    console.log(`\x1b[33m║\x1b[0m  🗄️  Database:  \x1b[36m${String(dbStatus).padEnd(33)}\x1b[0m\x1b[33m║\x1b[0m`);
    console.log(`\x1b[33m║\x1b[0m  💾 Redis:      \x1b[36m${String(redisStatus).padEnd(33)}\x1b[0m\x1b[33m║\x1b[0m`);
    console.log(`\x1b[33m║\x1b[0m  🕐 Started:    \x1b[36m${new Date().toLocaleString('en-IN').padEnd(33)}\x1b[0m\x1b[33m║\x1b[0m`);
    console.log('\x1b[33m╚══════════════════════════════════════════════════╝\x1b[0m');
    console.log('\n');
  },

  /**
   * Log API request summary
   * @param {object} req - Express request
   * @param {object} res - Express response
   * @param {number} duration - Request duration in ms
   */
  request(req, res, duration) {
    const status = res.statusCode;
    const statusColor = status >= 500 ? '\x1b[31m'
      : status >= 400 ? '\x1b[33m'
      : status >= 300 ? '\x1b[36m'
      : '\x1b[32m';

    const method = req.method.padEnd(7);
    const url = req.originalUrl.substring(0, 50);
    const durationStr = `${duration}ms`.padStart(7);
    const user = req.user?._id?.toString()?.slice(-6) || 'guest ';

    console.log(
      `${DIM}${getTimestamp()}${RESET} ` +
      `${statusColor}${status}${RESET} ` +
      `\x1b[1m${method}${RESET}` +
      `${url.padEnd(52)} ` +
      `${DIM}${durationStr}${RESET} ` +
      `${DIM}user:${user}${RESET}`
    );
  },

  /**
   * Time an operation
   * @param {string} label - Timer label
   * @returns {Function} Stop function that logs duration
   */
  time(label) {
    const start = process.hrtime.bigint();

    return () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      this.debug(`⏱️  ${label}: ${durationMs.toFixed(2)}ms`);
      return durationMs;
    };
  },
};

export default utilLogger;
