import React, { useState, useEffect } from 'react';
import {
  Building2, Users, CreditCard, Activity, Plus,
  DollarSign, HardDrive, ShieldAlert, Sparkles,
  BarChart3, RefreshCw, Sliders, Layers, TrendingUp, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  PlatformDashboardData, TenantDetails, SubscriptionPlanItem,
  ImpersonationSessionResult
} from '../types/tenant';
import { tenantApi } from '../api/tenantApi';
import { ImpersonationBanner } from '../components/ImpersonationBanner';
import { CreateTenantModal } from '../components/CreateTenantModal';
import { TenantDetailsDrawer } from '../components/TenantDetailsDrawer';
import { TenantList } from '../components/TenantList';
import { SubscriptionPlansManager } from '../components/SubscriptionPlansManager';
import { FeatureEntitlementsManager } from '../components/FeatureEntitlementsManager';
import { TenantUsageMonitor } from '../components/TenantUsageMonitor';
import { TenantReports } from '../components/TenantReports';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export const PlatformAdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<PlatformDashboardData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'entitlements' | 'usage' | 'reports'>('tenants');
  
  // Drawer and Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [impersonationSession, setImpersonationSession] = useState<ImpersonationSessionResult | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [dash, planList] = await Promise.all([
        tenantApi.getDashboard(),
        tenantApi.getPlans()
      ]);
      setDashboardData(dash);
      setPlans(planList);
    } catch (err) {
      console.error('Failed to load SaaS telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSelectTenant = async (id: string) => {
    try {
      const details = await tenantApi.getTenantById(id);
      setSelectedTenant(details);
      setIsDrawerOpen(true);
    } catch (err) {
      alert('Failed to load tenant details');
    }
  };

  const handleImpersonate = async (tenantId: string) => {
    const reason = window.prompt('Enter operational reason for tenant impersonation:', 'Technical diagnosis and customer support audit');
    if (!reason) return;

    try {
      const session = await tenantApi.startImpersonation(tenantId, reason);
      setImpersonationSession(session);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start impersonation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      
      {/* Impersonation Banner */}
      <ImpersonationBanner
        session={impersonationSession}
        onExit={() => setImpersonationSession(null)}
      />

      <div className="p-6 md:p-8 space-y-8 flex-1 max-w-[1600px] w-full mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                SaaS Platform Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">v4.2 Enterprise Multi-Tenant</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Multi-Tenant Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Global tenant orchestration, subscription lifecycle, quotas, and compliance sovereignty</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Provision New Tenant
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Tenants</span>
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.totalTenants}</div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {dashboardData.activeTenants} Active • {dashboardData.trialTenants} Trial
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Platform Users</span>
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.totalPlatformUsers}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {dashboardData.activePlatformUsers} Active Sessions Today
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Monthly Revenue (MRR)</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600">${dashboardData.monthlyRecurringRevenue.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                ARR: ${(dashboardData.annualRunRate / 1000).toFixed(1)}k
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Total Storage Used</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.totalStorageUsedGb} GB</div>
              <div className="text-[10px] text-slate-400 font-mono">Multi-tenant S3 quota</div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Conversion / Churn</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{dashboardData.trialConversionRate}%</div>
              <div className="text-[10px] text-emerald-600 font-bold">
                Churn: {dashboardData.churnRate}% • 0 Past Due
              </div>
            </div>

          </div>
        )}

        {/* Visual Charts Row */}
        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Tenant Growth Trend */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tenant Growth Trend</h3>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">+100% YTD</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.tenantGrowth}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="totalTenants" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGrad)" name="Total Tenants" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Recurring Revenue Trend */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">MRR Expansion ($)</h3>
                <span className="text-[10px] font-mono text-slate-400">Monthly Run</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.revenueTrend}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                    <Bar dataKey="mrr" fill="#10b981" radius={[6, 6, 0, 0]} name="MRR ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Subscription Tier Breakdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Tenants By Plan Tier</h3>
                <span className="text-[10px] font-mono text-slate-400">{plans.length} Tiers</span>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.tenantsByPlan}
                      dataKey="count"
                      nameKey="planName"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {dashboardData.tenantsByPlan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'tenants'
                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Tenant Directory
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'plans'
                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Subscription Plans
          </button>

          <button
            onClick={() => setActiveTab('entitlements')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'entitlements'
                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" /> Feature Entitlements
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'usage'
                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Usage & Limits
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'reports'
                ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10 rounded-t-2xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> SaaS Reports
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="space-y-6">
          {activeTab === 'tenants' && (
            <TenantList
              onSelectTenant={handleSelectTenant}
              onImpersonate={handleImpersonate}
            />
          )}

          {activeTab === 'plans' && (
            <SubscriptionPlansManager
              plans={plans}
              onRefresh={fetchDashboardData}
            />
          )}

          {activeTab === 'entitlements' && (
            <FeatureEntitlementsManager
              plans={plans}
            />
          )}

          {activeTab === 'usage' && (
            <TenantUsageMonitor
              data={dashboardData}
            />
          )}

          {activeTab === 'reports' && (
            <TenantReports
              data={dashboardData}
            />
          )}
        </div>

      </div>

      {/* Provision New Tenant Modal */}
      <CreateTenantModal
        plans={plans}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      {/* 10-Tab Tenant Details Drawer */}
      <TenantDetailsDrawer
        tenant={selectedTenant}
        plans={plans}
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setSelectedTenant(null); }}
        onRefresh={() => {
          if (selectedTenant) handleSelectTenant(selectedTenant.id);
          fetchDashboardData();
        }}
        onImpersonate={handleImpersonate}
      />

    </div>
  );
};
export default PlatformAdminDashboard;
