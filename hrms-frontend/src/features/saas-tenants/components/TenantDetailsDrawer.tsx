import React, { useState } from 'react';
import {
  X, Building2, Users, CreditCard, Activity, Settings,
  Shield, Globe, KeyRound, CheckCircle2, AlertTriangle,
  Sliders, Calendar, UserPlus, LogOut, ArrowRight, Play, Pause, Trash2
} from 'lucide-react';
import { TenantDetails, SubscriptionPlanItem } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  tenant: TenantDetails | null;
  plans: SubscriptionPlanItem[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onImpersonate: (tenantId: string) => void;
}

export const TenantDetailsDrawer: React.FC<Props> = ({
  tenant,
  plans,
  isOpen,
  onClose,
  onRefresh,
  onImpersonate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'subscription' | 'usage' | 'settings' | 'features' | 'security' | 'domains'>('overview');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState('');
  const [planCycle, setPlanCycle] = useState('Monthly');
  const [planReason, setPlanReason] = useState('Plan change requested by customer');
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen || !tenant) return null;

  const handleChangePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanCode) return;
    setActionLoading(true);
    try {
      await tenantApi.changePlan(tenant.id, selectedPlanCode, planCycle, planReason);
      setShowPlanModal(false);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeature = async (featureKey: string, currentEnabled: boolean) => {
    const reason = window.prompt(`Reason for ${currentEnabled ? 'disabling' : 'enabling'} ${featureKey}:`, 'Administrative policy adjustment');
    if (!reason) return;

    try {
      await tenantApi.updateFeatureOverride(tenant.id, featureKey, !currentEnabled, reason);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update feature');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'users', label: `Users (${tenant.users.length})`, icon: Users },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'usage', label: 'Usage & Quotas', icon: Activity },
    { id: 'features', label: 'Feature Flags', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'domains', label: 'Domains & SSL', icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20">
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{tenant.name}</h2>
                <span className="font-mono text-xs text-slate-400 font-semibold">({tenant.code})</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  tenant.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : tenant.status === 'Trial'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                }`}>
                  {tenant.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {tenant.industry} • {tenant.country} • Plan: {tenant.currentSubscription?.planName || 'Standard'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onImpersonate(tenant.id)}
              className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-100 rounded-xl flex items-center gap-1.5 transition-colors border border-amber-200 dark:border-amber-800"
            >
              <KeyRound className="w-3.5 h-3.5" /> Impersonate
            </button>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-1 overflow-x-auto scrollbar-none bg-white dark:bg-slate-900">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-primary text-primary font-bold bg-primary/5 dark:bg-primary/10 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Total Users</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{tenant.usage.usersCount} / {tenant.maxUsers}</div>
                  <div className="text-[10px] text-slate-500">{tenant.usage.usersPercentage}% of quota</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Employees</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{tenant.usage.employeesCount} / {tenant.maxEmployees}</div>
                  <div className="text-[10px] text-slate-500">{tenant.usage.employeesPercentage}% of quota</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Storage Used</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{(tenant.storageUsedMb / 1024).toFixed(1)} GB</div>
                  <div className="text-[10px] text-slate-500">{tenant.storageQuotaGb} GB allocated</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Health Status</div>
                  <div className="text-xl font-black text-emerald-600">{tenant.usage.healthStatus}</div>
                  <div className="text-[10px] text-slate-500">100% SLA Uptime</div>
                </div>
              </div>

              {/* Organization Meta Details */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Organization Parameters</h3>
                <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                  <div><span className="text-slate-400">Legal Entity:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{tenant.legalName}</span></div>
                  <div><span className="text-slate-400">Timezone:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{tenant.timeZone}</span></div>
                  <div><span className="text-slate-400">Currency:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{tenant.currency}</span></div>
                  <div><span className="text-slate-400">Language:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{tenant.language}</span></div>
                  <div><span className="text-slate-400">Primary Contact:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{tenant.contactName} ({tenant.contactEmail})</span></div>
                  <div><span className="text-slate-400">Created:</span> <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1">{new Date(tenant.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* Operational Records Summary */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Operational Records Count</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-400 text-[11px]">Attendance Logs</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">{tenant.usage.attendanceRecordsCount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-400 text-[11px]">Leave Requests</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">{tenant.usage.leaveRequestsCount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-400 text-[11px]">Payroll Runs</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">{tenant.usage.payrollRunsCount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-400 text-[11px]">Workflows Active</div>
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">{tenant.usage.workflowsCount}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tenant Users Directory</h3>
                <span className="text-xs text-slate-500">{tenant.users.length} Registered Accounts</span>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {tenant.users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{u.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
                            {u.roleName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-white/20 uppercase tracking-wider">
                    {tenant.currentSubscription?.status || 'Active'} Subscription
                  </span>
                  <h3 className="text-2xl font-black mt-2">{tenant.currentSubscription?.planName || 'Enterprise'}</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Billed {tenant.currentSubscription?.billingCycle || 'Monthly'} at ${tenant.currentSubscription?.amount || 0}/cycle
                  </p>
                </div>

                <button
                  onClick={() => setShowPlanModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-sm transition-colors"
                >
                  Change Plan
                </button>
              </div>

              {/* Renewal Timeline Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Billing Timeline</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Current Period Start:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {tenant.currentSubscription?.currentPeriodStart ? new Date(tenant.currentSubscription.currentPeriodStart).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Next Renewal Date:</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {tenant.currentSubscription?.currentPeriodEnd ? new Date(tenant.currentSubscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USAGE & QUOTAS */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
                
                {/* User Quota */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">User Seats Capacity</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {tenant.usage.usersCount} / {tenant.maxUsers} ({tenant.usage.usersPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        tenant.usage.usersPercentage > 90 ? 'bg-rose-500' : tenant.usage.usersPercentage > 75 ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, tenant.usage.usersPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Employee Quota */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Employee Profiles</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {tenant.usage.employeesCount} / {tenant.maxEmployees} ({tenant.usage.employeesPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        tenant.usage.employeesPercentage > 90 ? 'bg-rose-500' : tenant.usage.employeesPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, tenant.usage.employeesPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Storage Quota */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">File Storage Capacity</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {(tenant.storageUsedMb / 1024).toFixed(1)} GB / {tenant.storageQuotaGb} GB ({tenant.usage.storagePercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        tenant.usage.storagePercentage > 90 ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, tenant.usage.storagePercentage)}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: FEATURE FLAGS */}
          {activeTab === 'features' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Per-Tenant Feature Flag Overrides</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Employees', 'Attendance', 'Leave', 'Payroll', 'Performance', 'Recruitment', 'LMS', 'Workflow', 'Notifications', 'AIAssistant'].map(mod => {
                  const ovr = tenant.featureOverrides.find(f => f.featureKey === mod);
                  const isEnabled = ovr ? ovr.isEnabled : true;
                  return (
                    <div
                      key={mod}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white">{mod} Module</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ovr ? `Override: ${ovr.reason}` : 'Inherited from Plan'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleFeature(mod, isEnabled)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                          isEnabled
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tenant Parameters</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
                {tenant.settings.map(s => (
                  <div key={s.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{s.key}</div>
                      <div className="text-[11px] text-slate-400">{s.description}</div>
                    </div>
                    <span className="font-mono px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === 'security' && tenant.securityPolicy && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">IAM & Security Baseline</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-400">Password Min Length:</span> <span className="font-bold ml-1">{tenant.securityPolicy.passwordMinLength} chars</span></div>
                  <div><span className="text-slate-400">MFA Policy:</span> <span className="font-bold ml-1">{tenant.securityPolicy.mfaRequirement}</span></div>
                  <div><span className="text-slate-400">Max Failed Logins:</span> <span className="font-bold ml-1">{tenant.securityPolicy.maxFailedAttempts} attempts</span></div>
                  <div><span className="text-slate-400">Lockout Duration:</span> <span className="font-bold ml-1">{tenant.securityPolicy.lockoutMinutes} mins</span></div>
                  <div><span className="text-slate-400">Session Timeout:</span> <span className="font-bold ml-1">{tenant.securityPolicy.sessionTimeoutMinutes} mins</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DOMAINS */}
          {activeTab === 'domains' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Custom Domains & SSL</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    {tenant.customDomain || `${tenant.code.toLowerCase()}.anraone.com`}
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-700">
                      SSL ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">CNAME target: ingress.anraone.com</div>
                </div>

                <span className="text-xs font-semibold text-emerald-600">Verified</span>
              </div>
            </div>
          )}

        </div>

        {/* Change Plan Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Change Tenant Subscription Plan</h3>
              <form onSubmit={handleChangePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Select New Tier</label>
                  <select
                    value={selectedPlanCode}
                    onChange={e => setSelectedPlanCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="">-- Choose Subscription Plan --</option>
                    {plans.map(p => (
                      <option key={p.code} value={p.code}>{p.name} (${p.monthlyPrice}/mo)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                  <select
                    value={planCycle}
                    onChange={e => setPlanCycle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual (Discounted)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm"
                  >
                    {actionLoading ? 'Updating...' : 'Update Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
