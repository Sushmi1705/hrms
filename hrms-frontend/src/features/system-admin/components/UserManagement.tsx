import React, { useState, useEffect } from 'react';
import {
  Search, Filter, UserPlus, MoreVertical, Shield, Lock, Unlock,
  KeyRound, LogOut, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, RefreshCw, Smartphone, Download
} from 'lucide-react';
import { UserSummary, UserDetails, RoleData, PagedResult } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';
import { CreateUserModal } from './CreateUserModal';
import { UserDetailsDrawer } from './UserDetailsDrawer';

export const UserManagement: React.FC<{ roles: RoleData[] }> = ({ roles }) => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserDetails | null>(null);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await systemAdminApi.getUsers({
        search: search || undefined,
        role: selectedRole !== 'All' ? selectedRole : undefined,
        company: selectedCompany !== 'All' ? selectedCompany : undefined,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        page,
        pageSize
      });
      setUsers(res.items);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole, selectedCompany, selectedDept, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenDetails = async (userId: string) => {
    try {
      const details = await systemAdminApi.getUserDetails(userId);
      setSelectedUserDetail(details);
      setActiveActionMenu(null);
    } catch (err) {
      alert('Failed to load user details');
    }
  };

  const handleResetPassword = async (userId: string, name: string) => {
    if (!window.confirm(`Reset password for ${name}?`)) return;
    try {
      const res = await systemAdminApi.resetPassword(userId);
      alert(`Password has been reset! Temporary Password: ${res.temporaryPassword}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleToggleLock = async (user: UserSummary) => {
    try {
      if (user.isLocked) {
        await systemAdminApi.unlockUser(user.id);
      } else {
        const reason = window.prompt('Enter lock reason:', 'Exceeded login attempts');
        if (reason === null) return;
        await systemAdminApi.lockUser(user.id, reason);
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleToggleActive = async (user: UserSummary) => {
    try {
      if (user.isActive) {
        if (!window.confirm(`Deactivate ${user.fullName}?`)) return;
        await systemAdminApi.deactivateUser(user.id);
      } else {
        await systemAdminApi.activateUser(user.id);
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteUser = async (user: UserSummary) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.fullName}? This cannot be undone.`)) return;
    try {
      await systemAdminApi.deleteUser(user.id);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleForceLogout = async (userId: string) => {
    try {
      await systemAdminApi.forceLogout(userId);
      alert('All user sessions terminated.');
    } catch (err: any) {
      alert('Failed to force logout');
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, username, email, ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedRole}
            onChange={e => { setSelectedRole(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Roles</option>
            {roles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <select
            value={selectedCompany}
            onChange={e => { setSelectedCompany(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Companies</option>
            <option value="Acme Global Technologies">Acme Global</option>
            <option value="Acme Innovations Ltd">Acme Innovations</option>
            <option value="Acme Logistics Group">Acme Logistics</option>
          </select>

          <select
            value={selectedDept}
            onChange={e => { setSelectedDept(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
            <option value="Locked">Locked Only</option>
          </select>

          <a
            href={systemAdminApi.getExportUrl('users', 'csv')}
            download
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 transition-colors"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-4 py-3.5">Employee ID</th>
                <th className="px-4 py-3.5">Organization</th>
                <th className="px-4 py-3.5">Roles</th>
                <th className="px-4 py-3.5">MFA</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last Login</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No user accounts matched the filter criteria.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(u.id)}
                  >
                    {/* User Identity */}
                    <td className="px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {u.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            @{u.username} • {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {u.employeeId || '—'}
                    </td>

                    {/* Organization */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{u.departmentName || 'General'}</div>
                      <div className="text-[10px] text-slate-400">{u.companyName}</div>
                    </td>

                    {/* Roles */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map(r => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                              r.includes('Admin')
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
                                : r.includes('Manager')
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* MFA */}
                    <td className="px-4 py-3">
                      {u.requireMfa || u.mfaEnabled ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center gap-1 w-fit">
                          <Shield className="w-3 h-3" /> Enforced
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Disabled</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        u.isLocked
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                          : u.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}>
                        {u.isLocked ? 'Locked' : u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3 text-slate-500">
                      <div>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.lastLoginIp || ''}</div>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-5 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveActionMenu(activeActionMenu === u.id ? null : u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeActionMenu === u.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 text-xs">
                            <button
                              onClick={() => handleOpenDetails(u.id)}
                              className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Profile & Tabs
                            </button>

                            <button
                              onClick={() => handleToggleLock(u)}
                              className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                            >
                              {u.isLocked ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                              {u.isLocked ? 'Unlock Account' : 'Lock Account'}
                            </button>

                            <button
                              onClick={() => handleResetPassword(u.id, u.fullName)}
                              className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-primary" /> Reset Password
                            </button>

                            <button
                              onClick={() => handleForceLogout(u.id)}
                              className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Force Terminate Sessions
                            </button>

                            <button
                              onClick={() => handleToggleActive(u)}
                              className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                            >
                              {u.isActive ? <XCircle className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                              {u.isActive ? 'Deactivate Account' : 'Activate Account'}
                            </button>

                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="w-full px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{users.length}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          roles={roles}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {selectedUserDetail && (
        <UserDetailsDrawer
          user={selectedUserDetail}
          availableRoles={roles}
          onClose={() => setSelectedUserDetail(null)}
          onRefresh={() => {
            fetchUsers();
            if (selectedUserDetail) handleOpenDetails(selectedUserDetail.id);
          }}
        />
      )}
    </div>
  );
};
