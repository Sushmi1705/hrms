import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { AssetAnalyticsDto } from '../api/reportApi';
import { formatCurrencyValue } from '../utils/currencyFormatter';
import { Package, CheckCircle2, Clock, AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssetSectionProps {
  data: AssetAnalyticsDto | null;
  currency?: string;
  loading?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const AssetSection: React.FC<AssetSectionProps> = ({ data, currency = 'RM', loading = false }) => {
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

  const totalValueFormatted = formatCurrencyValue(data.totalAssetValue, currency);

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Enterprise Asset Intelligence
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Physical hardware, assigned devices, maintenance cycles &amp; depreciation
          </CardDescription>
        </div>
        <button
          onClick={() => navigate('/admin/assets')}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
        >
          <span>Asset Inventory</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Mini-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Assets</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{data.totalAssets}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {data.assignedAssets} assigned
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100/60 dark:border-emerald-900/40">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Available</span>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{data.availableAssets}</p>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Ready for deployment</span>
          </div>

          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100/60 dark:border-amber-900/40">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">In Maintenance</span>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">{data.underMaintenance}</p>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
              {data.pendingReturns} pending returns
            </span>
          </div>

          <div
            className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40"
            title={`Exact Value: ${totalValueFormatted.exact}`}
          >
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">Total Asset Value</span>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">{totalValueFormatted.formatted}</p>
            <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80">Book valuation</span>
          </div>
        </div>

        {/* Category distribution bar chart */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
            Asset Count by Category
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.assetsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} Units`, 'Quantity']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.assetsByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
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
