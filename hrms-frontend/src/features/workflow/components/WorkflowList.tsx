import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Copy,
  CheckCircle,
  PlayCircle,
  Trash2,
  GitBranch,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Archive,
  Download
} from 'lucide-react';
import { WorkflowDefinition, PagedResult } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface WorkflowListProps {
  onEdit: (workflow: WorkflowDefinition) => void;
  onCreate: () => void;
}

export function WorkflowList({ onEdit, onCreate }: WorkflowListProps) {
  const [data, setData] = useState<PagedResult<WorkflowDefinition>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await workflowApi.getDefinitions({
        search,
        module: moduleFilter,
        status: statusFilter,
        category: categoryFilter,
        page,
        pageSize: 10
      });
      setData(res);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load workflows' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, moduleFilter, statusFilter, categoryFilter, page]);

  const handleDuplicate = async (id: string) => {
    try {
      await workflowApi.duplicateDefinition(id);
      setMessage({ type: 'success', text: 'Workflow duplicated successfully as draft.' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to duplicate workflow' });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await workflowApi.publishDefinition(id);
      setMessage({ type: 'success', text: 'Workflow published and activated successfully.' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish workflow' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow definition?')) return;
    try {
      await workflowApi.deleteDefinition(id);
      setMessage({ type: 'success', text: 'Workflow deleted successfully.' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete workflow' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>;
      case 'Draft':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Draft</Badge>;
      case 'Inactive':
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Inactive</Badge>;
      case 'Archived':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              Workflow Definitions & Approval Matrices
            </CardTitle>
            <CardDescription className="mt-1">
              Configure, version, and manage enterprise approval processes across all modules.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`${API_BASE_URL}/api/v1/workflow/export?type=definitions`, '_blank')}
              className="flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button onClick={onCreate} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4" /> Create Workflow
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Filter Toolbar */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search workflows by name, code, description, creator..."
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
              <option value="Onboarding">Onboarding</option>
              <option value="Performance">Performance</option>
              <option value="Asset">Asset</option>
              <option value="Document">Document</option>
              <option value="Offboarding">Offboarding</option>
              <option value="CustomHR">Custom HR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 min-w-[120px]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
              <option value="Archived">Archived</option>
            </select>

            <Button variant="ghost" size="icon" onClick={loadData} title="Refresh data">
              <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Workflow Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100/75 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Workflow Details</th>
                  <th className="px-4 py-3.5">Module & Category</th>
                  <th className="px-4 py-3.5 text-center">Version</th>
                  <th className="px-4 py-3.5 text-center">Stages</th>
                  <th className="px-4 py-3.5 text-center">Usage Count</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                        <span>Loading enterprise workflows...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-medium text-slate-700">No workflows found</p>
                        <p className="text-xs text-slate-400">Try adjusting your filters or create a new workflow definition.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.items.map((wf) => (
                    <tr
                      key={wf.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer"
                      onClick={() => onEdit(wf)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{wf.name}</span>
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {wf.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{wf.description}</p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{wf.module}</span>
                        <div className="text-xs text-slate-400">{wf.category}</div>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          v{wf.version}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {wf.stepsCount} {wf.stepsCount === 1 ? 'Step' : 'Steps'}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">{wf.usageCount}</span> instances
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(wf.status)}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(wf)}
                            title="Edit / View in Designer"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4 text-slate-600 hover:text-primary" />
                          </Button>

                          {wf.status === 'Draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublish(wf.id)}
                              title="Publish & Activate"
                              className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(wf.id)}
                            title="Duplicate Workflow"
                            className="h-8 w-8 p-0 text-slate-600 hover:text-indigo-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(wf.id)}
                            title="Delete"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
            <div>
              Showing {data.items.length > 0 ? (data.page - 1) * data.pageSize + 1 : 0} to{' '}
              {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} workflows
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
