import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { 
  Plus, Download, Upload, Filter, Search, MoreVertical, LayoutGrid, Loader2, 
  Trash2, FileEdit, Eye, FileText, CalendarCheck, Clock, DollarSign, Ban, History 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmployeeFormDrawer } from './EmployeeFormDrawer';
import { Dialog, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  joiningDate: string;
  status: string;
  departmentId: string;
  designationId: string;
  branchId: string;
}

export function EmployeeList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/v1/Employees`);
      return Array.isArray(res.data) ? res.data : (res.data.data || res.data.value || []);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_BASE_URL}/api/v1/Employees/` + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Employee deleted successfully");
      setDeleteId(null);
    }
  });

  const filteredData = data?.filter(item => 
    item.firstName.toLowerCase().includes(search.toLowerCase()) || 
    item.lastName.toLowerCase().includes(search.toLowerCase()) ||
    item.employeeNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (first: string, last: string) => {
    return (first[0] + last[0]).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Inactive': return <Badge variant="secondary">Inactive</Badge>;
      case 'OnLeave': return <Badge variant="warning">On Leave</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-full mx-auto px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your organization's workforce.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-3" onClick={() => toast.info('Import Employees', { description: 'Select a CSV or Excel file to upload.' })}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" className="h-9 px-3" onClick={() => toast.success('Export Started', { description: 'Your employees.xlsx file is downloading.' })}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button onClick={() => { setEmployeeToEdit(null); setDrawerOpen(true); }} className="h-9 px-4 shadow-sm shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Toolbar & Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search employees, ID, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-950 shadow-sm h-9 border-slate-200 dark:border-slate-800" 
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Active Employees</DropdownMenuItem>
                <DropdownMenuItem>Inactive Employees</DropdownMenuItem>
                <DropdownMenuItem>On Leave</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Engineering</DropdownMenuItem>
                <DropdownMenuItem>Human Resources</DropdownMenuItem>
                <DropdownMenuItem>Marketing</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => toast.info('View Toggled', { description: 'Grid view will be available in the next release.' })}>
              <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3.5 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                </th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Employee</th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Designation</th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Department</th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Contact</th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Joining Date</th>
                <th className="px-6 py-3.5 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-3.5 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                      <p>Loading enterprise records...</p>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/10">
                    Failed to connect to the backend. Is the API running?
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredData?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
                        <Search className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">No employees found</p>
                      <p className="text-sm mt-1 max-w-sm">We couldn't find any records matching your search query. Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredData?.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => navigate('/employees/' + item.id)} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                        <AvatarFallback className="bg-primary/5 text-primary font-medium">
                          {getInitials(item.firstName, item.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">{item.employeeNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 dark:text-slate-200 font-medium">Software Engineer</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Engineering</td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {new Date(item.joiningDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id)}>
                          <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEmployeeToEdit(item); setDrawerOpen(true); }}>
                          <FileEdit className="mr-2 h-4 w-4 text-slate-400" /> Edit Employee
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id, { state: { tab: 'Documents' } })}>
                          <FileText className="mr-2 h-4 w-4 text-slate-400" /> Documents
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id, { state: { tab: 'Attendance' } })}>
                          <Clock className="mr-2 h-4 w-4 text-slate-400" /> Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id, { state: { tab: 'Leave' } })}>
                          <CalendarCheck className="mr-2 h-4 w-4 text-slate-400" /> Leave
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id, { state: { tab: 'Payroll' } })}>
                          <DollarSign className="mr-2 h-4 w-4 text-slate-400" /> Payroll
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => navigate('/employees/' + item.id, { state: { tab: 'Audit' } })}>
                          <History className="mr-2 h-4 w-4 text-slate-400" /> Audit History
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600 dark:text-amber-400 focus:text-amber-700 dark:focus:text-amber-300">
                          <Ban className="mr-2 h-4 w-4" /> Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300" onSelect={(e) => { e.preventDefault(); setDeleteId(item.id); }}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
          <div>Showing <strong>{filteredData?.length || 0}</strong> records</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>

      </div>

      <EmployeeFormDrawer open={drawerOpen} onOpenChange={setDrawerOpen} employeeToEdit={employeeToEdit} />
      
      <Dialog open={!!deleteId} onOpenChange={(val: any) => val === 'confirm' ? deleteMutation.mutate(deleteId!) : setDeleteId(null)}>
        <DialogTitle>Delete Employee Record?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this employee? This action cannot be undone and will remove them from all enterprise reports.
        </DialogDescription>
      </Dialog>
    </div>
  );
}
