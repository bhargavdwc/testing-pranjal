import crypto from 'crypto';

/**
 * Timing-safe string comparison using SHA-256 hashing.
 * Prevents timing attacks on credential comparisons.
 *
 * Both inputs are hashed to fixed-length digests before comparing,
 * eliminating length-based information leakage.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export const safeCompare = (a, b) => {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

/**
 * Escape special regex characters in a user-supplied string.
 * Prevents ReDoS when constructing RegExp from untrusted input.
 *
 * @param {string} str
 * @returns {string}
 */
export const escapeRegex = (str) => {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * HTML-encode a string to prevent XSS injection in email templates.
 *
 * @param {string} str
 * @returns {string}
 */
export const escapeHtml = (str) => {
  if (str == null) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
};
