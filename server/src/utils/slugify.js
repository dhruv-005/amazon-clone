// ============================================
// URL SLUG GENERATION UTILITIES
// ============================================

/**
 * Generate URL-friendly slug from string
 * @param {string} text - Text to slugify
 * @returns {string} URL slug
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple hyphens
    .replace(/^-+/, '')             // Trim leading hyphens
    .replace(/-+$/, '')             // Trim trailing hyphens
    .substring(0, 100);             // Limit length
};

/**
 * Generate unique slug by appending random suffix
 * @param {string} text - Text to slugify
 * @param {number} suffixLength - Random suffix length
 * @returns {string} Unique slug
 */
export const generateUniqueSlug = (text, suffixLength = 4) => {
  const baseSlug = slugify(text);
  const suffix = Math.random().toString(36).substring(2, 2 + suffixLength);
  return `${baseSlug}-${suffix}`;
};

/**
 * Generate product slug with ID
 * @param {string} title - Product title
 * @param {string} id - Product ID
 * @returns {string} Product slug
 */
export const generateProductSlug = (title, id) => {
  const baseSlug = slugify(title);
  const shortId = id.toString().slice(-6);
  return `${baseSlug}-${shortId}`;
};

/**
 * Generate category slug
 * @param {string} name - Category name
 * @param {string} parentSlug - Parent category slug (optional)
 * @returns {string} Category slug
 */
export const generateCategorySlug = (name, parentSlug = null) => {
  const baseSlug = slugify(name);
  if (parentSlug) {
    return `${parentSlug}/${baseSlug}`;
  }
  return baseSlug;
};

/**
 * Generate brand slug
 * @param {string} brandName - Brand name
 * @returns {string} Brand slug
 */
export const generateBrandSlug = (brandName) => {
  return slugify(brandName);
};

/**
 * Check if slug is valid
 * @param {string} slug - Slug to validate
 * @returns {boolean}
 */
export const isValidSlug = (slug) => {
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
  return regex.test(slug);
};

/**
 * Decode slug back to readable text
 * @param {string} slug - URL slug
 * @returns {string} Readable text
 */
export const deslugify = (slug) => {
  if (!slug) return '';
  return slug
    .replace(/-/g, ' ')
    .replace(/\//g, ' > ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default {
  slugify,
  generateUniqueSlug,
  generateProductSlug,
  generateCategorySlug,
  generateBrandSlug,
  isValidSlug,
  deslugify,
};
