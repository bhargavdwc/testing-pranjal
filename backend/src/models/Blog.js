import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: { type: [String], default: [] },
    readTime: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
      default: "",
    },
    featureImage: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
      default: "",
    },
    canonicalUrl: { type: String, trim: true, default: "" },
    keywords: { type: [String], default: [] },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
      default: "",
    },
    schemaMarkup: { type: String, default: "" },
    longContent: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    scheduledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.schema = ret.schemaMarkup;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.schema = ret.schemaMarkup;
        return ret;
      },
    },
  },
);

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ status: 1, date: -1 });
blogSchema.index({ status: 1, scheduledAt: 1 });
blogSchema.index({ title: "text", excerpt: "text" });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
