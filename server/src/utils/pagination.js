// ============================================
// PAGINATION HELPER FUNCTIONS
// ============================================

import { PAGINATION } from '../config/constants.js';

/**
 * Parse pagination parameters from query string
 * @param {object} query - Express req.query object
 * @returns {object} { page, limit, skip }
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build pagination metadata object
 * @param {number} total - Total document count
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
    firstPage: 1,
    lastPage: totalPages || 1,
    startItem: total === 0 ? 0 : (page - 1) * limit + 1,
    endItem: Math.min(page * limit, total),
  };
};

/**
 * Get paginated results from any Mongoose model
 * @param {object} model - Mongoose model
 * @param {object} filter - MongoDB query filter
 * @param {object} options - Pagination & query options
 * @returns {Promise<object>} { data, pagination }
 */
export const getPaginatedResults = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort = { createdAt: -1 },
    populate = null,
    select = null,
    lean = true,
  } = options;

  const skip = (page - 1) * limit;

  // Build base query
  let query = model.find(filter);

  // Apply select (field projection)
  if (select) {
    query = query.select(select);
  }

  // Apply populate (joins)
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => {
        query = query.populate(p);
      });
    } else if (typeof populate === 'string') {
      query = query.populate(populate);
    } else {
      query = query.populate(populate);
    }
  }

  // Apply lean for better performance
  if (lean) {
    query = query.lean();
  }

  // Execute data query and count query in parallel
  const [data, total] = await Promise.all([
    query.sort(sort).skip(skip).limit(limit).exec(),
    model.countDocuments(filter).exec(),
  ]);

  // Build pagination metadata
  const pagination = buildPaginationMeta(total, page, limit);

  return { data, pagination };
};

/**
 * Cursor-based pagination (for infinite scroll)
 * @param {object} model - Mongoose model
 * @param {object} filter - MongoDB query filter
 * @param {object} options - { cursor, limit, sortField, sortDirection }
 * @returns {Promise<object>} { data, nextCursor, hasMore }
 */
export const getCursorPaginatedResults = async (model, filter = {}, options = {}) => {
  const {
    cursor = null,
    limit = PAGINATION.DEFAULT_LIMIT,
    sortField = 'createdAt',
    sortDirection = -1,
    select = null,
    populate = null,
  } = options;

  // Build filter with cursor
  const cursorFilter = { ...filter };
  if (cursor) {
    const sortOperator = sortDirection === -1 ? '$lt' : '$gt';
    cursorFilter[sortField] = { [sortOperator]: new Date(cursor) };
  }

  // Build query
  let query = model.find(cursorFilter);

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);

  // Fetch one extra item to determine if there are more results
  const data = await query
    .sort({ [sortField]: sortDirection })
    .limit(limit + 1)
    .lean()
    .exec();

  // Check if there are more results
  const hasMore = data.length > limit;

  // Remove the extra item
  if (hasMore) {
    data.pop();
  }

  // Get next cursor from the last item
  const nextCursor = hasMore && data.length > 0
    ? data[data.length - 1][sortField]
    : null;

  return {
    data,
    nextCursor,
    hasMore,
    limit,
  };
};

/**
 * Aggregate pagination (for complex queries with $group, $lookup, etc.)
 * @param {object} model - Mongoose model
 * @param {Array} pipeline - Aggregation pipeline stages
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Promise<object>} { data, pagination }
 */
export const getAggregatedPaginatedResults = async (model, pipeline = [], page = 1, limit = PAGINATION.DEFAULT_LIMIT) => {
  const skip = (page - 1) * limit;

  // Clone pipeline for count query
  const countPipeline = [
    ...pipeline,
    { $count: 'total' },
  ];

  // Add pagination stages to data pipeline
  const dataPipeline = [
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ];

  // Execute both in parallel
  const [dataResult, countResult] = await Promise.all([
    model.aggregate(dataPipeline).exec(),
    model.aggregate(countPipeline).exec(),
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;
  const pagination = buildPaginationMeta(total, page, limit);

  return { data: dataResult, pagination };
};

/**
 * Search pagination with text score sorting
 * @param {object} model - Mongoose model
 * @param {string} searchTerm - Search query string
 * @param {object} additionalFilter - Additional MongoDB filters
 * @param {object} options - { page, limit, populate, select }
 * @returns {Promise<object>} { data, pagination }
 */
export const getSearchPaginatedResults = async (model, searchTerm, additionalFilter = {}, options = {}) => {
  const {
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT,
    populate = null,
    select = null,
  } = options;

  const skip = (page - 1) * limit;

  // Build text search filter
  const filter = {
    ...additionalFilter,
    $text: { $search: searchTerm },
  };

  let query = model.find(filter, { score: { $meta: 'textScore' } });

  if (select) query = query.select(select);
  if (populate) query = query.populate(populate);

  const [data, total] = await Promise.all([
    query
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    model.countDocuments(filter).exec(),
  ]);

  const pagination = buildPaginationMeta(total, page, limit);

  return { data, pagination };
};

/**
 * Generate page numbers array for UI pagination
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @param {number} delta - Number of pages to show around current
 * @returns {Array} Array of page numbers and ellipsis
 */
export const generatePageNumbers = (currentPage, totalPages, delta = 2) => {
  const pages = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  // Always show first page
  pages.push(1);

  // Add ellipsis if needed
  if (left > 2) {
    pages.push('...');
  }

  // Add pages around current
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed
  if (right < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page (if more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

/**
 * Offset-based pagination helper for SQL-like queries
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} { offset, limit }
 */
export const getOffsetLimit = (page = 1, limit = PAGINATION.DEFAULT_LIMIT) => {
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit) || PAGINATION.DEFAULT_LIMIT));
  const offset = (safePage - 1) * safeLimit;

  return { offset, limit: safeLimit };
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} { isValid, errors }
 */
export const validatePagination = (page, limit) => {
  const errors = [];

  if (page !== undefined && (isNaN(page) || page < 1)) {
    errors.push('Page must be a positive integer');
  }

  if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > PAGINATION.MAX_LIMIT)) {
    errors.push(`Limit must be between 1 and ${PAGINATION.MAX_LIMIT}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  parsePagination,
  buildPaginationMeta,
  getPaginatedResults,
  getCursorPaginatedResults,
  getAggregatedPaginatedResults,
  getSearchPaginatedResults,
  generatePageNumbers,
  getOffsetLimit,
  validatePagination,
};
