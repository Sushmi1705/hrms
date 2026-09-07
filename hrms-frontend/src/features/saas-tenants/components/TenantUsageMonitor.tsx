import React from 'react';
import { Activity, HardDrive, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PlatformDashboardData } from '../types/tenant';

interface Props {
  data: PlatformDashboardData | null;
}

export const TenantUsageMonitor: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tenant Usage & Quotas Monitoring</h3>
            <p className="text-xs text-slate-500">Live capacity thresholds across file storage, active user seats, and operational records</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-slate-500 font-bold">
          <span>{data.totalStorageUsedGb} GB Total Consumed</span>
        </div>
      </div>

      {/* Storage Breakdown Cards */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Storage Consumers</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.storageByTenant.map(st => (
            <div key={st.tenantName} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{st.tenantName}</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {(st.usedMb / 1024).toFixed(1)} GB / {(st.quotaMb / 1024).toFixed(0)} GB ({st.percentage}%)
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    st.percentage > 85 ? 'bg-rose-500' : st.percentage > 60 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(100, st.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
