import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, CheckCircle2 } from "lucide-react";
import { fetchWithAuth } from "../utils/apiClient";
import { type Lead, type LeadStatsResponse } from "./types";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { OverviewTab } from "./components/OverviewTab";
import { LeadsTab } from "./components/LeadsTab";
import { UsersTab } from "./components/UsersTab";
import { LeadModal } from "./components/LeadModal";
import { LogoutModal } from "./components/LogoutModal";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { Helmet } from "react-helmet-async";

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("adminToken"),
  );

  // Extract role from token safely
  const getUserRole = () => {
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return undefined;
    }
  };
  const userRole = getUserRole();

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "users">(
    "overview",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadStats, setLeadStats] = useState<LeadStatsResponse | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [leadNotes, setLeadNotes] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(leadSearchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [leadSearchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    leadStatusFilter,
    debouncedSearchQuery,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
    };
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  // Poll to quickly log out deleted/revoked users
  useEffect(() => {
    if (!token) return;

    const verifySession = async () => {
      try {
        await fetchWithAuth("/api/auth/verify");
        // If 401, fetchWithAuth automatically dispatches 'auth-expired'
      } catch (err) {
        console.error("Session verification failed", err);
      }
    };

    // Check every 15 seconds
    const interval = setInterval(verifySession, 15000);

    return () => clearInterval(interval);
  }, [token]);

  // Fetch Logic
  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingLeads(true);
      const params = new URLSearchParams();
      if (leadStatusFilter !== "All") params.append("status", leadStatusFilter);
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      params.append("page", currentPage.toString());
      params.append("limit", "10");
      if (dateFilter !== "All") {
        params.append("dateFilter", dateFilter);
        if (dateFilter === "Custom" && customStartDate && customEndDate) {
          params.append("startDate", customStartDate);
          params.append("endDate", customEndDate);
        }
      }

      const response = await fetchWithAuth(`/api/leads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoadingLeads(false);
    }
  }, [
    token,
    leadStatusFilter,
    debouncedSearchQuery,
    currentPage,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  const fetchLeadStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetchWithAuth("/api/leads/stats");
      if (response.ok) {
        setLeadStats(await response.json());
      }
    } catch (err) {
      console.error("Error fetching lead stats:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchLeadStats();
    }
  }, [token, fetchLeads, fetchLeadStats]);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
  };

  const confirmLogout = async () => {
    try {
      await fetchWithAuth("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setToken(null);
      localStorage.removeItem("adminToken");
      setIsLogoutModalOpen(false);
    }
  };

  const handleStatusChange = useCallback(
    async (leadId: string, newStatus: string) => {
      try {
        const response = await fetchWithAuth(`/api/leads/${leadId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
          fetchLeads();
          fetchLeadStats();
          if (selectedLead && selectedLead._id === leadId) {
            setSelectedLead({
              ...selectedLead,
              status: newStatus as Lead["status"],
            });
          }
        }
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to update status");
        setTimeout(() => setToastMessage(null), 3000);
      }
    },
    [fetchLeads, fetchLeadStats, selectedLead],
  );

  const handleDeleteLead = useCallback((leadId: string) => {
    setLeadToDelete(leadId);
  }, []);

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsDeletingLead(true);
    try {
      const response = await fetchWithAuth(`/api/leads/${leadToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchLeads();
        fetchLeadStats();
        setToastMessage("Lead deleted successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage("Failed to delete lead");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to delete lead");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsDeletingLead(false);
      setLeadToDelete(null);
    }
  };

  const handleUpdateLeadDetails = async () => {
    if (!selectedLead) return;
    setIsUpdatingLead(true);

    let finalNotes = leadNotes;
    if (newNoteText.trim()) {
      const dateStr = new Date().toLocaleString();
      const newEntry = `[${dateStr}]\n${newNoteText.trim()}`;
      finalNotes = finalNotes ? `${finalNotes}|||${newEntry}` : newEntry;
    }

    try {
      const response = await fetchWithAuth(`/api/leads/${selectedLead._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: finalNotes,
        }),
      });
      if (response.ok) {
        fetchLeads();
        setIsLeadModalOpen(false);
        setToastMessage("Lead details updated successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to update lead");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const openLeadModal = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || "");
    setNewNoteText("");
    setIsAddingNote(false);
    setIsLeadModalOpen(true);
  }, []);

  if (!token) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800 selection:bg-blue-300 selection:text-black overflow-hidden">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <h1 className="text-lg font-black tracking-widest text-slate-800 uppercase">
          Product Management
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

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        handleLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Top Static Navbar (Desktop) */}
        <header className="hidden md:flex w-full h-16 bg-white border-b border-slate-200 items-center justify-center shrink-0 z-10 relative">
          <h1 className="text-xl font-black tracking-widest text-slate-800 uppercase">
            Product Management
          </h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === "overview" && (
              <OverviewTab leadStats={leadStats} userRole={userRole} />
            )}
            {activeTab === "leads" && (
              <LeadsTab
                leads={leads}
                loadingLeads={loadingLeads}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                leadSearchQuery={leadSearchQuery}
                setLeadSearchQuery={setLeadSearchQuery}
                leadStatusFilter={leadStatusFilter}
                setLeadStatusFilter={setLeadStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
                handleStatusChange={handleStatusChange}
                openLeadModal={openLeadModal}
                handleDeleteLead={handleDeleteLead}
              />
            )}
            {activeTab === "users" && userRole === "super_admin" && (
              <UsersTab />
            )}
          </div>
        </main>
      </div>

      <LeadModal
        selectedLead={selectedLead}
        leadNotes={leadNotes}
        newNoteText={newNoteText}
        setNewNoteText={setNewNoteText}
        isAddingNote={isAddingNote}
        setIsAddingNote={setIsAddingNote}
        isLeadModalOpen={isLeadModalOpen}
        setIsLeadModalOpen={setIsLeadModalOpen}
        handleUpdateLeadDetails={handleUpdateLeadDetails}
        isUpdatingLead={isUpdatingLead}
      />

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white pl-4 pr-3 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-5 fade-in duration-300 z-100 flex items-center justify-between min-w-[320px]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-200 hover:text-white hover:bg-emerald-700 p-1.5 rounded-lg transition-colors ml-4"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <LogoutModal
        isLogoutModalOpen={isLogoutModalOpen}
        setIsLogoutModalOpen={setIsLogoutModalOpen}
        confirmLogout={confirmLogout}
      />

      <DeleteConfirmationModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={confirmDeleteLead}
        isDeleting={isDeletingLead}
      />
    </div>
  );
};
