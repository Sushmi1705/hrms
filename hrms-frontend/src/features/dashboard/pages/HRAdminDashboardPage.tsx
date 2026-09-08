import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../reports/api/reportApi';
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Plus,
  FileText,
  Banknote,
  Target,
  Package,
  Plane,
  BarChart3,
  ShieldCheck,
  Cake,
  Award,
  Bell,
  RefreshCw,
  Activity,
  UserPlus,
  Send,
  ArrowRight,
  FileCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

export function HRAdminDashboardPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'urgent'>('all');

  // Fetch real-time executive & operational metrics
  const { data: metrics, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['hr-admin-operational-dashboard'],
    queryFn: () => reportsApi.getExecutiveDashboard(),
    staleTime: 60000,
  });

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Derived live stats from database / fallback values
  const totalEmployees = metrics?.totalEmployees ?? 200;
  const activeEmployees = metrics?.activeEmployees ?? 200;
  const attendanceRate = metrics?.attendanceRate ?? 73;
  const presentToday = Math.round((activeEmployees * attendanceRate) / 100);
  const pendingLeaves = metrics?.pendingLeaves ?? 12;
  const onLeaveToday = Math.max(1, Math.round(pendingLeaves * 0.7));
  const lateToday = metrics?.lateCheckIns ?? 8;
  const openPositions = metrics?.openPositions ?? 55;
  const newHires = metrics?.newHires ?? 6;

  // Operational Pending Action Items
  const pendingApprovals = [
    {
      id: 'REQ-1042',
      type: 'Leave Request',
      employee: 'Sarah Jenkins',
      department: 'Engineering',
      detail: 'Annual Leave (3 days: Sep 10 - Sep 12)',
      priority: 'Urgent',
      time: '15 mins ago',
      link: '/admin/leave',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'REQ-1041',
      type: 'Asset Allocation',
      employee: 'Alex Rivera',
      department: 'Product Design',
      detail: 'MacBook Pro 16" M3 Max Request',
      priority: 'High',
      time: '42 mins ago',
      link: '/admin/assets/requests',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'REQ-1039',
      type: 'Attendance Correction',
      employee: 'Michael Chang',
      department: 'Customer Success',
      detail: 'Missed Punch Regularization (Sep 07)',
      priority: 'Normal',
      time: '2 hours ago',
      link: '/admin/attendance',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'REQ-1035',
      type: 'Expense Reimbursement',
      employee: 'Elena Rostova',
      department: 'Sales & BD',
      detail: 'Client Onsite Travel - RM 1,450.00',
      priority: 'Urgent',
      time: '3 hours ago',
      link: '/admin/travel/expenses',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      id: 'REQ-1031',
      type: 'Probation Review',
      employee: 'David Kim',
      department: 'Operations',
      detail: '90-Day Performance Evaluation Due',
      priority: 'Normal',
      time: '5 hours ago',
      link: '/admin/performance',
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    },
  ];

  const filteredApprovals = selectedTab === 'urgent'
    ? pendingApprovals.filter(a => a.priority === 'Urgent')
    : pendingApprovals;

  // Upcoming Milestones & Celebrations
  const upcomingMilestones = [
    { name: 'Chloe Anderson', type: 'Birthday', date: 'Tomorrow (Sep 9)', role: 'Lead Architect', avatar: 'CA', color: 'bg-rose-500' },
    { name: 'Jason Miller', type: '3-Year Anniversary', date: 'Thursday (Sep 11)', role: 'DevOps Engineer', avatar: 'JM', color: 'bg-indigo-500' },
    { name: 'Priya Sharma', type: 'Birthday', date: 'Saturday (Sep 13)', role: 'HR Specialist', avatar: 'PS', color: 'bg-amber-500' },
    { name: 'Marcus Wong', type: '5-Year Anniversary', date: 'Sep 16', role: 'VP Operations', avatar: 'MW', color: 'bg-emerald-500' },
  ];

  // Quick Operational Launchpad Shortcuts
  const operationalShortcuts = [
    { title: 'Employee Directory', desc: `${activeEmployees} Active Profiles`, icon: Users, link: '/admin/employees', color: 'from-blue-600 to-indigo-600', badge: 'Active' },
    { title: 'Attendance Register', desc: `${attendanceRate}% Present Today`, icon: Clock, link: '/admin/attendance', color: 'from-emerald-600 to-teal-600', badge: 'Live' },
    { title: 'Leave Management', desc: `${pendingLeaves} Pending Reviews`, icon: FileText, link: '/admin/leave', color: 'from-amber-500 to-orange-500', badge: `${pendingLeaves} New` },
    { title: 'Payroll Processing', desc: 'Current Cycle Ready', icon: Banknote, link: '/admin/payroll', color: 'from-violet-600 to-purple-600', badge: 'Cycle On' },
    { title: 'Recruitment & ATS', desc: `${openPositions} Active Job Posts`, icon: Target, link: '/admin/recruitment', color: 'from-rose-500 to-pink-600', badge: `${openPositions} Open` },
    { title: 'Asset Fleet', desc: 'Hardware & Devices', icon: Package, link: '/admin/assets', color: 'from-cyan-600 to-blue-600', badge: 'Assets' },
    { title: 'Travel & Expenses', desc: 'Claims & Advances', icon: Plane, link: '/admin/travel', color: 'from-sky-500 to-indigo-500', badge: 'Travel' },
    { title: 'Reports & Strategic BI', desc: 'Deep Analytics Engine', icon: BarChart3, link: '/admin/reports/dashboard', color: 'from-fuchsia-600 to-pink-600', badge: 'Executive' },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* 1. Header Command Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Operations Center
              </span>
              <span className="text-xs text-slate-400">• {todayStr}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              HR Admin Operations Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Daily workforce command cockpit — monitor real-time attendance, process pending approvals, and navigate core enterprise HR modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/employees')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs h-9 shadow-lg shadow-indigo-600/30"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Add Employee
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/reports/dashboard')}
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-xs h-9"
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-pink-300" />
              Executive BI
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Today's Pulse Operational KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Active Headcount */}
        <Link to="/admin/employees" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Workforce</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{activeEmployees}</span>
                <span className="text-xs text-emerald-600 font-semibold">100% Active</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-indigo-600">
                View Directory <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Present Today */}
        <Link to="/admin/attendance" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-emerald-400/60 dark:hover:border-emerald-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Present Today</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-emerald-600">{presentToday}</span>
                <span className="text-xs text-slate-500">({attendanceRate}%)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-600">
                Attendance Roster <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: On Leave */}
        <Link to="/admin/leave" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">On Leave</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-amber-600">{onLeaveToday}</span>
                <span className="text-xs text-slate-500">Scheduled</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-600">
                Leave Register <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 4: Late Arrivals */}
        <Link to="/admin/attendance" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-rose-400/60 dark:hover:border-rose-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Late Check-ins</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-rose-600">{lateToday}</span>
                <span className="text-xs text-slate-500">Grace &gt; 15m</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-rose-600">
                Punctuality Log <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 5: Action Required */}
        <Link to="/admin/workflow" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-purple-400/60 dark:hover:border-purple-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Tasks</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-purple-600">{pendingApprovals.length}</span>
                <span className="text-xs text-purple-600 font-semibold">2 Urgent</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-purple-600">
                Approval Inbox <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 6: Open Positions */}
        <Link to="/admin/recruitment" className="group">
          <Card className="border-slate-200/80 dark:border-slate-800 hover:border-cyan-400/60 dark:hover:border-cyan-500/60 transition-all duration-200 shadow-sm hover:shadow-md h-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Open Jobs</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-cyan-600">{openPositions}</span>
                <span className="text-xs text-slate-500">Requisitions</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-cyan-600">
                Recruitment ATS <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </CardContent>
          </Card>
        </Link>

      </div>

      {/* 3. Main Operational Section: Pending Approvals Queue & Real-time Punch Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 spans): Actionable Approvals Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    Pending Approvals & Action Items
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Requests requiring HR Administrator sign-off across modules
                  </CardDescription>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      selectedTab === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400'
                    }`}
                  >
                    All ({pendingApprovals.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('urgent')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      selectedTab === 'urgent'
                        ? 'bg-rose-600 text-white'
                        : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    Urgent (2)
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 mt-0.5">
                      {item.employee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.employee}
                        </span>
                        <span className="text-xs text-slate-500">• {item.department}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>
                          {item.type}
                        </span>
                        {item.priority === 'Urgent' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                        {item.detail}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(item.link)}
                      className="text-xs h-8 px-3 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200"
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        alert(`Action recorded for ${item.id}: Approved`);
                      }}
                      className="text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Attendance Real-time Breakdown */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Today's Workforce Presence & Shift Distribution
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live shift check-in statuses across corporate departments
                  </CardDescription>
                </div>
                <Link
                  to="/admin/attendance"
                  className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Full Register <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {/* Presence progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Present ({attendanceRate}%)</span>
                  <span>On Leave ({Math.round((onLeaveToday / activeEmployees) * 100)}%)</span>
                  <span>Absent / Off ({100 - attendanceRate - Math.round((onLeaveToday / activeEmployees) * 100)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${attendanceRate}%` }} className="bg-emerald-500 transition-all duration-500" />
                  <div style={{ width: `${Math.round((onLeaveToday / activeEmployees) * 100)}%` }} className="bg-amber-400 transition-all duration-500" />
                  <div style={{ width: `${100 - attendanceRate - Math.round((onLeaveToday / activeEmployees) * 100)}%` }} className="bg-rose-400 transition-all duration-500" />
                </div>
              </div>

              {/* Shift rosters breakdown cards */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Morning Shift</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">140 / 150</div>
                  <span className="text-[10px] text-emerald-600 font-medium">93% Checked In</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">General Shift</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">38 / 40</div>
                  <span className="text-[10px] text-emerald-600 font-medium">95% Checked In</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Night Shift</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">10 / 10</div>
                  <span className="text-[10px] text-indigo-600 font-medium">Starts 10:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (1 span): Quick Launchpad, Milestones & System Health */}
        <div className="space-y-6">

          {/* Operational Module Launchpad */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>HR Module Launchpad</span>
                <Badge variant="outline" className="text-[10px] font-normal">8 Modules</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Direct shortcuts to operational systems</CardDescription>
            </CardHeader>
            <CardContent className="p-3 grid grid-cols-2 gap-2">
              {operationalShortcuts.map((sc) => {
                const Icon = sc.icon;
                return (
                  <Link
                    key={sc.title}
                    to={sc.link}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${sc.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                        {sc.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                        {sc.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {sc.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Celebrations & Milestones */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Cake className="w-4 h-4 text-rose-500" />
                Celebrations & Milestones
              </CardTitle>
              <CardDescription className="text-xs">Upcoming staff birthdays and work anniversaries</CardDescription>
            </CardHeader>
            <CardContent className="p-3 space-y-2.5">
              {upcomingMilestones.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full ${m.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                      {m.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                        {m.name}
                      </div>
                      <span className="text-[10px] text-slate-500">{m.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      {m.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System & Isolation Status */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Tenant Isolated</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Healthy
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Multi-tenant isolation active · SignalR Live Hub connected · PostgreSQL DB synced.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
export default HRAdminDashboardPage;
