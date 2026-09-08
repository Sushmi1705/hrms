import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AttendanceRegisterGrid({ externalFilters }: { externalFilters?: any }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [localSearch, setLocalSearch] = useState('');

  // When external filters change, reset to page 1
  useEffect(() => {
    setPage(1);
  }, [externalFilters]);

  // Construct query string based on externalFilters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append('PageNumber', page.toString());
    params.append('PageSize', pageSize.toString());
    
    if (localSearch) params.append('SearchQuery', localSearch);

    if (externalFilters) {
      if (externalFilters.searchQuery) params.append('SearchQuery', externalFilters.searchQuery);
      if (externalFilters.department) params.append('Department', externalFilters.department);
      if (externalFilters.branch) params.append('Branch', externalFilters.branch);
      if (externalFilters.shift) params.append('Shift', externalFilters.shift);
      if (externalFilters.status) params.append('Status', externalFilters.status);
      if (externalFilters.isLateArrival) params.append('IsLateArrival', 'true');
      if (externalFilters.isMissingPunch) params.append('IsMissingPunch', 'true');
      if (externalFilters.isOvertime) params.append('IsOvertime', 'true');
      if (externalFilters.sortBy) params.append('SortBy', externalFilters.sortBy);
      
      // Calculate start and end date based on dateRange enum
      const today = new Date();
      let startDateStr = '';
      let endDateStr = today.toISOString().split('T')[0];
      
      switch (externalFilters.dateRange) {
        case 'Today': startDateStr = endDateStr; break;
        case 'Yesterday': {
          const y = new Date(); y.setDate(y.getDate() - 1);
          startDateStr = y.toISOString().split('T')[0];
          endDateStr = startDateStr;
          break;
        }
        case 'This Week': {
          const w = new Date(); w.setDate(w.getDate() - w.getDay());
          startDateStr = w.toISOString().split('T')[0];
          break;
        }
        case 'This Month': {
          const m = new Date(); m.setDate(1);
          startDateStr = m.toISOString().split('T')[0];
          break;
        }
        default: {
          const defaultMonth = new Date(); defaultMonth.setDate(1);
          startDateStr = defaultMonth.toISOString().split('T')[0];
          break;
        }
      }
      if (startDateStr) {
        params.append('StartDate', startDateStr);
        params.append('EndDate', endDateStr);
      }
    }

    return params.toString();
  };

  const { data, isLoading } = useQuery({
    queryKey: ['attendanceRegister', page, pageSize, localSearch, externalFilters],
    queryFn: async () => {
      const qs = buildQueryString();
      const res = await axios.get(`${API_BASE_URL}/api/v1/Attendance/register?${qs}`);
      return res.data;
    }
  });

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="h-[400px] w-full rounded-2xl" /></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Attendance Register</h3>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {!externalFilters && (
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input 
                placeholder="Search employee..." 
                className="pl-9 rounded-full bg-slate-50 dark:bg-slate-900 border-none h-9" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          )}
          <Button variant="outline" size="sm" className="rounded-full h-9">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Employee</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Shift</th>
              <th className="px-6 py-4 font-semibold">Check In</th>
              <th className="px-6 py-4 font-semibold">Check Out</th>
              <th className="px-6 py-4 font-semibold">Work Hrs</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {(!data?.items || data.items.length === 0) ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No records found.</td></tr>
            ) : data.items.map((record: any) => (
              <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <Link to={`/admin/attendance/employee/${record.employeeId}`} className="hover:text-primary transition-colors">
                    {record.employeeName}
                  </Link>
                  <div className="text-xs text-slate-500 font-normal">{record.designation}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{record.department}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{record.shift}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300">{record.checkIn || '--:--'}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-slate-300">{record.checkOut || '--:--'}</td>
                <td className="px-6 py-4 font-medium">{record.workingHours > 0 ? `${record.workingHours}h` : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    record.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    record.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <div>Showing {data?.items?.length || 0} of {data?.totalCount || 0} entries</div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-8 h-8 p-0 rounded-full" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-8 h-8 p-0 rounded-full" 
            disabled={!data || data.items.length < pageSize}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
