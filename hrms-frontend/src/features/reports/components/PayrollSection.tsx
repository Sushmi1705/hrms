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
  Legend
} from 'recharts';
import type { TrendDataPoint } from '../api/reportApi';
import { Banknote, DollarSign, ShieldCheck } from 'lucide-react';

interface PayrollSectionProps {
  grossPayroll: number;
  netPayroll: number;
  benefitsCost: number;
  trend: TrendDataPoint[];
}

export const PayrollSection: React.FC<PayrollSectionProps> = ({
  grossPayroll,
  netPayroll,
  benefitsCost,
  trend
}) => {
  const chartData = trend.map((t) => ({
    name: t.period.replace(' 2026', ''),
    gross: Math.round(t.value / 1000), // in thousands
    net: t.secondaryValue ? Math.round(t.secondaryValue / 1000) : Math.round((t.value * 0.8) / 1000)
  }));

  const totalCompensation = grossPayroll + benefitsCost;

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Payroll &amp; Total Rewards Trend
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            6-month expenditure across gross salaries, deductions, and corporate benefits
          </CardDescription>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
          ${(totalCompensation / 1000000).toFixed(2)}M Monthly Total
        </span>
      </CardHeader>

      <CardContent>
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Gross Payroll (MTD)</span>
            </div>
            <p className="text-xl font-bold text-indigo-950 dark:text-indigo-100">
              ${(grossPayroll / 1000000).toFixed(2)}M
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              ${Number(grossPayroll).toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-1">
              <Banknote className="h-3.5 w-3.5" />
              <span>Net Disbursed</span>
            </div>
            <p className="text-xl font-bold text-emerald-950 dark:text-emerald-100">
              ${(netPayroll / 1000000).toFixed(2)}M
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              80% net take-home ratio
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Benefits Spend</span>
            </div>
            <p className="text-xl font-bold text-purple-950 dark:text-purple-100">
              ${(benefitsCost / 1000).toFixed(0)}k
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Health, life, &amp; 401k plans
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: any) => [`$${(Number(val) * 1000).toLocaleString()}`, name]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
              />
              <Bar dataKey="gross" name="Gross Salary" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="net" name="Net Salary" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
