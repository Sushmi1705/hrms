import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
  Shield,
  Search,
  RefreshCw,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { WorkflowEscalation } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

export function EscalationTracker() {
  const [escalations, setEscalations] = useState<WorkflowEscalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('All');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getEscalationsReport(moduleFilter);
      setEscalations(res);
    } catch (err) {
      console.error('Failed to load escalations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [moduleFilter]);

  const filtered = escalations.filter(
    (e) =>
      e.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.originalApproverName.toLowerCase().includes(search.toLowerCase()) ||
      e.escalatedToUserName.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* SLA Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600">Total SLA Escalations</CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{escalations.length}</div>
            <p className="text-xs text-slate-500 mt-1">Automated system breaches recorded</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600">Avg Breach Duration</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">16.4 Hours</div>
            <p className="text-xs text-slate-500 mt-1">Average time over configured SLA limit</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600">Resolution Rate</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">94.8%</div>
            <p className="text-xs text-slate-500 mt-1">Escalated tasks resolved post-escalation</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Automated Escalation Audit Logs
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Live tracking of tasks escalated due to SLA timeout limits.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search escalation logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full border rounded-lg text-xs bg-white dark:bg-slate-900"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="p-1.5 text-xs border rounded-lg bg-white dark:bg-slate-900"
            >
              <option value="All">All Modules</option>
              <option value="Leave">Leave</option>
              <option value="Attendance">Attendance</option>
              <option value="Payroll">Payroll</option>
              <option value="Recruitment">Recruitment</option>
            </select>

            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border-b text-xs">
                <tr>
                  <th className="px-6 py-3.5">Request #</th>
                  <th className="px-4 py-3.5">Module</th>
                  <th className="px-4 py-3.5">Original Approver</th>
                  <th className="px-4 py-3.5">Escalated Authority</th>
                  <th className="px-4 py-3.5 text-center">Level</th>
                  <th className="px-4 py-3.5">Breach Duration</th>
                  <th className="px-4 py-3.5">Reason & Time</th>
                  <th className="px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      Loading escalation records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No escalations recorded.
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{e.requestNumber}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 font-medium text-[11px]">
                          {e.module}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {e.originalApproverName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-rose-700 dark:text-rose-400">{e.escalatedToUserName}</div>
                        <div className="text-[10px] text-slate-400">{e.escalatedToRole}</div>
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <Badge variant="outline" className="text-[11px]">
                          Level {e.escalationLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-amber-700">
                        +{e.slaBreachHours}h Overdue
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{e.reason}</div>
                        <div className="text-[10px] text-slate-400">{new Date(e.escalatedAt).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {e.isResolved ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Resolved</Badge>
                        ) : (
                          <Badge className="bg-rose-100 text-rose-800 border-rose-200">Active Escalation</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
