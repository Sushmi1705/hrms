import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { CategoryDataPoint } from '../api/reportApi';
import { Briefcase, UserCheck } from 'lucide-react';

interface RecruitmentFunnelChartProps {
  funnelData: CategoryDataPoint[];
  openPositions: number;
  applicants: number;
  offers: number;
  hired: number;
}

const STAGE_COLORS = [
  '#6366f1', // Applied
  '#3b82f6', // Screening
  '#06b6d4', // Technical
  '#8b5cf6', // HR
  '#f59e0b', // Offered
  '#10b981'  // Hired
];

export const RecruitmentFunnelChart: React.FC<RecruitmentFunnelChartProps> = ({
  funnelData,
  openPositions,
  applicants,
  offers,
  hired
}) => {
  const hireRate = applicants > 0 ? ((hired / applicants) * 100).toFixed(1) : '0';

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Recruitment &amp; ATS Pipeline
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Applicant tracking funnel from initial application to final hire
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            {openPositions} Open Requisitions
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            {hired} Hired ({hireRate}%)
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Applicants</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{applicants}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Open Positions</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{openPositions}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Offers Extended</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{offers}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Successfully Hired</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <UserCheck className="h-4 w-4" /> {hired}
            </p>
          </div>
        </div>

        {/* Funnel Horizontal Bar Chart */}
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funnelData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`${val} Candidates`, 'Pipeline Volume']}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {funnelData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
