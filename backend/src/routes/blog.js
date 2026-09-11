import express from "express";
import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import logger from "../utils/logger.js";
import { upload } from "../middlewares/upload.js";
import { uploadLimiter } from "../middlewares/rateLimiter.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { protectBlogAdmin } from "../middlewares/auth.js";
import { escapeRegex } from "../utils/security.js";

const router = express.Router();

/** Utility: auto-generate slug from title */
const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Ensure slug is unique — appends -2, -3, etc. if needed */
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 2;
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Blog.findOne(query);
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

// ═══════════════════════════════════════════════════════
// POST /api/blog/upload-image — upload image to Cloudinary
// ═══════════════════════════════════════════════════════
router.post(
  "/upload-image",
  protectBlogAdmin,
  uploadLimiter,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided." });
      }

      const ALLOWED_FOLDERS = ["pranjal-blogs", "pranjal-avatars"];
      const folder = ALLOWED_FOLDERS.includes(req.body.folder) ? req.body.folder : "pranjal-blogs";
      const result = await uploadToCloudinary(req.file.buffer, folder);

      logger.info(`Image uploaded: ${result.secure_url}`);
      return res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    } catch (err) {
      logger.error("Image upload error:", err);
      return res.status(500).json({
        success: false,
        message:
          process.env.NODE_ENV === "production"
            ? "Failed to upload image."
            : err.message || "Failed to upload image.",
      });
    }
  },
);

// ═══════════════════════════════════════════════════════
// AUTOMATIC SCHEDULER — check and publish scheduled blogs
// ═══════════════════════════════════════════════════════
let schedulerPromise = null;

export const checkAndPublishScheduledBlogs = async () => {
  if (mongoose.connection.readyState !== 1) return;
  if (schedulerPromise) {
    return schedulerPromise;
  }
  schedulerPromise = (async () => {
    try {
      const now = new Date();
      const result = await Blog.updateMany(
        {
          status: "scheduled",
          scheduledAt: { $lte: now },
        },
        {
          $set: { status: "published" },
        }
      );

      if (result.modifiedCount > 0) {
        logger.info(`Auto-published ${result.modifiedCount} scheduled blog(s).`);
      }
    } catch (err) {
      logger.error("Error auto-publishing scheduled blogs:", err.message);
    } finally {
      schedulerPromise = null;
    }
  })();

  return schedulerPromise;
};

// Check every 5 seconds for instant publishing background failsafe
setInterval(checkAndPublishScheduledBlogs, 5 * 1000);

// Auto-publish any due scheduled blogs before processing any blog route
router.use(async (_req, _res, next) => {
  try {
    await checkAndPublishScheduledBlogs();
  } catch (err) {
    logger.error("Auto-publish middleware error:", err.message);
  }
  next();
});

/**
 * POST /api/blog/publish-scheduled
 * Explicit trigger from admin client when a scheduled post reaches its due time
 */
router.post("/publish-scheduled", protectBlogAdmin, async (_req, res) => {
  try {
    await checkAndPublishScheduledBlogs();
    return res.json({ success: true, message: "Scheduled blogs checked and published." });
  } catch (err) {
    logger.error("Explicit publish-scheduled error:", err.message);
    return res.status(500).json({ success: false, message: "Error publishing scheduled blogs." });
  }
});

// ═══════════════════════════════════════════════════════
// PUBLIC — GET /api/blog/public   — list published blogs
// No auth required — used by the public /blog page
// ═══════════════════════════════════════════════════════
router.get("/public", async (req, res) => {
  try {
    const rawLimit = parseInt(req.query.limit, 10);
    const limit = isNaN(rawLimit) ? 50 : Math.max(1, Math.min(rawLimit, 100));
    const rawPage = parseInt(req.query.page, 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find({ status: "published" })
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select("-longContent -schemaMarkup"),
      Blog.countDocuments({ status: "published" }),
    ]);
    return res.json({
      success: true,
      blogs,
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error("Public blog list error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════
// PUBLIC — GET /api/blog/public/:slug — single published blog
// No auth required — used by the public /blog/:slug page
// ═══════════════════════════════════════════════════════
router.get("/public/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
    if (!blog)
      return res.status(404).json({ success: false, message: "Blog not found." });
    return res.json({ success: true, blog });
  } catch (err) {
    logger.error("Public blog fetch error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════
// GET  /api/blog          — list all blogs (paginated)
// ═══════════════════════════════════════════════════════
router.get("/", protectBlogAdmin, async (req, res) => {
  try {
    const rawLimit = parseInt(req.query.limit, 10);
    const limit = isNaN(rawLimit) ? 10 : Math.max(1, Math.min(rawLimit, 100));
    const rawPage = parseInt(req.query.page, 10);
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const { search = "", status = "", sortBy = "date", order = "desc" } = req.query;
    const query = {};
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      if (trimmedSearch.includes(" ")) {
        query.$text = { $search: trimmedSearch };
      } else {
        const safeSearch = escapeRegex(trimmedSearch);
        query.title = { $regex: safeSearch, $options: "i" };
      }
    }
    if (status && status !== "All") query.status = status;

    const sortField = sortBy === "date" ? "date" : "createdAt";
    const sortDirection = order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ [sortField]: sortDirection, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content -longContent -schemaMarkup"),
      Blog.countDocuments(query),
    ]);

    return res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    logger.error("Blog list error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════
// GET  /api/blog/stats    — overview counts
// ═══════════════════════════════════════════════════════
router.get("/stats", protectBlogAdmin, async (req, res) => {
  try {
    const [total, published, draft, scheduled] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Blog.countDocuments({ status: "scheduled" }),
    ]);
    return res.json({ success: true, stats: { total, published, draft, scheduled } });
  } catch (err) {
    logger.error("Blog stats error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════
// GET  /api/blog/export-csv — export blogs to CSV
// ═══════════════════════════════════════════════════════
router.get("/export-csv", protectBlogAdmin, async (req, res) => {
  try {
    const { search = "", status = "" } = req.query;
    const query = {};
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      query.title = { $regex: safeSearch, $options: "i" };
    }
    if (status && status !== "All") query.status = status;

    const filename = `blogs_export_${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const csvEscape = (val) => {
      if (val === null || val === undefined) return "";
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ["Title", "Slug", "Status", "Categories", "Read Time", "Published Date", "Published Time", "Scheduled Date", "Scheduled Time"];
    // Prepend UTF-8 BOM (\uFEFF) so Excel opens the file cleanly with proper UTF-8 character encoding
    res.write("\uFEFF" + headers.join(",") + "\r\n");

    const cursor = Blog.find(query).sort({ date: -1, createdAt: -1 }).lean().cursor();

    for await (const blog of cursor) {
      let dateStr = "";
      let timeStr = "";
      const d = blog.date ? new Date(blog.date) : (blog.createdAt ? new Date(blog.createdAt) : null);
      if (d && !isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
        timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
      }

      let schedDate = "";
      let schedTime = "";
      if (blog.scheduledAt) {
        const sd = new Date(blog.scheduledAt);
        if (!isNaN(sd.getTime())) {
          schedDate = sd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
          schedTime = sd.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
        }
      }

      const row = [
        csvEscape(blog.title),
        csvEscape(blog.slug),
        csvEscape((blog.status || "draft").toUpperCase()),
        csvEscape(Array.isArray(blog.category) ? blog.category.join(", ") : (blog.category || "")),
        csvEscape(blog.readTime || ""),
        csvEscape(dateStr),
        csvEscape(timeStr),
        csvEscape(schedDate),
        csvEscape(schedTime),
      ];
      res.write(row.join(",") + "\r\n");
    }

    res.end();  
  } catch (err) {
    logger.error("Blog CSV export error:", err.message);
    return res.status(500).json({ success: false, message: "Export failed." });
  }
});

// ═══════════════════════════════════════════════════════
// GET  /api/blog/:id      — single blog (full)
// ═══════════════════════════════════════════════════════
router.get("/:id", protectBlogAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID format." });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    return res.json({ success: true, blog });
  } catch (err) {
    logger.error("Blog fetch error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ═══════════════════════════════════════════════════════
// POST /api/blog          — create blog
// ═══════════════════════════════════════════════════════
router.post("/", protectBlogAdmin, async (req, res) => {
  try {
    const { title, slug: rawSlug, schema, schemaMarkup, ...rest } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });

    const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
    const slug = await ensureUniqueSlug(baseSlug);

    // If date is today or not set, use current timestamp so both date and createdAt are fresh
    let blogDate = rest.date ? new Date(rest.date) : new Date();
    const now = new Date();
    if (rest.date && typeof rest.date === "string" && rest.date.length === 10) {
      const [y, m, d] = rest.date.split("-").map(Number);
      if (y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate()) {
        blogDate = now;
      }
    }

    let scheduledDate = null;
    let blogStatus = rest.status || "draft";
    if (rest.status === "scheduled" && rest.scheduledAt) {
      scheduledDate = new Date(rest.scheduledAt);
      blogDate = scheduledDate;
      if (scheduledDate <= new Date()) {
        blogStatus = "published";
      }
    }

    const blog = await Blog.create({
      title,
      slug,
      schemaMarkup: schemaMarkup !== undefined ? schemaMarkup : (schema || ""),
      ...rest,
      status: blogStatus,
      scheduledAt: scheduledDate,
      date: blogDate,
    });
    logger.info(`Blog created: ${blog._id}`);
    await checkAndPublishScheduledBlogs();
    return res.status(201).json({ success: true, blog });
  } catch (err) {
    logger.error("Blog create error:", err.message);
    if (err.code === 11000)
      return res
        .status(409)
        .json({ success: false, message: "Slug already exists." });
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Server error."
          : err.message || "Server error.",
    });
  }
});

// ═══════════════════════════════════════════════════════
// PUT  /api/blog/:id      — update blog
// ═══════════════════════════════════════════════════════
router.put("/:id", protectBlogAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID format." });
    }

    const { slug: rawSlug, title, schema, schemaMarkup, ...rest } = req.body;

    const updateData = { ...rest };
    if (title) updateData.title = title;

    if (rawSlug) {
      const baseSlug = slugify(rawSlug);
      updateData.slug = await ensureUniqueSlug(baseSlug, req.params.id);
    }

    if (schema !== undefined || schemaMarkup !== undefined) {
      updateData.schemaMarkup = schemaMarkup !== undefined ? schemaMarkup : (schema || "");
    }

    if (rest.scheduledAt !== undefined) {
      if (rest.scheduledAt) {
        updateData.scheduledAt = new Date(rest.scheduledAt);
        updateData.date = updateData.scheduledAt;
        if (updateData.status === "scheduled" && updateData.scheduledAt <= new Date()) {
          updateData.status = "published";
        }
      } else {
        updateData.scheduledAt = null;
      }
    }

    if (rest.status && rest.status !== "scheduled") {
      updateData.scheduledAt = null;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    logger.info(`Blog updated: ${blog._id}`);
    await checkAndPublishScheduledBlogs();
    return res.json({ success: true, blog });
  } catch (err) {
    logger.error("Blog update error:", err.message);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Server error."
          : err.message || "Server error.",
    });
  }
});

// ═══════════════════════════════════════════════════════
// DELETE /api/blog/:id   — delete blog
// ═══════════════════════════════════════════════════════
router.delete("/:id", protectBlogAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID format." });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    logger.info(`Blog deleted: ${req.params.id}`);
    return res.json({ success: true, message: "Blog deleted." });
  } catch (err) {
    logger.error("Blog delete error:", err.message);
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Server error."
          : err.message || "Server error.",
    });
  }
});

export default router;
