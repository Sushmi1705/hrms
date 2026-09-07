import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { ExpenseAnalyticsDto } from '../api/reportApi';
import { formatCurrencyValue } from '../utils/currencyFormatter';
import { Plane, Receipt, CreditCard, Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpenseSectionProps {
  data: ExpenseAnalyticsDto | null;
  currency?: string;
  loading?: boolean;
}

const DEPT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({ data, currency = 'RM', loading = false }) => {
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

  const totalSpendFormatted = formatCurrencyValue(data.totalSpend, currency);
  const travelSpendFormatted = formatCurrencyValue(data.travelSpend, currency);
  const expenseSpendFormatted = formatCurrencyValue(data.expenseSpend, currency);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plane className="h-4 w-4 text-blue-500" />
            Travel &amp; Expense Management Analytics
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Business trips, employee reimbursement claims &amp; departmental spend tracking
          </CardDescription>
        </div>
        <button
          onClick={() => navigate('/admin/travel')}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto"
        >
          <span>Travel Portal</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Mini-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/60 dark:border-blue-900/40"
            title={`Exact Spend: ${totalSpendFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">Total Spend</span>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-0.5">{totalSpendFormatted.formatted}</p>
            <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Travel &amp; incidentals</span>
          </div>

          <div
            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
            title={`Exact Travel: ${travelSpendFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Trip Spend</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{travelSpendFormatted.formatted}</p>
            <span className="text-[10px] text-slate-400">Approved itineraries</span>
          </div>

          <div
            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
            title={`Exact Claims: ${expenseSpendFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Expense Claims</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{expenseSpendFormatted.formatted}</p>
            <span className="text-[10px] text-slate-400">{data.approvedClaims} claims paid</span>
          </div>

          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100/60 dark:border-amber-900/40">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Pending Approvals</span>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">{data.pendingClaims}</p>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Awaiting finance review</span>
          </div>
        </div>

        {/* Spend by Department Chart */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Expense Spend by Department
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.spendByDepartment} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
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
                  formatter={(val: any) => [formatCurrencyValue(val, currency).formatted, 'Department Spend']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.spendByDepartment.map((_, idx) => (
                    <Cell key={idx} fill={DEPT_COLORS[idx % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
