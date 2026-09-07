import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, Play, Square, Calendar, CalendarCheck, FileText, 
  Shield, AlertCircle, Bell, ArrowUpRight, DollarSign, Laptop, 
  CheckCircle2, Sparkles, ChevronRight, User, Plus, Building, 
  MapPin, HeartPulse, HelpCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EmployeeDashboardData } from '../types/ess';

export const EmployeeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  // Quick Action Modals
  const [showClockModal, setShowClockModal] = useState(false);
  const [punchNotes, setPunchNotes] = useState('');

  const fetchDashboard = () => {
    setLoading(true);
    essApi.getDashboard()
      .then(res => setData(res))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load employee dashboard data');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const res = await essApi.clockIn({ notes: punchNotes });
      toast.success(res.message || 'Clocked in successfully!');
      setShowClockModal(false);
      setPunchNotes('');
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clock in');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      const res = await essApi.clockOut({ notes: punchNotes });
      toast.success(res.message || 'Clocked out successfully!');
      setShowClockModal(false);
      setPunchNotes('');
      fetchDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clock out');
    } finally {
      setClockLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isClockedIn = data.todayAttendance?.isClockedIn;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. PERSONALIZED HERO GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 md:p-8 shadow-xl border border-indigo-700/50">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={data.avatarUrl} 
                alt={data.fullName}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-white/20 bg-indigo-950/40 p-1 shadow-lg"
              />
              <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-indigo-900 ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30 hover:bg-indigo-500/30 font-medium">
                  {data.employeeNumber}
                </Badge>
                <Badge variant="outline" className="text-indigo-200 border-indigo-400/30">
                  {data.status || 'Active Staff'}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome, {data.firstName}!
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-indigo-200/90 text-sm mt-1">
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {data.departmentName}</span>
                <span>•</span>
                <span>{data.designationTitle}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.workLocation}</span>
              </div>
            </div>
          </div>

          {/* Right Live Time & Punch Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full md:w-auto">
            <div>
              <p className="text-xs text-indigo-200 font-medium">{data.todayFormatted}</p>
              <p className="text-2xl font-mono font-bold tracking-tight text-white">
                {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-xs text-indigo-300">
                {isClockedIn ? `Clocked in • ${data.todayAttendance.workedDuration}` : 'Not clocked in today'}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => isClockedIn ? handleClockOut() : handleClockIn()}
              disabled={clockLoading}
              className={`font-semibold shadow-lg transition-all ${
                isClockedIn 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isClockedIn ? (
                <>
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  Clock Out
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Clock In
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS TOOLBAR */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Employee Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/attendance')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <Clock className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Web Clock</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/leave')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <CalendarCheck className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Apply Leave</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/payroll')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <DollarSign className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">View Payslip</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/assets')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <Laptop className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">My Assets</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/documents')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <FileText className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Documents</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={() => navigate('/employee/requests')}
            className="h-20 flex-col gap-2 rounded-2xl bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <HelpCircle className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">HR Helpdesk</span>
          </Button>
        </div>
      </div>

      {/* 3. 6 PRIMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Leave Days</span>
              <CalendarCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.remainingLeaveDays}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Available to take
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Days Present</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.attendanceDaysThisMonth}
            </p>
            <p className="text-[11px] text-slate-500">This month</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Pending Requests</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.pendingRequestsCount}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Assigned Hardware</span>
              <Laptop className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.assignedAssetsCount}
            </p>
            <p className="text-[11px] text-slate-500">In your custody</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Next Holiday</span>
              <Calendar className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-base font-bold truncate text-slate-900 dark:text-white" title={data.nextHolidayName || 'No upcoming'}>
              {data.nextHolidayName || 'None'}
            </p>
            <p className="text-[11px] text-slate-500">
              {data.nextHolidayDate ? new Date(data.nextHolidayDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Upcoming'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Active Benefits</span>
              <HeartPulse className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {data.activeBenefits?.length || 0}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Covered</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. MAIN WIDGETS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget: Today's Shift & Punch Details */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 dark:bg-slate-800/40 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Today's Attendance & Shift
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Assigned Shift: {data.todayAttendance.shiftName} ({data.todayAttendance.shiftTimings})
                  </CardDescription>
                </div>
                <Badge className={isClockedIn ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}>
                  {data.todayAttendance.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-500 font-medium">Check-In Time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {data.todayAttendance.clockInTime ? new Date(data.todayAttendance.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-500 font-medium">Check-Out Time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {data.todayAttendance.clockOutTime ? new Date(data.todayAttendance.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-500 font-medium">Hours Logged</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {data.todayAttendance.workedDuration}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs text-slate-500 font-medium">Punctuality</p>
                  <p className={`text-lg font-bold mt-1 ${data.todayAttendance.isLate ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {data.todayAttendance.isLate ? 'Late Punch' : 'On Time'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Location: {data.workLocation} (Geo-verified IP)</span>
                <Button variant="link" size="sm" onClick={() => navigate('/employee/attendance')} className="p-0 text-indigo-600 h-auto font-medium">
                  View Full Monthly Timesheet <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Widget: Leave Balances */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Leave Balances ({new Date().getFullYear()})
                </CardTitle>
                <CardDescription className="text-xs">
                  Allocated, consumed, and remaining annual leave quotas
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/employee/leave')} className="rounded-xl text-xs">
                Apply Leave
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.leaveBalances?.map((bal) => {
                  const pct = bal.totalAllocated > 0 ? Math.round((bal.remaining / bal.totalAllocated) * 100) : 0;
                  return (
                    <div key={bal.leaveTypeId} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{bal.leaveTypeName}</span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {bal.remaining}d left
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: bal.colorCode || '#6366f1' }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Used: {bal.used}d</span>
                        <span>Total: {bal.totalAllocated}d</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Widget: Assigned Hardware Assets */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  My Assigned Hardware Assets
                </CardTitle>
                <CardDescription className="text-xs">
                  Company equipment registered in your custody
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/employee/assets')} className="rounded-xl text-xs">
                Asset Portal
              </Button>
            </CardHeader>
            <CardContent>
              {data.assignedAssets?.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No hardware currently assigned.</p>
              ) : (
                <div className="space-y-3">
                  {data.assignedAssets?.map(asset => (
                    <div key={asset.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{asset.assetName}</p>
                          <p className="text-xs text-slate-500">Tag: {asset.assetTag} • S/N: {asset.serialNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs font-normal border-purple-200 text-purple-700 dark:text-purple-300">
                          {asset.condition}
                        </Badge>
                        <p className="text-[11px] text-slate-400 mt-1">Assigned {new Date(asset.assignedDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COL */}
        <div className="space-y-6">
          {/* Widget: Recent Payslip */}
          {data.recentPayslip && (
            <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-gradient-to-b from-emerald-50/40 to-transparent dark:from-emerald-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Recent Payslip
                  </CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-emerald-300">
                    {data.recentPayslip.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Pay Cycle: {data.recentPayslip.month}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-xs text-slate-500">Net Disbursed Take-Home</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    ${data.recentPayslip.netSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">Gross Pay:</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">${data.recentPayslip.grossSalary.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Deductions:</span>
                      <p className="font-semibold text-rose-600">-${data.recentPayslip.totalDeductions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  onClick={() => navigate('/employee/payroll')}
                >
                  View Digital Payslip & Breakdown
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Widget: Upcoming Holidays */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                Upcoming Holidays
              </CardTitle>
              <CardDescription className="text-xs">
                Official paid corporate closures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.upcomingHolidays?.slice(0, 3).map((hol) => (
                  <div key={hol.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex flex-col items-center justify-center text-center font-bold">
                        <span className="text-[9px] uppercase tracking-wider">{new Date(hol.date).toLocaleDateString([], { month: 'short' })}</span>
                        <span className="text-sm leading-none">{new Date(hol.date).getDate()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{hol.name}</p>
                        <p className="text-[11px] text-slate-500">{hol.holidayType} Holiday</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-normal border-slate-200">
                      in {hol.daysRemaining} days
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Widget: Company Announcements */}
          <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.announcements?.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</p>
                      {ann.isPinned && (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-[9px]">
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{ann.message}</p>
                    <p className="text-[10px] text-slate-400">{new Date(ann.publishedDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
