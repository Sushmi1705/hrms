import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import type { CategoryDataPoint } from '../api/reportApi';
import { CalendarCheck, Clock, CheckCircle2, FileText } from 'lucide-react';

interface LeaveSectionProps {
  totalLeaveRequests: number;
  approvedLeaves: number;
  pendingLeaves: number;
  utilizationRate: number;
  leaveTypeDistribution: CategoryDataPoint[];
}

export const LeaveSection: React.FC<LeaveSectionProps> = ({
  totalLeaveRequests,
  approvedLeaves,
  pendingLeaves,
  utilizationRate,
  leaveTypeDistribution
}) => {
  const totalDays = leaveTypeDistribution.reduce((acc, curr) => acc + curr.value, 0);

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Leave &amp; Absence Management
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leave balance utilization, request volume, and category distribution
          </CardDescription>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
          {utilizationRate}% Utilization
        </span>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Total Requests</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalLeaveRequests}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Approved</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{approvedLeaves}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Pending Action</span>
            </div>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingLeaves}</p>
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            <span>Leave Distribution by Category</span>
            <span className="text-slate-400">{totalDays} Total Days</span>
          </div>

          <div className="space-y-2.5">
            {leaveTypeDistribution.map((item, idx) => {
              const pct = totalDays > 0 ? Math.round((item.value / totalDays) * 100) : 0;
              const color = colors[idx % colors.length];
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.category}</span>
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">
                      {item.value} days ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
