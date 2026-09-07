import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import type { BenefitsAnalyticsDto } from '../api/reportApi';
import { formatCurrencyValue } from '../utils/currencyFormatter';
import { HeartHandshake, ShieldCheck, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BenefitsSectionProps {
  data: BenefitsAnalyticsDto | null;
  currency?: string;
  loading?: boolean;
}

const BENEFIT_COLORS = ['#ec4899', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ data, currency = 'RM', loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const totalCostFormatted = formatCurrencyValue(data.totalBenefitsCost, currency);
  const avgCostFormatted = formatCurrencyValue(data.averageBenefitPerEmployee, currency);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-pink-500" />
            Benefits &amp; Total Rewards Analytics
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Health insurance, retirement matches, wellness programs &amp; employee coverage
          </CardDescription>
        </div>
        <button
          onClick={() => navigate('/admin/compensation')}
          className="flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline self-start sm:self-auto"
        >
          <span>Benefit Plans</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="p-3 bg-pink-50/50 dark:bg-pink-950/20 rounded-xl border border-pink-100/60 dark:border-pink-900/40"
            title={`Exact Monthly Cost: ${totalCostFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-400">Total Benefits Cost</span>
            <p className="text-xl font-bold text-pink-700 dark:text-pink-300 mt-0.5">{totalCostFormatted.formatted}</p>
            <span className="text-[10px] text-pink-600/80 dark:text-pink-400/80">Monthly employer subsidy</span>
          </div>

          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">Enrollment Rate</span>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">{data.enrollmentRate}%</p>
            <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80">
              {data.employeesEnrolled} staff enrolled
            </span>
          </div>

          <div
            className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/60 dark:border-emerald-900/40"
            title={`Exact Average: ${avgCostFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Avg / Employee</span>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{avgCostFormatted.formatted}</p>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Monthly investment</span>
          </div>

          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100/60 dark:border-purple-900/40">
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-400">Active Plans</span>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-0.5">{data.totalPlans}</p>
            <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80">Across health &amp; life</span>
          </div>
        </div>

        {/* Chart: 6-month Cost Trend */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Benefits Expenditure Trend (Last 6 Months)
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.benefitsCostTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="benefitsCostGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${currency} ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [formatCurrencyValue(val, currency).formatted, 'Monthly Spend']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#benefitsCostGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
