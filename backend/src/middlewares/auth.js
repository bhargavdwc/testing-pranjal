import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import User from '../models/User.js';

dotenv.config();

/**
 * middlewares to verify that the request is authenticated and has admin rights.
 */
export const protectAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'pranjalsarkar-crm',
        audience: 'admin-panel'
      });

      if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only' });
      }

      // Check if user still exists (and is not deleted)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized: User account has been removed' });
      }

      req.admin = decoded;
      return next();
    } catch (error) {
      logger.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized: Token is invalid or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized: No token provided or invalid format' });
};

/**
 * middlewares to verify that the request is authenticated (Admin or Customer).
 */
export const protect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'pranjalsarkar-crm',
        audience: 'admin-panel'
      });

      // Check if user still exists (and is not deleted)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized: User account has been removed' });
      }

      req.user = decoded; // Contains id, email, role
      return next();
    } catch (error) {
      logger.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized: Token is invalid or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized: No token provided or invalid format' });
};

/**
 * middlewares to verify that the request is authenticated and has super_admin rights.
 */
export const protectSuperAdmin = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'pranjalsarkar-crm',
        audience: 'admin-panel'
      });

      if (decoded.role !== 'super_admin') {
        return res.status(403).json({ message: 'Forbidden: Super Admin access only' });
      }

      // Check if user still exists (and is not deleted)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized: User account has been removed' });
      }

      req.admin = decoded;
      return next();
    } catch (error) {
      logger.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized: Token is invalid or expired' });
    }
  }

  return res.status(401).json({ message: 'Not authorized: No token provided or invalid format' });
};

/**
 * Middleware to verify that the request has valid blog admin rights.
 */
export const protectBlogAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized: No token.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'pranjalsarkar-crm',
      audience: 'blog-admin-panel',
    });
    req.blogAdmin = decoded;
    return next();
  } catch (err) {
    logger.error('Blog admin auth error:', err.message);
    return res
      .status(401)
      .json({
        success: false,
        message: 'Not authorized: Token invalid or expired.',
      });
  }
};
