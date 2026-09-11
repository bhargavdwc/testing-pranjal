import React, { useState, useEffect } from "react";
import { X, Clock, Loader2, Check } from "lucide-react";
import type { Blog } from "../types";
import { formatToLocalDatetimeInput, parseLocalDatetimeToISO, getNextMinuteLocalDatetime } from "../dateUtils";

interface BlogScheduleModalProps {
  isOpen: boolean;
  blog: Blog | null;
  isSaving: boolean;
  onClose: () => void;
  onSaveSchedule: (id: string, scheduledAt: string) => Promise<void>;
}

export const BlogScheduleModal: React.FC<BlogScheduleModalProps> = ({
  isOpen,
  blog,
  isSaving,
  onClose,
  onSaveSchedule,
}) => {
  const [scheduledAt, setScheduledAt] = useState<string>("");

  useEffect(() => {
    if (blog && isOpen) {
      setScheduledAt(getNextMinuteLocalDatetime(blog.scheduledAt));
    }
  }, [blog, isOpen]);

  if (!isOpen || !blog) return null;

  const handleSave = async () => {
    if (!scheduledAt) return;
    const isoString = parseLocalDatetimeToISO(scheduledAt);
    await onSaveSchedule(blog._id, isoString);
  };

  const minLocalDatetime = formatToLocalDatetimeInput(new Date(Date.now() - 60 * 1000));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-violet-600 text-white shadow-sm shadow-violet-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">Adjust Schedule</h2>
              <p className="text-xs text-slate-500 font-medium">Set publication date &amp; time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Blog preview */}
          <div className="bg-slate-50 rounded-sm p-3 border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Post Title</p>
            <p className="text-sm font-bold text-slate-800 line-clamp-2">{blog.title}</p>
          </div>

          {/* Date & Time Input */}
          <div>
            <label htmlFor="modal-scheduled-at" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Select Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <input
              id="modal-scheduled-at"
              type="datetime-local"
              value={scheduledAt}
              min={minLocalDatetime}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-sm text-slate-900 text-sm font-semibold focus:border-violet-500 focus:bg-white outline-none transition-colors"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !scheduledAt}
            className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
