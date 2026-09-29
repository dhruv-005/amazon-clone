// ============================================
// ASYNC ERROR HANDLER WRAPPER
// ============================================

/**
 * Wraps async route handlers to catch errors automatically
 * Eliminates the need for try-catch in every controller
 *
 * Usage:
 *   router.get('/products', asyncHandler(async (req, res) => {
 *     const products = await Product.find();
 *     res.json(products);
 *   }));
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

/**
 * Alternative: Higher-order function for multiple handlers
 * Usage: router.get('/', ...handleAsync([middleware1, middleware2, controller]))
 */
export const handleAsync = (handlers) => {
  return handlers.map((handler) => asyncHandler(handler));
};

/**
 * Retry wrapper for unreliable operations
 * Usage: const result = await retry(() => fetchExternalAPI(), 3, 1000)
 *
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Result of the function
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Attempt ${attempt} failed. Retrying in ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

/**
 * Timeout wrapper
 * Usage: const result = await withTimeout(fetchData(), 5000)
 *
 * @param {Promise} promise - Promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Timeout error message
 * @returns {Promise}
 */
export const withTimeout = (promise, ms = 10000, message = 'Operation timed out') => {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

/**
 * Safe execution - returns null instead of throwing
 * Usage: const user = await safeExecute(User.findById(id))
 */
export const safeExecute = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    console.error('Safe execute error:', error.message);
    return null;
  }
};

export default asyncHandler;
