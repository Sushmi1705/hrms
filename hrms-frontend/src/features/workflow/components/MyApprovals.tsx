import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { ApprovalTask, PagedResult } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface MyApprovalsProps {
  onSelectRequest: (requestId: string) => void;
}

export function MyApprovals({ onSelectRequest }: MyApprovalsProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'delegated' | 'escalated' | 'overdue'>('pending');
  const [data, setData] = useState<PagedResult<ApprovalTask>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getMyApprovals({
        tab: activeTab,
        search,
        page,
        pageSize: 10
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load my approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, search, page]);

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', icon: Clock },
    { id: 'approved', label: 'Approved Requests', icon: CheckCircle2 },
    { id: 'rejected', label: 'Rejected Requests', icon: XCircle },
    { id: 'delegated', label: 'Delegated Tasks', icon: UserCheck },
    { id: 'escalated', label: 'Escalated Requests', icon: AlertTriangle },
    { id: 'overdue', label: 'Overdue SLA', icon: Clock }
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs Header */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              My Approver Workbench
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Review personal authorization queue and audit history of your actions.
            </CardDescription>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search request #, employee..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-1.5 w-full border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold border-b text-xs">
                <tr>
                  <th className="px-6 py-3">Request Number</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Module & Summary</th>
                  <th className="px-4 py-3">Stage Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      Loading your approval queue...
                    </td>
                  </tr>
                ) : data.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No records found in this category.
                    </td>
                  </tr>
                ) : (
                  data.items.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
                      onClick={() => onSelectRequest(t.approvalRequestId)}
                    >
                      <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                        {t.requestNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{t.requesterName}</div>
                        <div className="text-[11px] text-slate-400">{t.department}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">{t.summary}</div>
                        <div className="text-[11px] text-primary">{t.module}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {t.stepName}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={
                            t.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : t.status === 'Rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                        {new Date(t.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectRequest(t.approvalRequestId)}
                          className="text-xs h-7 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {data.items.length > 0 ? (data.page - 1) * data.pageSize + 1 : 0} to{' '}
              {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page <= 1}
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <span>
                Page {data.page} of {data.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={data.page >= data.totalPages}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
