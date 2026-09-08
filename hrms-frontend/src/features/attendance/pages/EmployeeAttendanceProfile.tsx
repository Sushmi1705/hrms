import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Briefcase, 
  MapPin, CheckCircle, XCircle, AlertCircle, FileText, 
  BarChart4, Download, Activity, CalendarDays, History, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';

export function EmployeeAttendanceProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employeeAttendance', id, currentMonth, currentYear],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/Attendance/employee/${id}?month=${currentMonth}&year=${currentYear}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold">Failed to load employee profile</h3>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Generate chart data for Recharts
  const chartData = [...(data.monthlyLogs || [])].reverse().map((log: any) => ({
    date: new Date(log.date).getDate(),
    fullDate: new Date(log.date).toLocaleDateString(),
    workHours: log.totalWorkingHours,
    overtime: log.totalOvertimeHours,
    isLate: log.isLate ? 1 : 0
  }));

  return (
    <div className="flex-1 space-y-6 p-8 bg-slate-50/50 min-h-screen">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex-shrink-0">
              <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">{data.firstName} {data.lastName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  data.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {data.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium">{data.designation} &bull; {data.department}</p>
              
              <div className="flex items-center space-x-6 mt-4 text-sm text-slate-600">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> {data.branch}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> {data.shiftName}</div>
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-slate-400" /> {data.employeeNumber}</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          </div>
        </div>
      </div>

      {/* The 12 requested Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{data.attendancePercentage}%</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Attendance</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-1">{data.totalPresent}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Present Days</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-rose-500 mb-1">{data.totalAbsent}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Absent Days</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-amber-500 mb-1">{data.totalLate}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Late Arrivals</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-indigo-500 mb-1">{data.totalOvertimeHours}h</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Overtime</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-purple-500 mb-1">{data.totalLeaves}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Leaves</div>
        </div>
        {/* Additional metrics */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.totalHalfDay}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Half Days</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.totalEarlyCheckouts}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Early Checkouts</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.totalMissingPunches}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Missing Punches</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.totalPermissions}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Permissions</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.totalRegularizations}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Regularizations</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xl font-bold text-slate-700 mb-1">{data.monthlyLogs.length}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Days Logged</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 flex px-4">
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          Overview & Trends
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('timeline')}
        >
          <History className="w-4 h-4 inline-block mr-2" />
          Daily Timeline
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'calendar' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarDays className="w-4 h-4 inline-block mr-2" />
          Monthly Calendar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
              <BarChart4 className="w-4 h-4 mr-2 text-slate-400" /> Working Hours & Overtime Trend
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWork" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Area type="monotone" name="Working Hours" dataKey="workHours" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWork)" />
                  <Area type="monotone" name="Overtime" dataKey="overtime" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorOT)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-slate-400" /> Late Arrivals Map
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis hide={true} />
                  <RechartsTooltip />
                  <Bar dataKey="isLate" name="Late (1=Yes)" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Check In</th>
                <th className="px-6 py-4 font-semibold">Check Out</th>
                <th className="px-6 py-4 font-semibold">Working Hrs</th>
                <th className="px-6 py-4 font-semibold">Exceptions</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyLogs.map((log: any) => (
                <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      log.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      log.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</td>
                  <td className="px-6 py-4 text-slate-600">{log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</td>
                  <td className="px-6 py-4 font-medium">{log.totalWorkingHours > 0 ? `${log.totalWorkingHours.toFixed(2)}h` : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {log.isLate && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold">LATE</span>}
                      {log.isEarlyOut && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold">EARLY OUT</span>}
                      {log.isMissingPunch && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded font-bold">MISSING PUNCH</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center">
          <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Calendar View Ready for Integration</h3>
          <p className="text-slate-500 mt-2">The Monthly Calendar and Heatmap grid components will render here using the fetched monthlyLogs array.</p>
        </div>
      )}

    </div>
  );
}
