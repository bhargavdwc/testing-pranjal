/**
 * Wraps async route handlers to automatically catch promise rejections
 * and pass them to the global error middlewares via next().
 */
export const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
