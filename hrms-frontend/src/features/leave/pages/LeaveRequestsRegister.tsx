import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { 
  Search, Filter, Download, Plus, CheckCircle, XCircle, FileText, 
  Calendar, MoreVertical, SlidersHorizontal
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
  
  const { data: requests, isLoading } = useQuery({
    queryKey: ['leave-requests', 'all'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5002/api/v1/Leave/requests');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">Approved</Badge>;
      case 'Rejected': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0">Rejected</Badge>;
      case 'Pending': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">Pending</Badge>;
      case 'Cancelled': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredRequests = requests?.filter((req: any) => 
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
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
          <Button variant="outline" className="shrink-0"><SlidersHorizontal className="w-4 h-4 mr-2"/> Filters</Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-emerald-600 border-emerald-200"><CheckCircle className="w-4 h-4 mr-2"/> Bulk Approve</Button>
          <Button variant="outline" className="text-rose-600 border-rose-200"><XCircle className="w-4 h-4 mr-2"/> Bulk Reject</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export</Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
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
            <tbody>
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
                  <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4"><Checkbox /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {req.employeeName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{req.employeeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{req.departmentName || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: req.leaveType.colorCode || '#3b82f6'}}></div>
                        <span className="font-medium">{req.leaveType.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {new Date(req.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                      {' - '}
                      {new Date(req.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700">{req.totalDays}</span>
                      {req.isHalfDay && <span className="ml-1 text-xs text-slate-400">(Half)</span>}
                    </td>
                    <td className="p-4 text-slate-500">{new Date(req.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="p-4">{getStatusBadge(req.status)}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-emerald-600"><CheckCircle className="w-4 h-4 mr-2" /> Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600"><XCircle className="w-4 h-4 mr-2" /> Reject</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><FileText className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
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
    </div>
  );
}
