import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users, UserMinus, Clock, FileWarning
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function ManagerAttendanceDashboard() {
  // Using a mock managerId for now
  const managerId = "MGR-123";
  
  const { data, isLoading } = useQuery({
    queryKey: ['managerDashboard', managerId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5002/api/v1/Attendance/manager-dashboard/${managerId}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="p-8 space-y-8 animate-pulse"><Skeleton className="h-[200px] w-full rounded-3xl" /></div>;
  }

  const { kpis, teamAttendance } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Team Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your team's attendance for today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Present Today', val: kpis.presentToday, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Absent Today', val: kpis.absentToday, icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Late Arrivals', val: kpis.lateArrivals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Approvals', val: kpis.pendingApprovals, icon: FileWarning, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.val}</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Team Attendance Table */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Team Today</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Employee</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Clock In</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {teamAttendance?.map((req: any) => (
                <tr key={req.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{req.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      req.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      req.status === 'Absent' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{req.clockIn}</td>
                  <td className="px-6 py-4 text-slate-500 text-right">{req.clockOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
