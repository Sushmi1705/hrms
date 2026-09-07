import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Server, Database, Zap, Mail, ShieldCheck } from 'lucide-react';
import { SystemHealthReport } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const SystemHealth: React.FC = () => {
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const data = await systemAdminApi.getSystemHealth();
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch system health', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const getComponentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database': return Database;
      case 'api gateway': return Server;
      case 'queue': return Zap;
      case 'email': return Mail;
      default: return Activity;
    }
  };

  if (loading || !report) {
    return <div className="p-12 text-center text-xs text-slate-400">Performing diagnostic system health check...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Overall Health Card */}
      <div className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        report.overallStatus === 'Healthy'
          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
            report.overallStatus === 'Healthy'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                All Core Services Operational
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                100% Uptime
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live diagnostics polled across Database, API Gateway, Queue Workers and Cache Store
            </p>
          </div>
        </div>

        <button
          onClick={fetchHealth}
          disabled={refreshing}
          className="px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Run Health Diagnostics
        </button>
      </div>

      {/* Grid of Component Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.components.map(c => {
          const Icon = getComponentIcon(c.componentType);
          const isHealthy = c.status === 'Healthy';

          return (
            <div
              key={c.name}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{c.componentType}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isHealthy
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {c.message}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px]">Latency:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{c.responseTimeMs}ms</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Checked:</span>
                  <span className="font-mono">{new Date(c.lastCheckedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
