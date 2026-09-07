import React from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, PieChart } from 'lucide-react';
import { PlatformDashboardData } from '../types/tenant';
import { tenantApi } from '../api/tenantApi';

interface Props {
  data: PlatformDashboardData | null;
}

export const TenantReports: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Platform SaaS Analytics & Executive Reports</h3>
            <p className="text-xs text-slate-500">Comprehensive multi-tenant subscription performance and cohort conversion metrics</p>
          </div>
        </div>

        <a
          href={tenantApi.getExportUrl()}
          download
          className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export All Data (CSV)
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">${data.monthlyRecurringRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">+18.4% MoM Growth</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Annual Run Rate (ARR)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">${data.annualRunRate.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 font-mono">Based on active contracts</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Trial Conversion Rate</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{data.trialConversionRate}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Top quartile SaaS benchmark</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-medium">Monthly Churn Rate</div>
          <div className="text-2xl font-black text-emerald-600">{data.churnRate}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Net negative revenue churn</div>
        </div>
      </div>

      {/* Industry Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tenant Distribution by Industry Sector</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5">Industry Sector</th>
                <th className="py-2.5 text-center">Active Tenants</th>
                <th className="py-2.5 text-center">Platform Share</th>
                <th className="py-2.5 text-right">Distribution Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {data.tenantsByIndustry.map(ind => (
                <tr key={ind.industry} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{ind.industry}</td>
                  <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-200">{ind.count}</td>
                  <td className="py-3 text-center font-mono text-slate-500">{ind.percentage}%</td>
                  <td className="py-3 text-right">
                    <div className="w-32 ml-auto h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${ind.percentage}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
