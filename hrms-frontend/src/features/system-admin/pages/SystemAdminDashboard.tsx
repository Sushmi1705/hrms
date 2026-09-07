import React, { useState, useEffect } from 'react';
import {
  Users, Shield, KeyRound, Lock, Unlock, UserPlus, Settings,
  Activity, Zap, Mail, Calendar, Smartphone, FileText, Download,
  Sliders, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight,
  TrendingUp, Building2, Layers, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { systemAdminApi } from '../api/systemAdminApi';
import { AdminDashboardData, RoleData, PermissionData } from '../types/systemAdmin';
import { UserManagement } from '../components/UserManagement';
import { RoleManagement } from '../components/RoleManagement';
import { PermissionMatrix } from '../components/PermissionMatrix';
import { SystemSettingsManager } from '../components/SystemSettingsManager';
import { SecuritySettings } from '../components/SecuritySettings';
import { EmailSettings } from '../components/EmailSettings';
import { FeatureFlagsManager } from '../components/FeatureFlagsManager';
import { HolidayCalendarSettings } from '../components/HolidayCalendarSettings';
import { SessionManagement } from '../components/SessionManagement';
import { BackgroundJobsManager } from '../components/BackgroundJobsManager';
import { SystemHealth } from '../components/SystemHealth';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

export const SystemAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dash, rList, pList] = await Promise.all([
        systemAdminApi.getDashboard(),
        systemAdminApi.getRoles(),
        systemAdminApi.getPermissionsCatalog()
      ]);
      setDashboardData(dash);
      setRoles(rList);
      setPermissions(pList);
    } catch (err) {
      console.error('Failed to load system admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'matrix', label: 'Permission Matrix', icon: KeyRound },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security Baseline', icon: ShieldCheck },
    { id: 'email', label: 'Email SMTP', icon: Mail },
    { id: 'flags', label: 'Feature Flags', icon: Sliders },
    { id: 'calendars', label: 'Holiday Calendars', icon: Calendar },
    { id: 'sessions', label: 'Active Sessions', icon: Smartphone },
    { id: 'jobs', label: 'Background Jobs', icon: Zap },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wider">
              Administration Core
            </span>
            <span className="text-xs text-slate-400">• Security & Access Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            System Administration & Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized orchestration of IAM, RBAC matrices, hierarchical parameters, security policies, and background daemons
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href={systemAdminApi.getExportUrl('audit', 'csv')}
            download
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit
          </a>

          <button
            onClick={fetchAllData}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 rounded-2xl shadow-sm gap-1 overflow-x-auto scrollbar-none">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                active
                  ? 'border-primary text-primary font-bold bg-primary/5 dark:bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-xl'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB: DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Total Users</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.totalUsers}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">{dashboardData.activeUsers} Active Accounts</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Locked / Inactive</span>
                <Lock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {dashboardData.lockedUsers + dashboardData.inactiveUsers}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold">{dashboardData.lockedUsers} Locked Accounts</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Admins & HR</span>
                <Shield className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {dashboardData.adminUsers + dashboardData.hrUsers}
              </div>
              <div className="text-[10px] text-purple-600 font-semibold">{dashboardData.adminUsers} Super/System Admins</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Active Roles</span>
                <Layers className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.activeRoles}</div>
              <div className="text-[10px] text-blue-600 font-semibold">{dashboardData.activePermissions} Granular Grants</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Pending Invites</span>
                <Mail className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.pendingInvitations}</div>
              <div className="text-[10px] text-cyan-600 font-semibold">First-time Reset Req.</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-semibold">Security Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.securityAlertsCount}</div>
              <div className="text-[10px] text-rose-600 font-semibold">Forensic Events</div>
            </div>

          </div>

          {/* Charts Row 1: Growth & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Growth Area Chart */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">User Growth & Active Directory</h3>
                  <p className="text-xs text-slate-400">Historical user account provisioning over past 6 months</p>
                </div>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.userGrowth}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="usersCount" name="Total Users" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" />
                    <Area type="monotone" dataKey="activeCount" name="Active Users" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#activeGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Login Activity Bar Chart */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daily Authentication Volume</h3>
                  <p className="text-xs text-slate-400">Successful vs Failed login attempts over the week</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.loginActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="successLogins" name="Successful Logins" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="failedLogins" name="Failed Attempts" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2: Distribution & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Roles Distribution Donut */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">User Distribution by Role</h3>
                <p className="text-xs text-slate-400 mb-2">RBAC role assignments across directory</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.usersByRole}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {dashboardData.usersByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {dashboardData.usersByRole.slice(0, 4).map((r, i) => (
                  <div key={r.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[130px]">{r.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{r.count} ({r.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Breakdown Bar Chart */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Users by Department</h3>
                <p className="text-xs text-slate-400 mb-2">Organizational headcount allocation</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.usersByDepartment} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={85} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Top Dept: Engineering</span>
                <span>{dashboardData.usersByDepartment[0]?.count || 0} Members</span>
              </div>
            </div>

            {/* Recent Administrative Activity Feed */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Admin Activity</h3>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
                  {dashboardData.recentAdminActivity.map(act => (
                    <div key={act.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{act.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{act.details}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>By: {act.performedBy}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 font-mono text-[9px]">
                          {act.targetType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('users')}
                className="w-full mt-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                View User Directory <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER SUB-MODULE TABS */}
      {/* ========================================================================= */}
      {activeTab === 'users' && <UserManagement roles={roles} />}
      {activeTab === 'roles' && (
        <RoleManagement
          roles={roles}
          permissions={permissions}
          onRefresh={fetchAllData}
          onOpenMatrix={() => setActiveTab('matrix')}
        />
      )}
      {activeTab === 'matrix' && <PermissionMatrix roles={roles} />}
      {activeTab === 'settings' && <SystemSettingsManager />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'email' && <EmailSettings />}
      {activeTab === 'flags' && <FeatureFlagsManager />}
      {activeTab === 'calendars' && <HolidayCalendarSettings />}
      {activeTab === 'sessions' && <SessionManagement />}
      {activeTab === 'jobs' && <BackgroundJobsManager />}
      {activeTab === 'health' && <SystemHealth />}

    </div>
  );
};
