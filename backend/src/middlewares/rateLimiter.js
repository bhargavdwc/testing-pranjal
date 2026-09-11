import { rateLimit } from 'express-rate-limit';

/**
 * Configurable rate limiter middlewares factory using express-rate-limit.
 *
 * @param {Object}  options
 * @param {number}  options.maxRequests - Maximum requests per window (default: 100)
 * @param {number}  options.windowMs    - Window duration in milliseconds (default: 15 minutes)
 * @returns {Function} Express middlewares
 */
export const createRateLimiter = ({ maxRequests = 100, windowMs = 15 * 60 * 1000 } = {}) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// Default rate limiter (100 requests per 15 minutes)
const rateLimiter = createRateLimiter();

// Strict rate limiter for lead submissions (5 requests per hour)
export const submitLeadLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60 * 60 * 1000 });

// Rate limiter for file uploads (30 uploads per 15 minutes)
export const uploadLimiter = createRateLimiter({ maxRequests: 30, windowMs: 15 * 60 * 1000 });

export default rateLimiter;
