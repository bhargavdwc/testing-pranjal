import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { protectAdmin } from "../middlewares/auth.js";
import { createRateLimiter } from "../middlewares/rateLimiter.js";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import logger from "../utils/logger.js";
import { safeCompare } from "../utils/security.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// Strict rate limit for OTP requests and verification
const loginLimiter = createRateLimiter({
  maxRequests: 50,
  windowMs: 15 * 60 * 1000,
});

// Rate limit for token refresh (30 requests per 15 minutes)
const refreshLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 15 * 60 * 1000,
});

const router = express.Router();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
    issuer: "pranjalsarkar-crm",
    audience: "admin-panel",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
    issuer: "pranjalsarkar-crm",
    audience: "admin-panel",
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email
 * @access  Public
 */
router.post(
  "/send-otp",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const inputEmail = (email || "").toLowerCase().trim();

    if (!inputEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (inputEmail.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Email must not exceed 100 characters." });
    }

    let user = await User.findOne({ email: inputEmail });

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Access denied. Email not registered.",
        });
    }

    // Check if account is locked due to too many failed OTP attempts
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.otpLockedUntil.getTime() - Date.now()) / (60 * 1000),
      );
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked due to too many failed attempts. Please try again in ${minutesLeft} minute(s).`,
      });
    }

    // Generate and save OTP, reset lock
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    user.failedOtpAttempts = 0;
    user.otpLockedUntil = null;
    await user.save();

    // Send email
    const emailSent = await sendOtpEmail(user.email, otp);
    if (!emailSent) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP email." });
    }

    return res.json({ success: true, message: "OTP sent successfully." });
  }),
);

/**
 * @route   POST /api/auth/direct-login
 * @desc    Direct login without OTP for a specific whitelisted email
 * @access  Public
 */
router.post(
  "/direct-login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const inputEmail = (email || "").toLowerCase().trim();

    if (!inputEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (inputEmail.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Email must not exceed 100 characters." });
    }

    const directLoginEmail = (process.env.ADMIN_DIRECT_LOGIN_EMAIL || "")
      .toLowerCase()
      .trim();

    if (!directLoginEmail || inputEmail !== directLoginEmail) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Direct login not allowed for this email.",
        });
    }

    // Verify the email exists in the database or initialize it
    let user = await User.findOne({ email: inputEmail });
    if (!user) {
      user = new User({
        email: inputEmail,
        role: "super_admin",
      });
      await user.save();
    } else if (user.role !== "super_admin") {
      user.role = "super_admin";
      await user.save();
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: "Admin",
        role: user.role,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      },
    });
  }),
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login
 * @access  Public
 */
router.post(
  "/verify-otp",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const inputEmail = (email || "").toLowerCase().trim();
    const inputOtp = (otp || "").toString().trim();

    if (!inputEmail || !inputOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    if (inputEmail.length > 100 || inputOtp.length > 10) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input length." });
    }

    const user = await User.findOne({ email: inputEmail });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    // Check if account is locked
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.otpLockedUntil.getTime() - Date.now()) / (60 * 1000),
      );
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked due to too many failed attempts. Please try again in ${minutesLeft} minute(s).`,
      });
    }

    const isExpired = !user.otpExpiry || user.otpExpiry < new Date();
    const isOtpValid = !isExpired && user.otp && safeCompare(user.otp, otp);

    if (!isOtpValid) {
      user.failedOtpAttempts = (user.failedOtpAttempts || 0) + 1;
      if (user.failedOtpAttempts >= 5) {
        user.otpLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lock
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(429).json({
          success: false,
          message:
            "Too many failed attempts. Account is locked for 15 minutes.",
        });
      }
      await user.save();
      const attemptsLeft = 5 - user.failedOtpAttempts;
      return res.status(401).json({
        success: false,
        message: `Invalid or expired OTP. ${attemptsLeft} attempt(s) remaining.`,
      });
    }

    // Valid OTP, clear OTP and reset failed attempts
    user.otp = null;
    user.otpExpiry = null;
    user.failedOtpAttempts = 0;
    user.otpLockedUntil = null;
    await user.save();

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: "Admin",
        role: user.role,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      },
    });
  }),
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify admin token
 * @access  Private/Admin
 */
router.get("/verify", protectAdmin, (req, res) => {
  res.json({ success: true, message: "Token is valid" });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh",
  refreshLimiter,
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token not found" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET, {
        issuer: "pranjalsarkar-crm",
        audience: "admin-panel",
      });
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid refresh token" });
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });
      // Refresh Token Rotation: issue a new refresh token and persist to database
      const newRefreshToken = generateRefreshToken({ id: user._id });
      user.refreshToken = newRefreshToken;
      await user.save();
      setRefreshTokenCookie(res, newRefreshToken);

      return res.json({ success: true, token });
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }),
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET, {
          ignoreExpiration: true,
          issuer: "pranjalsarkar-crm",
          audience: "admin-panel",
        });
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      } catch (e) {
        logger.error("Error during logout:", e);
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  }),
);

export default router;
