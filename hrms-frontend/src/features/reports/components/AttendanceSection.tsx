import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TrendDataPoint } from '../api/reportApi';
import { Activity, Clock, LogOut, CheckCircle2 } from 'lucide-react';

interface AttendanceSectionProps {
  attendanceRate: number;
  absenceRate: number;
  lateCheckIns: number;
  earlyCheckOuts: number;
  trend: TrendDataPoint[];
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  attendanceRate,
  absenceRate,
  lateCheckIns,
  earlyCheckOuts,
  trend
}) => {
  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Attendance &amp; Punctuality Analytics
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Biometric check-in compliance, punctuality, and attendance trends
          </CardDescription>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
          {attendanceRate}% Punctuality
        </span>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Attendance Rate</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{attendanceRate}%</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Activity className="h-3.5 w-3.5 text-rose-500" />
              <span>Absence Rate</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{absenceRate}%</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Late Check-ins</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{lateCheckIns}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <LogOut className="h-3.5 w-3.5 text-sky-500" />
              <span>Early Check-outs</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{earlyCheckOuts}</p>
          </div>
        </div>

        {/* 6-Month Attendance Trend Chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[60, 100]} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Attendance Rate']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
                name="Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
