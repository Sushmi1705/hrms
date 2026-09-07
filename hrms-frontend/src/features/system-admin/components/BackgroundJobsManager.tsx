import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, CheckCircle2, Clock, AlertTriangle, Activity, Zap } from 'lucide-react';
import { BackgroundJobItem } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const BackgroundJobsManager: React.FC = () => {
  const [jobs, setJobs] = useState<BackgroundJobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getBackgroundJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRunNow = async (job: BackgroundJobItem) => {
    setActionKey(job.jobKey);
    try {
      await systemAdminApi.triggerJobNow(job.jobKey);
      setStatusMessage(`Job '${job.name}' executed successfully!`);
      setTimeout(() => setStatusMessage(null), 3500);
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to trigger job');
    } finally {
      setActionKey(null);
    }
  };

  const handleTogglePause = async (job: BackgroundJobItem) => {
    setActionKey(job.jobKey);
    try {
      await systemAdminApi.toggleJobPause(job.jobKey);
      setStatusMessage(`Job '${job.name}' schedule updated.`);
      setTimeout(() => setStatusMessage(null), 3500);
      fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle job pause');
    } finally {
      setActionKey(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Scheduled Daemon Jobs & Service Workers</h3>
            <p className="text-xs text-slate-500">Monitor background processes for workflow escalation, notifications, and cleanup</p>
          </div>
        </div>

        <button
          onClick={fetchJobs}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {statusMessage}
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3.5">Job Name & Key</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Schedule</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Last Run</th>
              <th className="px-4 py-3.5">Metrics</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading scheduled jobs...</td>
              </tr>
            ) : (
              jobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{j.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{j.jobKey}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{j.description}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {j.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {j.cronSchedule}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      j.status === 'Running'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 animate-pulse'
                        : j.status === 'Paused'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}>
                      {j.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-slate-500">
                    <div>{j.lastRunAt ? new Date(j.lastRunAt).toLocaleTimeString() : 'Never'}</div>
                    <div className="text-[10px] text-slate-400">{j.lastDurationMs}ms execution</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-[11px] font-medium text-emerald-600">
                      {j.successCount} Successes
                    </div>
                    {j.failureCount > 0 && (
                      <div className="text-[10px] text-rose-500 font-medium">
                        {j.failureCount} Failures
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleTogglePause(j)}
                        disabled={actionKey === j.jobKey}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        title={j.status === 'Paused' ? 'Resume Schedule' : 'Pause Schedule'}
                      >
                        {j.status === 'Paused' ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                      </button>

                      <button
                        onClick={() => handleRunNow(j)}
                        disabled={actionKey === j.jobKey}
                        className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {actionKey === j.jobKey ? 'Running...' : 'Run Now'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
