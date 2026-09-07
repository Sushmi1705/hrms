import React, { useState } from 'react';
import {
  X, User, Shield, KeyRound, Smartphone, History, AlertTriangle, FileText,
  CheckCircle, XCircle, Lock, Unlock, RefreshCw, LogOut, Check, ArrowRight,
  Laptop, Calendar, MapPin, Globe, Clock, Hash, ChevronRight
} from 'lucide-react';
import { UserDetails, RoleData, EffectivePermission } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

interface Props {
  user: UserDetails;
  availableRoles: RoleData[];
  onClose: () => void;
  onRefresh: () => void;
}

export const UserDetailsDrawer: React.FC<Props> = ({ user, availableRoles, onClose, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'permissions' | 'sessions' | 'history' | 'security' | 'audit'>('overview');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(user.roleAssignments.map(r => r.roleId));
  const [savingRoles, setSavingRoles] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateRoles = async () => {
    setSavingRoles(true);
    setStatusMessage(null);
    try {
      await systemAdminApi.updateUserRoles(user.id, selectedRoleIds);
      setStatusMessage({ text: 'User roles updated successfully.', type: 'success' });
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ text: err.response?.data?.message || 'Failed to update roles', type: 'error' });
    } finally {
      setSavingRoles(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm(`Reset password for ${user.fullName}? A temporary password will be generated.`)) return;
    setActionLoading(true);
    try {
      const res = await systemAdminApi.resetPassword(user.id);
      alert(`Password has been reset! Temporary Password: ${res.temporaryPassword}`);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleLock = async () => {
    setActionLoading(true);
    try {
      if (user.isLocked) {
        await systemAdminApi.unlockUser(user.id);
        setStatusMessage({ text: 'User account unlocked.', type: 'success' });
      } else {
        const reason = window.prompt('Enter reason for locking account:', 'Administrative security lockout');
        if (reason === null) {
          setActionLoading(false);
          return;
        }
        await systemAdminApi.lockUser(user.id, reason);
        setStatusMessage({ text: 'User account locked.', type: 'success' });
      }
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setActionLoading(true);
    try {
      if (user.isActive) {
        if (window.confirm(`Deactivate account for ${user.fullName}? All active sessions will be terminated.`)) {
          await systemAdminApi.deactivateUser(user.id);
          setStatusMessage({ text: 'Account deactivated.', type: 'success' });
        }
      } else {
        await systemAdminApi.activateUser(user.id);
        setStatusMessage({ text: 'Account activated.', type: 'success' });
      }
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceLogout = async () => {
    if (!window.confirm(`Force terminate all active sessions for ${user.fullName}?`)) return;
    setActionLoading(true);
    try {
      await systemAdminApi.forceLogout(user.id);
      setStatusMessage({ text: 'Active sessions terminated.', type: 'success' });
      onRefresh();
    } catch (err: any) {
      setStatusMessage({ text: err.response?.data?.message || 'Failed to force logout', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleRoleSelection = (rId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(rId) ? prev.filter(id => id !== rId) : [...prev, rId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in-50 duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header Banner */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.fullName}</h3>
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                  user.isLocked
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                    : user.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                }`}>
                  {user.isLocked ? 'Locked' : user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.requireMfa && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    MFA Required
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>@{user.username}</span>
                <span>•</span>
                <span>{user.email}</span>
                <span>•</span>
                <span>{user.employeeId || 'No ID'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2.5 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleLock}
              disabled={actionLoading}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                user.isLocked
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {user.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
              {user.isLocked ? 'Unlock Account' : 'Lock Account'}
            </button>

            <button
              onClick={handleResetPassword}
              disabled={actionLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              Reset Password
            </button>

            <button
              onClick={handleForceLogout}
              disabled={actionLoading}
              className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Force Logout
            </button>
          </div>

          <button
            onClick={handleToggleActive}
            disabled={actionLoading}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              user.isActive
                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold'
            }`}
          >
            {user.isActive ? 'Deactivate User' : 'Activate User'}
          </button>
        </div>

        {statusMessage && (
          <div className={`px-6 py-2.5 text-xs font-medium border-b flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'roles', label: `Roles (${user.roleAssignments.length})`, icon: Shield },
            { id: 'permissions', label: `Permissions (${user.effectivePermissions.length})`, icon: KeyRound },
            { id: 'sessions', label: `Sessions (${user.activeSessions.length})`, icon: Smartphone },
            { id: 'history', label: 'Login History', icon: History },
            { id: 'security', label: 'Security Events', icon: AlertTriangle },
            { id: 'audit', label: 'Audit Trail', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Company & Branch</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">{user.companyName || 'Not Assigned'}</div>
                  <div className="text-[11px] text-slate-500">{user.branchName}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Department</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">{user.departmentName || 'General'}</div>
                  <div className="text-[11px] text-slate-500">Employee ID: {user.employeeId || 'N/A'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Phone & Contact</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">{user.phoneNumber || 'N/A'}</div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Password Policy</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">{user.passwordPolicy}</div>
                  <div className="text-[11px] text-slate-500">
                    {user.mustChangePasswordOnNextLogin ? 'Must reset on next login' : 'Active credentials'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security & Authentication Status</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Last Login:</span>{' '}
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Last IP Address:</span>{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200">{user.lastLoginIp || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Account Provisioned:</span>{' '}
                    <span className="text-slate-800 dark:text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Allow Login:</span>{' '}
                    <span className={user.allowLogin ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                      {user.allowLogin ? 'Allowed' : 'Prohibited'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">RBAC Role Assignments</h4>
                  <p className="text-xs text-slate-500">Select roles to grant access permissions to this user</p>
                </div>
                <button
                  onClick={handleUpdateRoles}
                  disabled={savingRoles}
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {savingRoles ? 'Saving...' : 'Save Roles'}
                </button>
              </div>

              <div className="space-y-2.5">
                {availableRoles.map(r => {
                  const assigned = selectedRoleIds.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => toggleRoleSelection(r.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        assigned
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          assigned ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {assigned && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {r.name}
                            {r.isSystem && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                SYSTEM
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{r.description || r.code}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{r.permissionCount || r.permissions?.length || 0} permissions</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Effective Permissions Matrix</h4>
                  <p className="text-xs text-slate-500">Inherited through assigned roles and direct user assignments</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {user.effectivePermissions.length} Granted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {user.effectivePermissions.map(p => (
                  <div
                    key={p.permissionId}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{p.name || p.code}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.code}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        p.source === 'Role'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      }`}>
                        {p.source === 'Role' ? `Role: ${p.roleSource}` : 'Direct Override'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Concurrent Sessions</h4>
                  <p className="text-xs text-slate-500">Live devices connected with valid refresh tokens</p>
                </div>
                <button
                  onClick={handleForceLogout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Terminate All
                </button>
              </div>

              {user.activeSessions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No active login sessions found.</div>
              ) : (
                <div className="space-y-3">
                  {user.activeSessions.map(s => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {s.browser} on {s.operatingSystem}
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{s.ipAddress}</span>
                            <span>•</span>
                            <span>{s.location || 'Local Network'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 space-y-1">
                        <div>Login: {new Date(s.loginAt).toLocaleTimeString()}</div>
                        <div className="text-slate-500">Expires in 8h</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LOGIN HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Authentication Logs</h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5">Timestamp</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Device & Browser</th>
                      <th className="px-4 py-2.5">IP Address</th>
                      <th className="px-4 py-2.5">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {user.loginHistory.map(h => (
                      <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 text-slate-500">{new Date(h.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            h.status === 'Success'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                          }`}>
                            {h.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{h.device}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-500">{h.ipAddress}</td>
                        <td className="px-4 py-2.5 text-slate-500">{h.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY EVENTS */}
          {activeTab === 'security' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security & Risk Incidents</h4>
              <div className="space-y-2.5">
                {user.securityEvents.map(e => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        e.severity === 'High' || e.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-950/50'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {e.eventType}
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                            e.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {e.severity}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{e.description}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">IP: {e.ipAddress}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">{new Date(e.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT HISTORY */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Forensic Audit Activity</h4>
              <div className="space-y-2">
                {user.auditActivity.map(a => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{a.action}</div>
                      <div className="text-[11px] text-slate-500">{a.details}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">By: {a.performedBy}</div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{new Date(a.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
