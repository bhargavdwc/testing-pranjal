import React from "react";
import {
  Menu,
  LayoutDashboard,
  Contact,
  Power,
  X,
  UserCog,
} from "lucide-react";
import Logo from "../../assets/SignatureSticker.webp";

interface SidebarProps {
  activeTab: "overview" | "leads" | "users";
  setActiveTab: (tab: "overview" | "leads" | "users") => void;
  userRole?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  handleLogoutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed,
  setIsCollapsed,
  handleLogoutClick,
}) => {
  return (
    <aside
      className={`
      fixed md:static inset-y-0 left-0 z-50 md:z-20
      bg-white border-r border-slate-200 shadow-xl md:shadow-none
      transform transition-all duration-300 ease-in-out flex flex-col
      ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      ${isCollapsed ? "md:w-[80px]" : "w-[280px] md:w-[280px]"}
    `}
    >
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <div className="animate-in fade-in zoom-in duration-200 flex items-center h-full">
            <img src={Logo} alt="Pranjal Sarkar" className="h-20 w-auto object-contain select-none pointer-events-none drop-shadow-sm filter brightness-0" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-sm bg-slate-50 hover:bg-slate-200 text-slate-400 !cursor-ew-resize"
          title="Toggle Sidebar"
        >
          <Menu className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1.5 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          <button
            onClick={() => {
              setActiveTab("overview");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"} py-3 rounded-lg transition-all cursor-pointer group ${activeTab === "overview" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <div className="relative w-5 h-5 shrink-0 overflow-hidden">
              <LayoutDashboard
                className={`w-5 h-5 absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-full ${activeTab === "overview" ? "text-white" : "text-slate-500"}`}
              />
              <LayoutDashboard
                className={`w-5 h-5 absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 ${activeTab === "overview" ? "text-white" : "text-blue-600"}`}
              />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-semibold">Overview</span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("leads");
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"} py-3 rounded-lg transition-all cursor-pointer group ${activeTab === "leads" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <div className="relative w-5 h-5 shrink-0 overflow-hidden">
              <Contact
                className={`w-5 h-5 absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-full ${activeTab === "leads" ? "text-white" : "text-slate-500"}`}
              />
              <Contact
                className={`w-5 h-5 absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 ${activeTab === "leads" ? "text-white" : "text-blue-600"}`}
              />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-semibold">Leads CRM</span>
            )}
          </button>

          {userRole === "super_admin" && (
            <button
              onClick={() => {
                setActiveTab("users");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-4"} py-3 rounded-lg transition-all cursor-pointer group ${activeTab === "users" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <div className="relative w-5 h-5 shrink-0 overflow-hidden">
                <UserCog
                  className={`w-5 h-5 absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-full ${activeTab === "users" ? "text-white" : "text-slate-500"}`}
                />
                <UserCog
                  className={`w-5 h-5 absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 ${activeTab === "users" ? "text-white" : "text-blue-600"}`}
                />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-semibold">Admin Users</span>
              )}
            </button>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-slate-500 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 cursor-pointer group shadow-sm border border-slate-100"
        >
          <div className="relative w-4 h-4 shrink-0 overflow-hidden">
            <Power className="w-4 h-4 absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-full text-slate-500" />
            <Power className="w-4 h-4 absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 text-rose-600" />
          </div>
          {!isCollapsed && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
