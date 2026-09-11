import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Loader2,
  Clock,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { BlogFormData } from "../types";
import { uploadBlogImage } from "../blogApiClient";
import { formatToLocalDatetimeInput, getNextMinuteLocalDatetime } from "../dateUtils";
import RichTextEditor from "./RichTextEditor";

interface BlogFormModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  form: BlogFormData;
  isSaving: boolean;
  onClose: () => void;
  onChange: (field: keyof BlogFormData, value: string) => void;
  onSave: () => void;
}

type TabType = "info" | "content" | "meta";

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const Field: React.FC<{
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, htmlFor, hint, required, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10.5px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = "w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-sm text-slate-900 text-sm font-medium focus:border-blue-500 focus:bg-white outline-none transition-colors";
const textareaCls = `${inputCls} resize-y`;

export const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen, isEditMode, form, isSaving, onClose, onChange, onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const featureFileInputRef = useRef<HTMLInputElement>(null);

  const handleFeatureImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG, AVIF).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size exceeds 10MB limit.");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);
    try {
      const data = await uploadBlogImage(file, "pranjal-blogs");
      onChange("featureImage", data.imageUrl);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Reset to first tab when opened
  useEffect(() => {
    if (isOpen) setActiveTab("info");
  }, [isOpen]);

  // Auto-generate slug from title (only when creating)
  useEffect(() => {
    if (!isEditMode && form.title) {
      onChange("slug", slugify(form.title));
    }
  }, [form.title, isEditMode]);

  // Auto-calculate read time from content
  useEffect(() => {
    if (form.content) {
      const words = form.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.round(words / 200));
      onChange("readTime", `${mins} min read`);
    }
  }, [form.content]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-black text-slate-800">
            {isEditMode ? "Edit Blog Post" : "New Blog Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Matching User Screenshot) */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-white gap-8 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "info"
                ? "border-[#155DFC] text-[#155DFC]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Blog Info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "content"
                ? "border-[#155DFC] text-[#155DFC]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Content
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("meta")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "meta"
                ? "border-[#155DFC] text-[#155DFC]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Meta Tags
          </button>
        </div>

        {/* Tab Body (Only active tab is shown) */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ════════════════════════════════════════════════════════════
              TAB 1: BLOG INFO
             ════════════════════════════════════════════════════════════ */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Blog Title" htmlFor="bf-title" required>
                  <input
                    id="bf-title"
                    type="text"
                    value={form.title}
                    onChange={e => onChange("title", e.target.value)}
                    className={inputCls}
                    placeholder="My Awesome Blog Post"
                  />
                </Field>

                <Field label="URL Slug" htmlFor="bf-slug" hint="Auto-generated from title. Override if needed.">
                  <input
                    id="bf-slug"
                    type="text"
                    value={form.slug}
                    onChange={e => onChange("slug", slugify(e.target.value))}
                    className={`${inputCls} font-mono text-xs`}
                    placeholder="my-awesome-blog-post"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category / Categories" htmlFor="bf-category" hint="Comma-separated tags e.g. Product, AI, Leadership">
                  <input
                    id="bf-category"
                    type="text"
                    value={form.category}
                    onChange={e => onChange("category", e.target.value)}
                    className={inputCls}
                    placeholder="Product, Leadership"
                  />
                </Field>

                <Field label="Read Time" htmlFor="bf-readtime" hint="Auto-calculated from content. Override if needed.">
                  <div className="relative">
                    <input
                      id="bf-readtime"
                      type="text"
                      value={form.readTime}
                      onChange={e => onChange("readTime", e.target.value)}
                      className={`${inputCls} pl-8`}
                      placeholder="5 min read"
                    />
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" htmlFor="bf-date" required>
                  <input
                    id="bf-date"
                    type="date"
                    value={form.date}
                    onChange={e => onChange("date", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="Status" htmlFor="bf-status">
                  <select
                    id="bf-status"
                    value={form.status}
                    onChange={e => {
                      const newStatus = e.target.value as "draft" | "published" | "scheduled";
                      onChange("status", newStatus);
                      if (newStatus === "scheduled") {
                        onChange("scheduledAt", getNextMinuteLocalDatetime(form.scheduledAt));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-sm border text-sm font-bold outline-none cursor-pointer transition-colors ${
                      form.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : form.status === "scheduled"
                        ? "bg-violet-50 text-violet-700 border-violet-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    <option value="draft">DRAFT</option>
                    <option value="published">PUBLISHED</option>
                    <option value="scheduled">SCHEDULED</option>
                  </select>
                </Field>
              </div>

              {form.status === "scheduled" && (
                <div className="p-4 rounded-sm bg-violet-50/70 border border-violet-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Field
                    label="Publication Date & Time"
                    htmlFor="bf-scheduled-at"
                    required
                    hint="Choose exact date and time in your local timezone."
                  >
                    <div className="relative">
                      <input
                        id="bf-scheduled-at"
                        type="datetime-local"
                        value={form.scheduledAt ? form.scheduledAt.slice(0, 16) : ""}
                        min={formatToLocalDatetimeInput(new Date(Date.now() - 60 * 1000))}
                        onChange={e => onChange("scheduledAt", e.target.value)}
                        className={`${inputCls} bg-white border-violet-300 focus:border-violet-600 font-semibold`}
                        required
                      />
                    </div>
                  </Field>
                </div>
              )}

              <Field label="Excerpt" htmlFor="bf-excerpt" hint="Short summary shown in blog listings. Max 500 chars.">
                <textarea
                  id="bf-excerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={e => onChange("excerpt", e.target.value)}
                  className={textareaCls}
                  placeholder="A brief, high-signal summary of this post..."
                  maxLength={500}
                />
                <p className="text-[10.5px] text-slate-400 text-right mt-1">{form.excerpt.length}/500</p>
              </Field>

              <Field
                label="Feature Image"
                htmlFor="bf-image-file"
                hint="Upload an image from your device (PNG, JPG, WEBP, GIF, SVG up to 10MB)."
              >
                <input
                  ref={featureFileInputRef}
                  id="bf-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFeatureImageUpload(file);
                    e.target.value = "";
                  }}
                />

                {!form.featureImage ? (
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFeatureImageUpload(file);
                    }}
                    onClick={() => featureFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#155DFC] bg-[#155DFC]/5"
                        : "border-slate-300 hover:border-[#155DFC] bg-slate-50/60 hover:bg-slate-50"
                    }`}
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Loader2 className="w-8 h-8 text-[#155DFC] animate-spin mb-2" />
                        <p className="text-sm font-bold text-slate-700">Uploading image...</p>
                        <p className="text-xs text-slate-400 mt-1">Please wait while your image is being processed</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#155DFC]/10 text-[#155DFC] flex items-center justify-center mb-3">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          Click to upload from device <span className="text-slate-500 font-normal">or drag & drop</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Supports PNG, JPG, WEBP, GIF, SVG up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50 space-y-3">
                    <div className="relative rounded-sm overflow-hidden border border-slate-200 bg-slate-900/5 aspect-16/9 max-h-48 group">
                      <img
                        src={form.featureImage}
                        alt="Feature preview"
                        className="w-full h-full object-cover"
                      />
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                          <div className="flex items-center gap-2 text-sm font-bold text-[#155DFC]">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Updating image...
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Image Ready
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => featureFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-sm text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Change Image
                        </button>
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => onChange("featureImage", "")}
                          className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-sm text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uploadError}
                  </p>
                )}
              </Field>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 2: CONTENT
             ════════════════════════════════════════════════════════════ */}
          {activeTab === "content" && (
            <div className="flex flex-col flex-1 h-full min-h-[360px]">
              <RichTextEditor
                label="Content"
                value={form.content}
                onChange={val => onChange("content", val)}
                placeholder="Write your article content here..."
                onUploadImage={async (file: File) => {
                  const data = await uploadBlogImage(file, "pranjal-blogs");
                  return data.imageUrl;
                }}
              />
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TAB 3: META TAGS
             ════════════════════════════════════════════════════════════ */}
          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Meta Title" htmlFor="bf-metatitle" hint="Recommended max 70 chars.">
                  <input
                    id="bf-metatitle"
                    type="text"
                    value={form.metaTitle}
                    onChange={e => onChange("metaTitle", e.target.value)}
                    className={inputCls}
                    placeholder="SEO-optimised title for Google"
                    maxLength={70}
                  />
                  <p className="text-[10.5px] text-slate-400 text-right mt-1">{form.metaTitle.length}/70</p>
                </Field>

                <Field label="Canonical URL" htmlFor="bf-canonical" hint="Preferred URL for indexing">
                  <input
                    id="bf-canonical"
                    type="url"
                    value={form.canonicalUrl}
                    onChange={e => onChange("canonicalUrl", e.target.value)}
                    className={inputCls}
                    placeholder="https://productleadership.studio/blog/my-post"
                  />
                </Field>
              </div>

              <Field label="Keywords" htmlFor="bf-keywords" hint="Comma-separated focus keywords.">
                <input
                  id="bf-keywords"
                  type="text"
                  value={form.keywords}
                  onChange={e => onChange("keywords", e.target.value)}
                  className={inputCls}
                  placeholder="product management, AI, leadership"
                />
              </Field>

              <Field label="Meta Description" htmlFor="bf-metadesc" hint="Recommended max 160 chars.">
                <textarea
                  id="bf-metadesc"
                  rows={3}
                  value={form.metaDescription}
                  onChange={e => onChange("metaDescription", e.target.value)}
                  className={textareaCls}
                  placeholder="Compelling description for search engine snippets..."
                  maxLength={160}
                />
                <p className="text-[10.5px] text-slate-400 text-right mt-1">{form.metaDescription.length}/160</p>
              </Field>

              <Field label="Schema (JSON-LD)" htmlFor="bf-schema" hint="Raw JSON-LD structured data. Injected into page head.">
                <textarea
                  id="bf-schema"
                  rows={5}
                  value={form.schema}
                  onChange={e => onChange("schema", e.target.value)}
                  className={`${textareaCls} font-mono text-xs`}
                  placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "..."\n}'}
                />
              </Field>

              <Field label="Long Content (Hidden Text)" htmlFor="bf-longcontent" hint="SEO-only supplementary text for screen readers & search indexing.">
                <textarea
                  id="bf-longcontent"
                  rows={4}
                  value={form.longContent}
                  onChange={e => onChange("longContent", e.target.value)}
                  className={textareaCls}
                  placeholder="Additional SEO content, keyword variations, FAQs..."
                />
              </Field>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-200 rounded-sm hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {activeTab !== "meta" && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "info" ? "content" : "meta")}
                className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Next →
              </button>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || !form.title}
              className="px-6 py-2.5 bg-[#155DFC] hover:bg-[#1048c7] text-white text-sm font-bold rounded-sm shadow-md shadow-[#155DFC]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isSaving ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
