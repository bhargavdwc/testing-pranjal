import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { safeCompare } from '../utils/security.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Rate limit blog admin login attempts (10 attempts per 15 minutes)
const blogLoginLimiter = createRateLimiter({ maxRequests: 10, windowMs: 15 * 60 * 1000 });

const BLOG_ADMIN_USERNAME = process.env.BLOG_ADMIN_USERNAME;
const BLOG_ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD;

/**
 * POST /api/blog-auth/login
 * Simple username + password login for the Blog Admin panel.
 * Issues a short-lived JWT with audience 'blog-admin-panel'.
 */
router.post('/login', blogLoginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const cleanUsername = String(username).trim();
  const cleanPassword = String(password);

  if (cleanUsername.length > 50 || cleanPassword.length > 100) {
    return res.status(400).json({ success: false, message: 'Invalid credentials format or length exceeded.' });
  }

  try {
    const usernameMatch = safeCompare(username, BLOG_ADMIN_USERNAME || '');
    const passwordMatch = safeCompare(password, BLOG_ADMIN_PASSWORD || '');

    if (!usernameMatch || !passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { role: 'blog_admin', username: BLOG_ADMIN_USERNAME },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
        issuer: 'pranjalsarkar-crm',
        audience: 'blog-admin-panel',
      }
    );

    logger.info('Blog admin login successful');
    return res.json({ success: true, token });
  } catch (err) {
    logger.error('Blog auth login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * POST /api/blog-auth/logout
 * Stateless — client discards the token.
 */
router.post('/logout', (_req, res) => {
  return res.json({ success: true, message: 'Logged out.' });
});

/**
 * GET /api/blog-auth/verify
 * Verify token validity (used for session polling).
 */
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'pranjalsarkar-crm',
      audience: 'blog-admin-panel',
    });
    return res.json({ success: true });
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
});

export default router;
