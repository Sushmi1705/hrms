import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, RefreshCw, CheckCircle, Clock, AlertCircle, Download, Columns, MoreHorizontal } from 'lucide-react';
import { AuditDetailsDrawer } from './AuditDetailsDrawer';
import { API_BASE_URL } from '@/lib/api';

export function SystemAuditLogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Advanced Filters State (Mocked UI for brevity)
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['SystemAuditLogs', page, search, moduleFilter, actionFilter, severityFilter],
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: page.toString(),
        search,
        module: moduleFilter !== 'All' ? moduleFilter : '',
        action: actionFilter !== 'All' ? actionFilter : '',
        severity: severityFilter !== 'All' ? severityFilter : ''
      });
      const res = await fetch(`${API_BASE_URL}/api/v1/audit/logs?${qs.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    }
  });

  const getStatusBadge = (val: string) => {
    if (val === 'Success' || val === 'Delivered') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Success</span>;
    if (val === 'Warning') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> Warning</span>;
    if (val === 'Failed' || val === 'Critical') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> Failed</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">{val}</span>;
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Enterprise System Audit Logs</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Immutable tracking of all API and internal module activities.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2"><Download className="w-4 h-4"/> Export CSV</Button>
            <Button variant="outline" className="flex gap-2"><Columns className="w-4 h-4"/> Columns</Button>
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>
        
        {/* Advanced Filters Toolbar */}
        <div className="flex flex-wrap gap-3 items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Global Search (User, IP, Endpoint, ID)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
            />
          </div>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="p-2 text-sm border rounded-md bg-white min-w-[120px]">
            <option value="All">All Modules</option>
            <option value="Employees">Employees</option>
            <option value="Payroll">Payroll</option>
            <option value="Workflow">Workflow</option>
            <option value="Auth">Auth</option>
          </select>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="p-2 text-sm border rounded-md bg-white min-w-[120px]">
            <option value="All">All Actions</option>
            <option value="Create">Create</option>
            <option value="Update">Update</option>
            <option value="Delete">Delete</option>
            <option value="View">View</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="p-2 text-sm border rounded-md bg-white min-w-[120px]">
            <option value="All">All Severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
          <Button variant="secondary" className="flex gap-2"><Filter className="w-4 h-4"/> More Filters</Button>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Timestamp</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Module</th>
              <th className="px-6 py-4 font-semibold">Action</th>
              <th className="px-6 py-4 font-semibold">Endpoint</th>
              <th className="px-6 py-4 font-semibold">Severity</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-12">Loading...</td></tr>
            ) : isError ? (
              <tr><td colSpan={7} className="text-center py-12 text-red-500">Error loading data. Ensure API is running.</td></tr>
            ) : data?.items?.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-500">No logs found matching criteria.</td></tr>
            ) : (
              data?.items.map((log: any) => (
                <tr key={log.id} 
                    className="border-b border-slate-100 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLog(log)}>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{new Date(log.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-slate-900">{log.userName}</div>
                    <div className="text-xs text-slate-500">{log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{log.module}</span></td>
                  <td className="px-6 py-3 font-medium text-slate-800">{log.action}</td>
                  <td className="px-6 py-3"><div className="font-mono text-xs text-slate-500 truncate max-w-[150px]" title={log.endpoint}>{log.httpMethod} {log.endpoint}</div></td>
                  <td className="px-6 py-3">{log.severity === 'Critical' ? <span className="text-red-600 font-medium">Critical</span> : log.severity}</td>
                  <td className="px-6 py-3">{getStatusBadge(log.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-lg">
        <span className="text-sm text-slate-500">
          Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to <span className="font-medium">{Math.min(page * 10, data?.totalItems || 0)}</span> of <span className="font-medium">{data?.totalItems || 0}</span> results
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!data || page * 10 >= data.totalItems}>Next</Button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedLog && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setSelectedLog(null)} />
          <AuditDetailsDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
        </>
      )}
    </Card>
  );
}
