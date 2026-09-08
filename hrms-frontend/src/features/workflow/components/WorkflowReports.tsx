import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Clock,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { workflowApi } from '../api/workflowApi';
import { API_BASE_URL } from '@/lib/api';

export function WorkflowReports() {
  const [slaData, setSlaData] = useState<any>(null);
  const [workloads, setWorkloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('All');

  const loadReports = async () => {
    try {
      setLoading(true);
      const [sla, work] = await Promise.all([
        workflowApi.getSlaReport(selectedModule),
        workflowApi.getWorkloadReport()
      ]);
      setSlaData(sla);
      setWorkloads(work);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [selectedModule]);

  return (
    <div className="space-y-6">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Enterprise Workflow & SLA Analytics Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time compliance monitoring, approver efficiency indices, and bottleneck diagnostics.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`${API_BASE_URL}/api/v1/workflow/export?type=approvals`, '_blank')}
            className="flex items-center gap-1.5 text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export Approvals CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`${API_BASE_URL}/api/v1/workflow/export?type=definitions`, '_blank')}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="w-4 h-4 text-primary" /> Export Matrix CSV
          </Button>
        </div>
      </div>

      {/* SLA Metrics Summary Cards */}
      {slaData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600">SLA Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {slaData.slaCompliancePercentage}%
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Met within configured limits</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600">Total Tracked Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{slaData.totalTasks}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Across all enterprise units</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600">Tasks Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{slaData.dueSoonCount}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">&lt; 4 hours remaining</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-rose-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-slate-600">Overdue / Escalated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {slaData.overdueCount + slaData.escalatedCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">SLA timeout breaches</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Approver Workload Breakdown */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Approver Throughput & Workload Diagnostics
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Task distribution, completion volume, and SLA compliance per reviewer.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadReports}>
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border-b text-xs">
                <tr>
                  <th className="px-6 py-3.5">Reviewer Authority</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5 text-center">Pending Backlog</th>
                  <th className="px-4 py-3.5 text-center">Approved Volume</th>
                  <th className="px-4 py-3.5 text-center">Rejected Volume</th>
                  <th className="px-4 py-3.5 text-center">Avg Resolution SLA</th>
                  <th className="px-6 py-3.5 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {workloads.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {w.approverName}
                    </td>
                    <td className="px-4 py-4 text-slate-500">{w.role}</td>
                    <td className="px-4 py-4 text-center font-bold text-amber-600">{w.pendingCount}</td>
                    <td className="px-4 py-4 text-center font-bold text-emerald-600">{w.approvedCount}</td>
                    <td className="px-4 py-4 text-center font-bold text-red-600">{w.rejectedCount}</td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-400 font-medium">
                      {w.avgCompletionHours}h
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {w.slaCompliance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
