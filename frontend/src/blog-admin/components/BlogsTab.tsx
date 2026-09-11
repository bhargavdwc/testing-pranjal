import React, { useState, useEffect } from "react";
import {
  Plus, Search, Trash2, Pencil, Globe, FileText, ChevronDown, ChevronUp, Check,
  ChevronLeft, ChevronRight, CalendarDays, Clock, X, Download, Loader2,
} from "lucide-react";
import type { Blog } from "../types";
import { blogFetch } from "../blogApiClient";

interface BlogsTabProps {
  blogs: Blog[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  setCurrentPage: (p: number) => void;
  onNew: () => void;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onAdjustSchedule?: (blog: Blog) => void;
  dateSort: "asc" | "desc";
  onToggleDateSort: () => void;
}

export const BlogsTab: React.FC<BlogsTabProps> = ({
  blogs, loading, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  currentPage, totalPages, totalBlogs, setCurrentPage,
  onNew, onEdit, onDelete, onStatusChange, onAdjustSchedule,
  dateSort, onToggleDateSort,
}) => {
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);

  const handleDownloadCSV = async () => {
    setIsDownloadingCSV(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter && statusFilter !== "All") params.append("status", statusFilter);

      const response = await blogFetch(`/api/blog/export-csv?${params.toString()}`);
      if (!response.ok) throw new Error("Blog export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blogs_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV download failed:", err);
    } finally {
      setIsDownloadingCSV(false);
    }
  };

  // Client-side sort for immediate responsiveness
  const sortedBlogs = React.useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    return [...blogs].sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return dateSort === "asc" ? timeA - timeB : timeB - timeA;
    });
  }, [blogs, dateSort]);

  // Floating status menu state with viewport coordinates
  const [statusMenu, setStatusMenu] = useState<{
    id: string;
    currentStatus: string;
    top: number;
    left: number;
    openUpward: boolean;
  } | null>(null);

  // Click feedback when disabled buttons are clicked
  const [shakePrev, setShakePrev] = useState(false);
  const [shakeNext, setShakeNext] = useState(false);

  // Close floating menu on scroll or resize so it doesn't detach
  useEffect(() => {
    const handleClose = () => setStatusMenu(null);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, []);

  const safeTotal = typeof totalBlogs === "number" && !isNaN(totalBlogs) ? totalBlogs : (blogs?.length ?? 0);
  const safeTotalPages = Math.max(1, totalPages || 1);

  const handleOpenStatusMenu = (blog: Blog, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (statusMenu?.id === blog._id) {
      setStatusMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 124;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 20;

    setStatusMenu({
      id: blog._id,
      currentStatus: blog.status,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.left,
      openUpward,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-800">Blog Posts</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            disabled={isDownloadingCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            title="Export blogs as CSV"
          >
            {isDownloadingCSV ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloadingCSV ? "Exporting..." : "Download CSV"}
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#155DFC] hover:bg-[#1048c7] text-white text-sm font-bold rounded-sm shadow-md shadow-[#155DFC]/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by blog title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm font-semibold text-slate-700 focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]/20 outline-none transition-all cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-bold text-sm">No blog posts found</p>
            <p className="text-xs mt-1">Create your first post using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-[12px] font-black text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-[12px] font-black text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    <button
                      type="button"
                      onClick={onToggleDateSort}
                      className="inline-flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer select-none group"
                      title={`Sort by date (${dateSort === "desc" ? "currently newest first" : "currently oldest first"})`}
                    >
                      <span>DATE</span>
                      <span className="inline-flex flex-col -space-y-1">
                        <ChevronUp
                          className={`w-2.5 h-2.5 transition-colors ${
                            dateSort === "asc"
                              ? "text-blue-600 stroke-[3]"
                              : "text-slate-300 group-hover:text-slate-400"
                          }`}
                        />
                        <ChevronDown
                          className={`w-2.5 h-2.5 transition-colors ${
                            dateSort === "desc"
                              ? "text-blue-600 stroke-[3]"
                              : "text-slate-300 group-hover:text-slate-400"
                          }`}
                        />
                      </span>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-[12px] font-black text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedBlogs.map(blog => (
                  <tr key={blog._id} className="hover:bg-slate-50 transition-colors group">
                    {/* Title only (no slug, no excerpt) */}
                    <td className="px-4 py-4 max-w-[320px]">
                      <p className="font-bold text-slate-800 line-clamp-2" title={blog.title}>
                        {blog.title}
                      </p>
                    </td>                    

                    {/* Date / Time */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {blog.status === "scheduled" ? (
                        <button
                          type="button"
                          onClick={() => onAdjustSchedule?.(blog)}
                          className="flex flex-col text-left group/sched p-1.5 -m-1.5 rounded-sm hover:bg-violet-50 transition-colors cursor-pointer border border-transparent hover:border-violet-200"
                          title="Click to adjust scheduled date & time"
                        >
                          <span className="flex items-center gap-1 text-xs text-violet-700 font-bold group-hover/sched:text-violet-900">
                            <Clock className="w-3 h-3 text-violet-600 shrink-0 group-hover/sched:scale-110 transition-transform" />
                            {blog.scheduledAt
                              ? new Date(blog.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : "Set Date"}
                            <span className="text-[9.5px] uppercase tracking-wider bg-violet-100 text-violet-700 px-1 py-0.2 rounded font-black opacity-80 group-hover/sched:opacity-100 group-hover/sched:bg-violet-200 transition-colors">
                              Adjust
                            </span>
                          </span>
                          <span className="text-[10.5px] text-violet-600/80 font-semibold pl-4">
                            {blog.scheduledAt
                              ? new Date(blog.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
                              : "Set Time"}
                          </span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <CalendarDays className="w-3 h-3" />
                          {blog.date ? new Date(blog.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown Trigger */}
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={(e) => handleOpenStatusMenu(blog, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold border transition-all duration-300 cursor-pointer select-none ${
                          blog.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/80 shadow-xs"
                            : blog.status === "scheduled"
                            ? "bg-violet-50 text-violet-700 border-violet-300 hover:bg-violet-100/80 shadow-xs"
                            : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100/80 shadow-xs"
                        }`}
                      >
                        {blog.status === "published" ? (
                          <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : blog.status === "scheduled" ? (
                          <Clock className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="tracking-wide">
                          {blog.status === "published" ? "PUBLISHED" : blog.status === "scheduled" ? "SCHEDULED" : "DRAFT"}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ml-0.5 ${
                          statusMenu?.id === blog._id ? "rotate-180" : ""
                        }`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {blog.status === "scheduled" && onAdjustSchedule && (
                          <button
                            type="button"
                            onClick={() => onAdjustSchedule(blog)}
                            title="Adjust schedule date & time"
                            className="p-2 rounded-sm text-violet-600 hover:bg-violet-50 hover:text-violet-800 transition-colors cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(blog)}
                          title="Edit post"
                          className="p-2 rounded-sm text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(blog._id)}
                          title="Delete post"
                          className="p-2 rounded-sm text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {blogs.length > 0 && (() => {
          const isPrevDisabled = currentPage <= 1;
          const isNextDisabled = currentPage >= safeTotalPages || safeTotalPages <= 1;

          const handlePrev = () => {
            if (isPrevDisabled) {
              setShakePrev(true);
              setTimeout(() => setShakePrev(false), 250);
              return;
            }
            setCurrentPage(Math.max(1, currentPage - 1));
          };

          const handleNext = () => {
            if (isNextDisabled) {
              setShakeNext(true);
              setTimeout(() => setShakeNext(false), 250);
              return;
            }
            setCurrentPage(Math.min(safeTotalPages, currentPage + 1));
          };

          return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 select-none">
              <div className="text-xs font-medium text-slate-500">
                {safeTotal === 0 ? (
                  <span>No blogs to display</span>
                ) : safeTotal <= 10 ? (
                  <span>
                    Showing all <strong className="font-bold text-slate-800">{safeTotal}</strong> {safeTotal === 1 ? "blog" : "blogs"}
                  </span>
                ) : (
                  <span>
                    Showing <strong className="font-bold text-slate-800">{(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, safeTotal)}</strong> of{" "}
                    <strong className="font-bold text-slate-800">{safeTotal}</strong> blogs
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isPrevDisabled}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border text-xs font-bold transition-all select-none ${
                    isPrevDisabled
                      ? "!cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  } ${shakePrev ? "animate-ban-shake" : ""}`}
                  title={isPrevDisabled ? "Action not allowed" : "Previous page"}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {Array.from({ length: safeTotalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-7 h-7 px-2 rounded-sm text-xs font-bold transition-all flex items-center justify-center ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-xs cursor-default"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm border text-xs font-bold transition-all select-none ${
                    isNextDisabled
                      ? "!cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200"
                      : "cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  } ${shakeNext ? "animate-ban-shake" : ""}`}
                  title={isNextDisabled ? "Action not allowed" : "Next page"}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Floating Status Dropdown Menu (Fixed in viewport — Never clipped by card borders) */}
      {statusMenu && (
        <>
          <div
            className="fixed inset-0 z-[999] bg-transparent"
            onClick={() => setStatusMenu(null)}
          />
          <div
            style={{
              top: `${statusMenu.top}px`,
              left: `${statusMenu.left}px`,
            }}
            className="fixed w-36 bg-white border border-slate-200 rounded-sm shadow-2xl z-[1000] py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              type="button"
              onClick={() => {
                onStatusChange(statusMenu.id, "published");
                setStatusMenu(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left font-bold transition-colors cursor-pointer ${
                statusMenu.currentStatus === "published"
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>PUBLISHED</span>
              {statusMenu.currentStatus === "published" && (
                <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const b = blogs.find((item) => item._id === statusMenu.id);
                if (onAdjustSchedule && b) {
                  onAdjustSchedule(b);
                } else {
                  onStatusChange(statusMenu.id, "scheduled");
                }
                setStatusMenu(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left font-bold transition-colors cursor-pointer ${
                statusMenu.currentStatus === "scheduled"
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span>SCHEDULED</span>
              {statusMenu.currentStatus === "scheduled" && (
                <Check className="w-3.5 h-3.5 text-violet-600 ml-auto" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onStatusChange(statusMenu.id, "draft");
                setStatusMenu(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left font-bold transition-colors cursor-pointer ${
                statusMenu.currentStatus === "draft"
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>DRAFT</span>
              {statusMenu.currentStatus === "draft" && (
                <Check className="w-3.5 h-3.5 text-amber-600 ml-auto" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
