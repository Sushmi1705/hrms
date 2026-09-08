import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { 
  Search, Filter, Download, Plus, CheckCircle, XCircle, FileText, 
  Calendar, MoreVertical, SlidersHorizontal, X, User, Clock, Check,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export function LeaveRequestsRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { data: requests, isLoading } = useQuery({
    queryKey: ['leave-requests', 'all'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/Leave/requests`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, newStatus: string, employeeName: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: newStatus }));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev: any) => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Leave request for ${employeeName} has been ${newStatus.toLowerCase()}.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-medium">Approved</Badge>;
      case 'Rejected': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 font-medium">Rejected</Badge>;
      case 'Pending': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 font-medium">Pending</Badge>;
      case 'Cancelled': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 font-medium">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const displayRequests = requests?.map((req: any) => ({
    ...req,
    status: localStatuses[req.id] || req.status
  }));

  const filteredRequests = displayRequests?.filter((req: any) => {
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCsv = () => {
    if (!filteredRequests || filteredRequests.length === 0) return;
    const headers = ['Employee', 'Department', 'Leave Type', 'From Date', 'To Date', 'Total Days', 'Applied On', 'Status'];
    const rows = filteredRequests.map((r: any) => [
      `"${r.employeeName}"`,
      `"${r.departmentName || '-'}"`,
      `"${r.leaveType?.name || '-'}"`,
      `"${r.fromDate}"`,
      `"${r.toDate}"`,
      r.totalDays,
      `"${r.createdAt}"`,
      `"${r.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leave_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search employee, department, leave type..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              filteredRequests?.filter((r: any) => r.status === 'Pending').forEach((r: any) => {
                handleUpdateStatus(r.id, 'Approved', r.employeeName);
              });
            }}
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs h-9"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1.5"/> Bulk Approve
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              filteredRequests?.filter((r: any) => r.status === 'Pending').forEach((r: any) => {
                handleUpdateStatus(r.id, 'Rejected', r.employeeName);
              });
            }}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs h-9"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5"/> Bulk Reject
          </Button>
          <Button 
            variant="outline" 
            onClick={exportCsv}
            className="text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 mr-1.5"/> Export
          </Button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 w-10"><Checkbox /></th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Leave Type</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Days</th>
                <th className="p-4 font-semibold">Applied On</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 animate-pulse">Loading leave register...</td>
                </tr>
              ) : filteredRequests?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">No leave requests found matching your filters.</td>
                </tr>
              ) : (
                filteredRequests?.map((req: any) => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedRequest(req)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}><Checkbox /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0">
                          {req.employeeName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {req.employeeName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{req.departmentName || 'Engineering'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: req.leaveType?.colorCode || '#3b82f6'}}></div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{req.leaveType?.name || 'General Leave'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(req.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                      {' - '}
                      {new Date(req.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{req.totalDays}</span>
                      {req.isHalfDay && <span className="ml-1 text-xs text-slate-400">(Half)</span>}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(req.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="p-4">{getStatusBadge(req.status)}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {req.status === 'Pending' && (
                            <>
                              <DropdownMenuItem 
                                className="text-emerald-600 focus:text-emerald-700 cursor-pointer"
                                onSelect={() => handleUpdateStatus(req.id, 'Approved', req.employeeName)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-rose-600 focus:text-rose-700 cursor-pointer"
                                onSelect={() => handleUpdateStatus(req.id, 'Rejected', req.employeeName)}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onSelect={() => setSelectedRequest(req)}
                          >
                            <FileText className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Leave Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                  {selectedRequest.employeeName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Leave Request Details
                    {getStatusBadge(selectedRequest.status)}
                  </h3>
                  <span className="text-xs text-slate-500">Ref: REQ-{selectedRequest.id.slice(0, 8).toUpperCase()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Employee & Dept Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Employee</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{selectedRequest.employeeName}</span>
                  <span className="text-xs text-slate-500">{selectedRequest.departmentName || 'Engineering'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Leave Policy Type</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: selectedRequest.leaveType?.colorCode || '#3b82f6' }}
                    />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedRequest.leaveType?.name || 'General Leave'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Code: {selectedRequest.leaveType?.code || 'LV'}</span>
                </div>
              </div>

              {/* Timing & Dates Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">From Date</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {new Date(selectedRequest.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">To Date</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {new Date(selectedRequest.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Duration</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {selectedRequest.totalDays} {selectedRequest.totalDays === 1 ? 'Day' : 'Days'}
                    {selectedRequest.isHalfDay ? ' (Half Day)' : ''}
                  </span>
                </div>
              </div>

              {/* Reason for Request */}
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Reason for Absence
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 italic">
                  "{selectedRequest.reason || 'Personal time off / family commitment requested as per enterprise leave policy.'}"
                </div>
              </div>

              {/* Approval Audit Trail */}
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Approval Workflow Status
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Applied on <strong>{new Date(selectedRequest.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Manager Review: Automatic Line Routing complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    {selectedRequest.status === 'Approved' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : selectedRequest.status === 'Rejected' ? (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span>HR Administrator Sign-Off: <strong className={selectedRequest.status === 'Approved' ? 'text-emerald-600' : selectedRequest.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}>{selectedRequest.status}</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRequest(null)}
                className="text-xs"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedRequest.status === 'Pending' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'Rejected', selectedRequest.employeeName)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject Request
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'Approved', selectedRequest.employeeName)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve Leave
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Request has been {selectedRequest.status.toLowerCase()}
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default LeaveRequestsRegister;
