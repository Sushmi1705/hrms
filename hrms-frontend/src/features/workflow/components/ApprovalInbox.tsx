import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { ApprovalTask, PagedResult } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface ApprovalInboxProps {
  onSelectRequest: (requestId: string) => void;
}

export function ApprovalInbox({ onSelectRequest }: ApprovalInboxProps) {
  const [data, setData] = useState<PagedResult<ApprovalTask>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [slaFilter, setSlaFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [bulkActionType, setBulkActionType] = useState<'Approved' | 'Rejected' | null>(null);
  const [bulkComments, setBulkComments] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getInbox({
        search,
        module: moduleFilter,
        priority: priorityFilter,
        slaStatus: slaFilter,
        page,
        pageSize: 10
      });
      setData(res);
      setSelectedTaskIds([]);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load inbox' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, moduleFilter, priorityFilter, slaFilter, page]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTaskIds(data.items.map((t) => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedTaskIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirmBulk = async () => {
    if (!bulkActionType || selectedTaskIds.length === 0) return;
    try {
      setProcessingBulk(true);
      await workflowApi.bulkProcessAction({
        taskIds: selectedTaskIds,
        action: bulkActionType,
        comments: bulkComments || `Bulk ${bulkActionType} by administrator`
      });
      setMessage({
        type: 'success',
        text: `Successfully processed ${selectedTaskIds.length} tasks as ${bulkActionType}.`
      });
      setBulkActionType(null);
      setBulkComments('');
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Bulk processing failed' });
    } finally {
      setProcessingBulk(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <Badge className="bg-red-600 text-white font-bold">Urgent</Badge>;
      case 'High':
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case 'Normal':
        return <Badge variant="outline" className="text-slate-600">Normal</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Low</Badge>;
    }
  };

  const getSlaBadge = (slaStatus: string) => {
    switch (slaStatus) {
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'DueSoon':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Due Soon
          </span>
        );
      case 'Escalated':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            <AlertTriangle className="w-3 h-3" /> Escalated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> On Time
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex justify-between items-center ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {bulkActionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${
                  bulkActionType === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {bulkActionType === 'Approved' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Bulk {bulkActionType} ({selectedTaskIds.length} Requests)
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to {bulkActionType.toLowerCase()} all selected tasks?
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Decision Notes / Comments
              </label>
              <textarea
                value={bulkComments}
                onChange={(e) => setBulkComments(e.target.value)}
                placeholder="Optional bulk approval notes or mandatory rejection reason..."
                rows={3}
                className="w-full mt-1.5 p-2 text-xs border rounded-lg bg-white dark:bg-slate-950"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkActionType(null)}
                disabled={processingBulk}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmBulk}
                disabled={processingBulk}
                className={
                  bulkActionType === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }
              >
                {processingBulk ? 'Processing...' : `Confirm Bulk ${bulkActionType}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              Universal Approval Inbox
            </CardTitle>
            <CardDescription className="mt-1">
              Active enterprise tasks awaiting line manager, HR, or finance authorization.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {selectedTaskIds.length > 0 && (
              <div className="flex items-center gap-2 mr-2 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {selectedTaskIds.length} Selected
                </span>
                <Button
                  size="sm"
                  onClick={() => setBulkActionType('Approved')}
                  className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setBulkActionType('Rejected')}
                  className="h-7 text-xs px-2.5"
                >
                  Reject
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('http://localhost:5002/api/v1/workflow/export?type=inbox', '_blank')}
              className="flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search request #, requester name, summary, step..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2 w-full border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 min-w-[130px]"
            >
              <option value="All">All Modules</option>
              <option value="Leave">Leave</option>
              <option value="Attendance">Attendance</option>
              <option value="Payroll">Payroll</option>
              <option value="Recruitment">Recruitment</option>
              <option value="Performance">Performance</option>
              <option value="Asset">Asset</option>
              <option value="Offboarding">Offboarding</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 min-w-[120px]"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={slaFilter}
              onChange={(e) => {
                setSlaFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 min-w-[120px]"
            >
              <option value="All">All SLA Status</option>
              <option value="OnTime">On Time</option>
              <option value="DueSoon">Due Soon</option>
              <option value="Overdue">Overdue</option>
              <option value="Escalated">Escalated</option>
            </select>

            <Button variant="ghost" size="icon" onClick={loadData} title="Refresh Inbox">
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100/75 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={data.items.length > 0 && selectedTaskIds.length === data.items.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="px-4 py-3.5">Request Details</th>
                  <th className="px-4 py-3.5">Requester & Dept</th>
                  <th className="px-4 py-3.5">Current Stage</th>
                  <th className="px-4 py-3.5">Assigned To</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">SLA Tracking</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                        <span>Loading approval tasks...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <CheckSquare className="w-8 h-8 text-emerald-500 mx-auto" />
                        <p className="font-medium text-slate-700">Inbox is all clear!</p>
                        <p className="text-xs text-slate-400">No pending requests requiring your authorization.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.items.map((t) => {
                    const isSelected = selectedTaskIds.includes(t.id);
                    return (
                      <tr
                        key={t.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer ${
                          isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                        }`}
                        onClick={() => onSelectRequest(t.approvalRequestId)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(t.id)}
                            className="rounded border-slate-300"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{t.requestNumber}</span>
                            <span className="text-[11px] font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                              {t.module}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.summary}</p>
                          {t.amount && (
                            <span className="text-xs font-semibold text-emerald-700">
                              ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{t.requesterName}</div>
                          <div className="text-xs text-slate-400">{t.department}</div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{t.stepName}</span>
                          <div className="text-xs text-slate-400">Step {t.orderIndex}</div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-slate-900 dark:text-white font-medium text-xs">
                            {t.assignedUserName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {t.isDelegated ? `(Delegated via ${t.originalApproverName})` : t.assignedRoleName}
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">{getPriorityBadge(t.priority)}</td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {getSlaBadge(t.slaStatus)}
                          {t.dueDate && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              Due: {new Date(t.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectRequest(t.approvalRequestId)}
                            className="text-xs flex items-center gap-1 h-8"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
            <div>
              Showing {data.items.length > 0 ? (data.page - 1) * data.pageSize + 1 : 0} to{' '}
              {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} tasks
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page <= 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-xs font-medium px-2">
                Page {data.page} of {data.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={data.page >= data.totalPages}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
