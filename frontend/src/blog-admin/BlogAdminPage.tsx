import React, { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, CheckCircle2, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { blogFetch, getBlogToken, clearBlogToken } from "./blogApiClient";
import type { Blog, BlogStats, BlogFormData } from "./types";
import { EMPTY_FORM } from "./types";
import { BlogLogin } from "./components/BlogLogin";
import { BlogSidebar } from "./components/BlogSidebar";
import { BlogOverviewTab } from "./components/BlogOverviewTab";
import { BlogsTab } from "./components/BlogsTab";
import { BlogFormModal } from "./components/BlogFormModal";
import { BlogLogoutModal } from "./components/BlogLogoutModal";
import { BlogDeleteModal } from "./components/BlogDeleteModal";
import { BlogScheduleModal } from "./components/BlogScheduleModal";
import { parseLocalDatetimeToISO, getNextMinuteLocalDatetime } from "./dateUtils";

type Tab = "overview" | "blogs";
type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

let toastIdSeq = 0;

const BlogAdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getBlogToken());
  const [isDismissBanner, setIsDismissBanner] = useState(false);

  // Layout state
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Data state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters / pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [scheduleModalBlog, setScheduleModalBlog] = useState<Blog | null>(null);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Set to track IDs of posts that have auto-published locally to prevent rapid re-triggering & vibration
  const autoPublishedIdsRef = useRef<Set<string>>(new Set());

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++toastIdSeq;
      setToasts((prev) => [...prev, { message, type, id }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        4000,
      );
    },
    [],
  );

  // Auth-expiry listener
  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(false);
    };
    window.addEventListener("blog-auth-expired", handler);
    return () => window.removeEventListener("blog-auth-expired", handler);
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch, dateSort]);

  // Fetch blogs (supports silent background revalidation without full table refresh or spinner)
  const fetchBlogs = useCallback(async (isSilent = false) => {
    if (!isLoggedIn) return;
    if (!isSilent) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy: "date",
        order: dateSort,
      });
      const queryTrimmed = debouncedSearch.trim();
      if (queryTrimmed) params.set("search", queryTrimmed);
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await blogFetch(`/api/blog?${params}`);
      if (res.ok) {
        const data = await res.json();
        const serverBlogs: Blog[] = data.blogs ?? [];
        setBlogs(serverBlogs.map((sb) => {
          // If already reached scheduled time or was auto-published locally, keep as published
          if (
            sb.status === "scheduled" &&
            sb.scheduledAt &&
            (new Date(sb.scheduledAt).getTime() <= Date.now() || autoPublishedIdsRef.current.has(sb._id))
          ) {
            return { ...sb, status: "published" };
          }
          return sb;
        }));
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotalBlogs(data.pagination?.total ?? 0);
      }
    } catch {
      /* silent */
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [isLoggedIn, currentPage, debouncedSearch, statusFilter, dateSort]);

  const handleToggleDateSort = useCallback(() => {
    setDateSort(prev => (prev === "desc" ? "asc" : "desc"));
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await blogFetch("/api/blog/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch {
      /* silent */
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBlogs();
      fetchStats();
    }
  }, [isLoggedIn, fetchBlogs, fetchStats]);

  // Precision event-driven scheduler timer:
  // Automatically transitions scheduled blogs to published smoothly when due
  // without vibrating, jerking, or repetitive state flipping.
  useEffect(() => {
    if (!isLoggedIn) return;
    const scheduledBlogs = blogs.filter(
      (b) => b.status === "scheduled" && b.scheduledAt && !autoPublishedIdsRef.current.has(b._id)
    );
    if (scheduledBlogs.length === 0) return;

    const now = Date.now();
    const upcoming = scheduledBlogs
      .map((b) => ({ id: b._id, time: new Date(b.scheduledAt!).getTime(), title: b.title }))
      .filter((item) => !isNaN(item.time));

    if (upcoming.length === 0) return;

    const earliest = upcoming.reduce((prev, curr) => (curr.time < prev.time ? curr : prev));
    // Trigger right on time (with tiny 50ms buffer to ensure server comparison >= scheduledAt)
    const delay = Math.max(0, earliest.time - now + 50);

    const timer = setTimeout(async () => {
      const dueId = earliest.id;
      autoPublishedIdsRef.current.add(dueId);

      // 1. Optimistically update locally for immediate feedback with zero flicker
      setBlogs((prev) =>
        prev.map((b) => {
          if (b._id === dueId || (b.status === "scheduled" && b.scheduledAt && new Date(b.scheduledAt).getTime() <= Date.now())) {
            autoPublishedIdsRef.current.add(b._id);
            return { ...b, status: "published" };
          }
          return b;
        })
      );

      showToast(`Post "${earliest.title}" has been published!`, "success");

      // 2. Trigger server-side publication check and sync silently in background
      try {
        await blogFetch("/api/blog/publish-scheduled", { method: "POST" });
      } catch {
        /* silent */
      }
      fetchBlogs(true);
      fetchStats();
    }, delay);

    return () => clearTimeout(timer);
  }, [blogs, isLoggedIn, fetchBlogs, fetchStats, showToast]);

  // Silent sync on window focus (industry standard SWR pattern)
  useEffect(() => {
    if (!isLoggedIn) return;
    const onFocus = () => {
      fetchBlogs(true);
      fetchStats();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [isLoggedIn, fetchBlogs, fetchStats]);

  // ── Form helpers ──────────────────────────────────────────
  const handleChange = useCallback(
    (field: keyof BlogFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const openNew = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10), scheduledAt: "" });
    setIsEditMode(false);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = async (blog: Blog) => {
    // Fetch full blog (content + meta not included in list)
    try {
      const res = await blogFetch(`/api/blog/${blog._id}`);
      if (res.ok) {
        const data = await res.json();
        const b: Blog = data.blog;
        setForm({
          title: b.title,
          slug: b.slug,
          category: (b.category ?? []).join(", "),
          readTime: b.readTime ?? "",
          date: b.date ? new Date(b.date).toISOString().slice(0, 10) : "",
          excerpt: b.excerpt ?? "",
          featureImage: b.featureImage ?? "",
          content: b.content ?? "",
          metaTitle: b.metaTitle ?? "",
          canonicalUrl: b.canonicalUrl ?? "",
          keywords: (b.keywords ?? []).join(", "),
          metaDescription: b.metaDescription ?? "",
          schema: b.schema ?? (b as any).schemaMarkup ?? "",
          longContent: b.longContent ?? "",
          status: b.status,
          scheduledAt: b.scheduledAt ? getNextMinuteLocalDatetime(b.scheduledAt) : "",
        });
        setEditingId(b._id);
        setIsEditMode(true);
        setIsFormOpen(true);
      }
    } catch {
      showToast("Failed to load blog post.", "error");
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast("Blog title is required.", "error");
      return;
    }
    if (form.status === "scheduled" && !form.scheduledAt) {
      showToast("Please specify a scheduled publication date and time.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        scheduledAt: form.status === "scheduled" && form.scheduledAt
          ? parseLocalDatetimeToISO(form.scheduledAt)
          : null,
        category:
          typeof form.category === "string"
            ? form.category
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : form.category || [],
        keywords:
          typeof form.keywords === "string"
            ? form.keywords
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : form.keywords || [],
      };
      const res = await blogFetch(
        isEditMode ? `/api/blog/${editingId}` : "/api/blog",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        setIsFormOpen(false);
        if (!isEditMode) {
          setCurrentPage(1);
          setSearchQuery("");
        }
        fetchBlogs();
        fetchStats();
        showToast(
          isEditMode
            ? form.status === "scheduled"
              ? "Blog post scheduled!"
              : "Blog post updated!"
            : form.status === "scheduled"
            ? "Blog post scheduled successfully!"
            : "Blog post created!",
          "success",
        );
      } else {
        const d = await res.json();
        showToast(d.message ?? "Failed to save post.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await blogFetch(`/api/blog/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBlogs();
        fetchStats();
        showToast("Blog post deleted.", "success");
      } else {
        showToast("Failed to delete post.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const currentBlog = blogs.find((b) => b._id === id);
    if (!currentBlog || currentBlog.status === newStatus) return;

    // If changing to scheduled, open the adjust schedule modal so the user can set exact date/time
    if (newStatus === "scheduled") {
      setScheduleModalBlog(currentBlog);
      return;
    }

    if (newStatus !== "scheduled") {
      autoPublishedIdsRef.current.delete(id);
    }

    const previousStatus = currentBlog.status;
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: newStatus as "draft" | "published" | "scheduled" } : b,
      ),
    );

    try {
      const payload: any = { status: newStatus };
      const res = await blogFetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          `Status changed to ${newStatus.toUpperCase()}.`,
          "success",
        );
        fetchBlogs(true);
        fetchStats();
      } else {
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: previousStatus } : b,
          ),
        );
        const data = await res.json();
        showToast(data.message || "Failed to update status.", "error");
      }
    } catch {
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: previousStatus } : b)),
      );
      showToast("Network error. Could not update status.", "error");
    }
  };

  const handleSaveSchedule = async (id: string, isoString: string) => {
    setIsSavingSchedule(true);
    try {
      const res = await blogFetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "scheduled",
          scheduledAt: isoString,
        }),
      });
      if (res.ok) {
        autoPublishedIdsRef.current.delete(id);
        showToast("Publication schedule updated successfully!", "success");
        setScheduleModalBlog(null);
        fetchBlogs(true);
        fetchStats();
      } else {
        const d = await res.json();
        showToast(d.message || "Failed to update schedule.", "error");
      }
    } catch {
      showToast("Network error. Could not update schedule.", "error");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const confirmLogout = () => {
    clearBlogToken();
    setIsLoggedIn(false);
    setIsLogoutOpen(false);
  };

  // ── Render: not logged in ─────────────────────────────────
  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Blog Admin Login</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <BlogLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      </>
    );
  }

  // ── Render: dashboard ─────────────────────────────────────
  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800 selection:bg-blue-300 selection:text-black overflow-hidden">
      <Helmet>
        <title>Blog Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <h1 className="text-lg font-black tracking-widest text-slate-800 uppercase">
          Blog Admin
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <BlogSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        handleLogoutClick={() => setIsLogoutOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="hidden md:flex w-full h-16 bg-white border-b border-slate-200 items-center justify-center shrink-0 z-10 relative">
          <h1 className="text-xl font-black tracking-widest text-slate-800 uppercase">
            Blog Admin
          </h1>
        </header>

        {/* Scheduled Posts Top Notification Banner */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out shrink-0 ${
            stats && stats.scheduled > 0 && !isDismissBanner
              ? "max-h-20 opacity-100 border-b border-violet-500/30"
              : "max-h-0 opacity-0 border-b-0 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white px-4 sm:px-6 py-2.5 shadow-sm flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Clock className="w-4 h-4 text-violet-200 shrink-0" />
              <span>
                You have <strong className="font-bold underline decoration-violet-300">{stats?.scheduled ?? 0} scheduled {stats?.scheduled === 1 ? "post" : "posts"}</strong> set to publish automatically.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("blogs");
                  setStatusFilter("scheduled");
                }}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-sm transition-colors cursor-pointer"
              >
                View Scheduled
              </button>
              <button
                type="button"
                onClick={() => setIsDismissBanner(true)}
                className="p-1 text-white/70 hover:text-white rounded-sm transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 w-full overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "overview" && <BlogOverviewTab stats={stats} />}
            {activeTab === "blogs" && (
              <BlogsTab
                blogs={blogs}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                currentPage={currentPage}
                totalPages={totalPages}
                totalBlogs={totalBlogs}
                setCurrentPage={setCurrentPage}
                onNew={openNew}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onAdjustSchedule={(b) => setScheduleModalBlog(b)}
                dateSort={dateSort}
                onToggleDateSort={handleToggleDateSort}
              />
            )}
          </div>
        </main>
      </div>

      {/* Blog Schedule Modal */}
      <BlogScheduleModal
        isOpen={!!scheduleModalBlog}
        blog={scheduleModalBlog}
        isSaving={isSavingSchedule}
        onClose={() => setScheduleModalBlog(null)}
        onSaveSchedule={handleSaveSchedule}
      />

      {/* Blog Form Modal */}
      <BlogFormModal
        isOpen={isFormOpen}
        isEditMode={isEditMode}
        form={form}
        isSaving={isSaving}
        onClose={() => setIsFormOpen(false)}
        onChange={handleChange}
        onSave={handleSave}
      />

      {/* Logout Modal */}
      <BlogLogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={confirmLogout}
      />

      {/* Delete Modal */}
      <BlogDeleteModal
        isOpen={!!deleteId}
        isDeleting={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Toast Stack */}
      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-5 fade-in duration-300 min-w-[280px] ${
              t.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 opacity-80 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              className="opacity-70 hover:opacity-100 hover:bg-white/20 p-1.5 rounded-lg transition-colors ml-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdminPage;
