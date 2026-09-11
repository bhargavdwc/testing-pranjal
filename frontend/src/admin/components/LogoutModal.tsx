import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  confirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isLogoutModalOpen, setIsLogoutModalOpen, confirmLogout }) => {
  if (!isLogoutModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Confirm Logout</h3>
          <p className="text-sm font-medium text-slate-500">Are you sure you want to log out of the admin panel?</p>
        </div>
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-300 rounded-sm hover:text-slate-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={confirmLogout} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};
