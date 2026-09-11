import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Mail, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { fetchWithAuth } from '../../utils/apiClient';

interface AdminUser {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  isProtected?: boolean;
}

export const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Add User State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/api/users`);
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users || []);
      } else {
        setErrorMsg(data.message || 'Failed to fetch users');
      }
    } catch {
      setErrorMsg('Network error while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetchWithAuth(`/api/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, role: newRole })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers([data.user, ...users]);
        setNewEmail('');
        setIsAddingUser(false);
      } else {
        setErrorMsg(data.message || 'Failed to add user');
      }
    } catch {
      setErrorMsg('Network error while adding user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await fetchWithAuth(`/api/users/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(users.filter(u => u._id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        setErrorMsg(data.message || 'Failed to delete user');
        setDeleteTarget(null);
      }
    } catch {
      setErrorMsg('Network error while deleting user');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-lg font-black text-slate-800">Admin Users</h2>
          <p className="text-sm text-slate-500 font-medium">Manage access to the CRM panel</p>
        </div>
        {!isAddingUser && (
          <button 
            onClick={() => setIsAddingUser(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white pl-4 pr-3 py-3 rounded-xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-5 fade-in duration-300 z-[100] flex items-center justify-between min-w-[320px]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-200" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg('')}
            className="text-red-200 hover:text-white hover:bg-red-700 p-1.5 rounded-lg transition-colors ml-4"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isAddingUser && (
        <div className="p-6 border-b border-slate-100 bg-blue-50/50">
          <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
                className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-sm text-slate-900 text-sm font-semibold focus:border-blue-500 outline-none transition-colors" 
                placeholder="newadmin@example.com"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Role</label>
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-md text-slate-900 text-sm font-semibold focus:border-blue-500 outline-none transition-colors"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save User'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsAddingUser(false)}
                className="flex-1 md:flex-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-md text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-0">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Added On</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === 'super_admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <ShieldAlert className="w-3 h-3" />
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {!user.isProtected && (
                        <button
                          onClick={() => setDeleteTarget({ id: user._id, email: user.email })}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-md border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Delete User</h3>
                  <p className="text-sm text-slate-500 font-medium">This action cannot be undone</p>
                </div>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-6">
                Are you sure you want to remove <strong className="text-slate-800">{deleteTarget.email}</strong> from the admin panel? They will no longer be able to log in.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-md text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
