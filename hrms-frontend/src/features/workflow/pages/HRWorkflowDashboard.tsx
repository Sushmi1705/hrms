import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  GitBranch,
  Inbox,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Plus,
  ShieldCheck,
  XCircle,
  Eye,
  ArrowRight,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { WorkflowList } from '../components/WorkflowList';
import { VisualWorkflowDesigner } from '../components/VisualWorkflowDesigner';
import { ApprovalInbox } from '../components/ApprovalInbox';
import { MyApprovals } from '../components/MyApprovals';
import { DelegationManagement } from '../components/DelegationManagement';
import { EscalationTracker } from '../components/EscalationTracker';
import { WorkflowTemplates } from '../components/WorkflowTemplates';
import { WorkflowReports } from '../components/WorkflowReports';
import { ApprovalDetailsDrawer } from '../components/ApprovalDetailsDrawer';

import { WorkflowDashboardAnalytics, WorkflowDefinition } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export function HRWorkflowDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [stats, setStats] = useState<WorkflowDashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');

  // Drawer and Designer state
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [designerWorkflow, setDesignerWorkflow] = useState<WorkflowDefinition | null>(null);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getDashboardAnalytics(departmentFilter, moduleFilter);
      setStats(res);
    } catch (err) {
      console.error('Failed to load workflow dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [departmentFilter, moduleFilter]);

  const handleEditWorkflow = (wf: WorkflowDefinition) => {
    setDesignerWorkflow(wf);
    setIsDesignerOpen(true);
    setActiveTab('workflows');
  };

  const handleCreateWorkflow = () => {
    setDesignerWorkflow(null);
    setIsDesignerOpen(true);
    setActiveTab('workflows');
  };

  const handleTemplateInstantiated = (created: WorkflowDefinition) => {
    setDesignerWorkflow(created);
    setIsDesignerOpen(true);
    setActiveTab('workflows');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <GitBranch className="w-7 h-7 text-primary" />
            Universal Workflow & Approval Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise multi-stage approval orchestration, SLA enforcement, and automated proxy routing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleCreateWorkflow}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Workflow
          </Button>
          <Button variant="outline" size="icon" onClick={loadStats} title="Refresh Live Data">
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/90 dark:bg-slate-900 p-1 rounded-xl flex flex-wrap h-auto gap-1 border border-slate-200/80 dark:border-slate-800">
          <TabsTrigger value="dashboard" className="text-xs font-semibold px-3.5 py-2">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="inbox" className="text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5">
            <Inbox className="w-3.5 h-3.5" />
            Approval Inbox
            {stats && stats.pendingApprovals > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                {stats.pendingApprovals}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="my-approvals" className="text-xs font-semibold px-3.5 py-2">
            My Approvals
          </TabsTrigger>
          <TabsTrigger value="workflows" className="text-xs font-semibold px-3.5 py-2">
            Workflow Catalog & Designer
          </TabsTrigger>
          <TabsTrigger value="delegations" className="text-xs font-semibold px-3.5 py-2">
            Delegations
          </TabsTrigger>
          <TabsTrigger value="escalations" className="text-xs font-semibold px-3.5 py-2">
            SLA Escalations
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs font-semibold px-3.5 py-2">
            Templates
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs font-semibold px-3.5 py-2">
            Reports
          </TabsTrigger>
        </TabsList>

        {/* 1. DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6 mt-0">
          {/* Summary Stat Cards Grid */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="shadow-sm border-l-4 border-l-primary">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalWorkflows}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {stats.activeWorkflows} Active • {stats.draftWorkflows} Draft
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingApprovals}</div>
                  <p className="text-[11px] text-amber-600 font-medium mt-0.5">Across all departments</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-emerald-500">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Approved Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.approvedToday}</div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    SLA Compliance: {stats.slaSuccessRatePercentage}%
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-rose-500">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    SLA Escalations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.escalatedApprovals}</div>
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                    {stats.overdueApprovals} Overdue limits
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Avg Approval Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.averageApprovalTimeHours}h
                  </div>
                  <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Target SLA &lt; 24h</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Interactive Recharts Grid */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Approval Volume Trend (Area Chart) */}
              <Card className="lg:col-span-8 shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Approval & Rejection Volume Trend</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Monthly throughput across all organizational units.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Live Telemetry
                  </Badge>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.approvalTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area
                          type="monotone"
                          dataKey="approved"
                          name="Approved"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#approvedGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="pending"
                          name="Pending"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fill="url(#pendingGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Status Breakdown (Donut Chart) */}
              <Card className="lg:col-span-4 shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base font-bold">Status Breakdown</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Instance lifecycle distribution</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.statusDistribution}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {stats.statusDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    {stats.statusDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[idx % STATUS_COLORS.length] }}
                        />
                        <span className="text-slate-600 truncate">{item.status}</span>
                        <span className="font-bold ml-auto">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Volume By Module (Bar Chart) */}
              <Card className="lg:col-span-6 shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base font-bold">Workflow Volume by Module</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Total requests routed per functional module</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.volumeByModule} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="module" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="count" name="Total Requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Department Distribution (Bar Chart) */}
              <Card className="lg:col-span-6 shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base font-bold">Department Request Distribution</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Top business units generating requests</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.departmentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="department" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="requestCount" name="Requests" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pendingCount" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Recent Activity Feed */}
          {stats && stats.recentActivities && stats.recentActivities.length > 0 && (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Live Workflow Audit Stream
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Real-time events streaming from the workflow engine.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {stats.recentActivities.map((act) => (
                    <div key={act.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-900/30">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            act.eventType === 'Approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : act.eventType === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : act.eventType === 'Escalated'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {act.eventType === 'Approved' ? '✓' : act.eventType === 'Rejected' ? '✕' : '●'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{act.title}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {act.status}
                            </Badge>
                          </div>
                          <p className="text-slate-500 mt-0.5">{act.description}</p>
                          <div className="text-[10px] text-slate-400 mt-0.5">Actor: {act.actorName}</div>
                        </div>
                      </div>
                      <div className="text-slate-400 whitespace-nowrap text-[11px]">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 2. APPROVAL INBOX TAB */}
        <TabsContent value="inbox" className="mt-0">
          <ApprovalInbox onSelectRequest={(reqId) => setSelectedRequestId(reqId)} />
        </TabsContent>

        {/* 3. MY APPROVALS TAB */}
        <TabsContent value="my-approvals" className="mt-0">
          <MyApprovals onSelectRequest={(reqId) => setSelectedRequestId(reqId)} />
        </TabsContent>

        {/* 4. WORKFLOW DEFINITIONS & DESIGNER TAB */}
        <TabsContent value="workflows" className="mt-0">
          {isDesignerOpen ? (
            <VisualWorkflowDesigner
              initialWorkflow={designerWorkflow}
              onClose={() => setIsDesignerOpen(false)}
              onSaved={() => {
                setIsDesignerOpen(false);
                loadStats();
              }}
            />
          ) : (
            <WorkflowList onEdit={handleEditWorkflow} onCreate={handleCreateWorkflow} />
          )}
        </TabsContent>

        {/* 5. DELEGATIONS TAB */}
        <TabsContent value="delegations" className="mt-0">
          <DelegationManagement />
        </TabsContent>

        {/* 6. ESCALATIONS TAB */}
        <TabsContent value="escalations" className="mt-0">
          <EscalationTracker />
        </TabsContent>

        {/* 7. TEMPLATES TAB */}
        <TabsContent value="templates" className="mt-0">
          <WorkflowTemplates onTemplateInstantiated={handleTemplateInstantiated} />
        </TabsContent>

        {/* 8. REPORTS TAB */}
        <TabsContent value="reports" className="mt-0">
          <WorkflowReports />
        </TabsContent>
      </Tabs>

      {/* Slide-over Approval Details Drawer */}
      <ApprovalDetailsDrawer
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onActionComplete={() => {
          loadStats();
        }}
      />
    </div>
  );
}
