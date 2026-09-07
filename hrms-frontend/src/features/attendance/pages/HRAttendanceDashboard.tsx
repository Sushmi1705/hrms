import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users, UserMinus, Clock, AlertTriangle, FileWarning, CheckCircle, 
  Download, Upload, FileText, ChevronRight, Filter, Search, ShieldAlert,
  CalendarDays, BarChart4, Activity, Bell, ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AttendanceRegisterGrid } from '../components/AttendanceRegisterGrid';
import { AdvancedFilterToolbar } from '../components/AdvancedFilterToolbar';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { format, parseISO, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { Link } from 'react-router-dom';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function HRAttendanceDashboard() {
  const [filters, setFilters] = useState<any>({
    dateRange: 'This Month'
  });

  const getDateParams = () => {
    const today = new Date();
    let startDate = '';
    let endDate = format(today, 'yyyy-MM-dd');

    switch (filters.dateRange) {
      case 'Today': startDate = format(today, 'yyyy-MM-dd'); break;
      case 'Yesterday': { const y = subDays(today, 1); startDate = format(y, 'yyyy-MM-dd'); endDate = format(y, 'yyyy-MM-dd'); break; }
      case 'This Week': startDate = format(startOfWeek(today), 'yyyy-MM-dd'); break;
      case 'Last Week': { const lw = subDays(today, 7); startDate = format(startOfWeek(lw), 'yyyy-MM-dd'); endDate = format(subDays(startOfWeek(today), 1), 'yyyy-MM-dd'); break; }
      case 'This Month': startDate = format(startOfMonth(today), 'yyyy-MM-dd'); break;
      case 'Last Month': { const lm = subDays(startOfMonth(today), 1); startDate = format(startOfMonth(lm), 'yyyy-MM-dd'); endDate = format(lm, 'yyyy-MM-dd'); break; }
      case 'Current Year': startDate = format(startOfYear(today), 'yyyy-MM-dd'); break;
      default: startDate = format(startOfMonth(today), 'yyyy-MM-dd'); break;
    }
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateParams();

  const { data: hrData, isLoading, isError } = useQuery({
    queryKey: ['hrDashboard', startDate, endDate, filters],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5002/api/v1/Attendance/analytics?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    }
  });

  // Mock data for new charts to satisfy enterprise layout
  const trendData = [
    { name: 'Mon', present: 185, absent: 15 }, { name: 'Tue', present: 190, absent: 10 },
    { name: 'Wed', present: 188, absent: 12 }, { name: 'Thu', present: 192, absent: 8 },
    { name: 'Fri', present: 175, absent: 25 }
  ];
  const deptData = [
    { name: 'Engineering', value: 85 }, { name: 'Sales', value: 45 },
    { name: 'Marketing', value: 30 }, { name: 'HR', value: 15 }, { name: 'Finance', value: 25 }
  ];
  const shiftData = [
    { name: 'Morning', value: 120 }, { name: 'Evening', value: 50 }, { name: 'Night', value: 30 }
  ];

  return (
    <div className="flex-1 space-y-8 p-8 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Attendance Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time attendance metrics and operations overview.</p>
        </div>
      </div>

      <AdvancedFilterToolbar onFilterChange={setFilters} onExport={() => alert('Exporting...')} />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center">
          <FileWarning className="w-5 h-5 mr-2" /> Error loading data.
        </div>
      ) : (
        <>
          {/* KPI Cards Row 1 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Present</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{hrData.presentCount || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span><span>Absent</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{hrData.absentCount || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span><span>Late Arrivals</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{hrData.lateCount || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span><span>Missing Punches</span>
              </div>
              <div className="text-4xl font-black text-slate-900">12</div>
            </div>
          </div>
          
          {/* KPI Cards Row 2 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span><span>Half Day</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{hrData.halfDayCount || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span><span>On Leave</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{hrData.leaveCount || 0}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span><span>Pending Approvals</span>
              </div>
              <div className="text-4xl font-black text-slate-900">45</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span><span>Overtime Logged</span>
              </div>
              <div className="text-4xl font-black text-slate-900">32h</div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-slate-400" /> Attendance Trend
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" name="Present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" dataKey="absent" name="Absent" stroke="#f43f5e" fillOpacity={1} fill="url(#colorAbsent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                <Users className="w-4 h-4 mr-2 text-slate-400" /> Department Attendance
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" /> Shift Attendance
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shiftData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <ListTodo className="w-4 h-4 mr-2 text-slate-400" /> Pending Requests & Alerts
                </h3>
                <Link to="/admin/approvals" className="text-xs text-blue-600 font-semibold hover:underline">View All</Link>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">JD</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">John Doe requested Regularization</p>
                      <p className="text-xs text-slate-500">Today at 9:15 AM</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Review</Button>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">5 Missing Punches Detected</p>
                      <p className="text-xs text-slate-500">Engineering Dept</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Resolve</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Register */}
      <AttendanceRegisterGrid externalFilters={filters} />
      
    </div>
  );
}
