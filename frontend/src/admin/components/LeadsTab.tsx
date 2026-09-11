import React, { useState } from "react";
import {
  Search,
  Calendar,
  User,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type Lead } from "../types";
import { STATUS_CONFIG } from "../constants";
import { fetchWithAuth } from "../../utils/apiClient";

interface LeadsTabProps {
  leads: Lead[];
  loadingLeads: boolean;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  leadSearchQuery: string;
  setLeadSearchQuery: (query: string) => void;
  leadStatusFilter: string;
  setLeadStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  handleStatusChange: (leadId: string, newStatus: string) => void;
  openLeadModal: (lead: Lead) => void;
  handleDeleteLead: (leadId: string) => void;
}

const LeadRow = React.memo(
  ({
    lead,
    idx,
    currentPage,
    handleStatusChange,
    openLeadModal,
    handleDeleteLead,
  }: {
    lead: Lead;
    idx: number;
    currentPage: number;
    handleStatusChange: (leadId: string, newStatus: string) => void;
    openLeadModal: (lead: Lead) => void;
    handleDeleteLead: (leadId: string) => void;
  }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4 text-center text-xs font-black text-slate-400">
        {(currentPage - 1) * 10 + idx + 1}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">{lead.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{lead.email}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono tracking-wide">
              {lead.phone || "No phone provided"}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">
            {new Date(lead.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">
            {new Date(lead.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>
      <td className="p-4 text-center">
        <select
          aria-label={`Change status for ${lead.name}`}
          value={lead.status}
          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
          className={`text-xs font-bold px-3 py-1.5 rounded-sm border outline-none cursor-pointer ${(STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.NEW).bg} ${(STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.NEW).color} ${(STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.NEW).border}`}
        >
          {Object.keys(STATUS_CONFIG).map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
            </option>
          ))}
        </select>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-2 items-center">
          <button
            onClick={() => openLeadModal(lead)}
            className="text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-sm w-full text-center cursor-pointer"
          >
            View / Edit
          </button>
          <button
            onClick={() => handleDeleteLead(lead._id)}
            className="text-xs font-bold bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 rounded-sm w-full text-center cursor-pointer"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ),
);

export const LeadsTab: React.FC<LeadsTabProps> = ({
  leads,
  loadingLeads,
  totalPages,
  currentPage,
  setCurrentPage,
  leadSearchQuery,
  setLeadSearchQuery,
  leadStatusFilter,
  setLeadStatusFilter,
  dateFilter,
  setDateFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  handleStatusChange,
  openLeadModal,
  handleDeleteLead,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCSV = async () => {
    setIsDownloading(true);
    try {
      const params = new URLSearchParams();
      if (leadStatusFilter !== "All") params.append("status", leadStatusFilter);
      if (leadSearchQuery) params.append("search", leadSearchQuery);
      if (dateFilter !== "All") {
        params.append("dateFilter", dateFilter);
        if (dateFilter === "Custom" && customStartDate && customEndDate) {
          params.append("startDate", customStartDate);
          params.append("endDate", customEndDate);
        }
      }

      const response = await fetchWithAuth(`/api/leads/export-csv?${params.toString()}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-800">Leads Funnel</h3>
          <p className="text-xs font-semibold text-slate-400">
            Manage applicants and program candidates
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={leadSearchQuery}
              onChange={(e) => setLeadSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm font-semibold focus:border-blue-500 outline-none"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="Custom">Custom Range</option>
            </select>
          </div>
          {dateFilter === "Custom" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  if (customEndDate && e.target.value > customEndDate) {
                    setCustomEndDate(e.target.value);
                  }
                }}
                className="w-full sm:w-auto px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-slate-700 outline-none cursor-pointer"
              />
              <span className="hidden sm:inline text-slate-400 font-bold">
                -
              </span>
              <input
                type="date"
                min={customStartDate}
                max={new Date().toISOString().split("T")[0]}
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full sm:w-auto px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-slate-700 outline-none cursor-pointer"
              />
            </div>
          )}
          <select
            aria-label="Filter by status"
            value={leadStatusFilter}
            onChange={(e) => setLeadStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            {Object.keys(STATUS_CONFIG).map((status) => (
              <option key={status} value={status}>
                {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
              </option>
            ))}
          </select>
          <button
            onClick={downloadCSV}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-sm text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? "Exporting..." : "Download CSV"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Candidate</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loadingLeads ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400 font-semibold"
                  >
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead, idx) => (
                  <LeadRow
                    key={lead._id}
                    lead={lead}
                    idx={idx}
                    currentPage={currentPage}
                    handleStatusChange={handleStatusChange}
                    openLeadModal={openLeadModal}
                    handleDeleteLead={handleDeleteLead}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-slate-200 text-slate-500 bg-white hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-slate-200 text-slate-500 bg-white hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
