import React from "react";
import { FileText, Globe, BookOpen, Clock } from "lucide-react";
import type { BlogStats } from "../types";

interface BlogOverviewTabProps {
  stats: BlogStats | null;
}

export const BlogOverviewTab: React.FC<BlogOverviewTabProps> = ({ stats }) => {
  const cards = [
    { label: "Total Posts", value: stats?.total ?? 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published", value: stats?.published ?? 0, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Scheduled", value: stats?.scheduled ?? 0, icon: Clock, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Drafts", value: stats?.draft ?? 0, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Blog Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-sm ${c.bg} ${c.color}`}>
              <c.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-black text-slate-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-slate-500 font-medium">
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>URL Slug is auto-generated from the title — you can override it.</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Fill in all Meta Tags fields for best SEO results.</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Set status to <strong className="text-slate-700">Published</strong> to make a post live immediately.</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Set status to <strong className="text-slate-700">Scheduled</strong> with a future date &amp; time to auto-publish automatically.</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Schema (JSON-LD) accepts raw JSON — it will be injected as structured data.</li>
          <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span>Long Content is hidden from readers — used for SEO keyword density.</li>
        </ul>
      </div>
    </div>
  );
};
