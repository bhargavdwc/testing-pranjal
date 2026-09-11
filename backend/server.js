import "dotenv/config";
import "./src/config/env.js";

import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "./src/utils/logger.js";

import { initSentry, Sentry } from "./src/config/sentry.js";
import connectDB from "./src/config/db.js";
import corsmiddlewares from "./src/config/cors.js";

import authRoutes from "./src/routes/auth.js";
import leadRoutes from "./src/routes/leads.js";
import userRoutes from "./src/routes/users.js";
import blogRoutes from "./src/routes/blog.js";
import blogAuthRoutes from "./src/routes/blogAuth.js";

// Initialize Sentry
initSentry();

const app = express();

// ===============================
// middlewaress
// ===============================

app.use(helmet());
app.use(cookieParser());

app.use(corsmiddlewares);

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ===============================
// Database Connection (Atlas test DB)
// ===============================

connectDB();

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/users", userRoutes);

app.use("/api/blog-auth", blogAuthRoutes);

app.use("/api/blog", blogRoutes);

// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
  res.send("CRM API is running.");
});

// ===============================
// 404 Catch-All Handler
// ===============================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// Sentry Error Handler
// ===============================

Sentry.setupExpressErrorHandler(app);

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  logger.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,

    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
