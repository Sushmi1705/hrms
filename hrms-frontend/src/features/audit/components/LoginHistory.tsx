import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export function LoginHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['LoginHistory', page, search],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/audit/login-history?page=` + page + `&search=` + search);
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    }
  });

  const getStatusBadge = (val: string) => {
    if (val === 'Delivered' || val === 'Active' || val === 'Success' || val === 'Information') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> {val}</span>;
    }
    if (val === 'Warning') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> {val}</span>;
    }
    if (val === 'Failed' || val === 'Error' || val === 'Critical' || val === 'Locked' || val === 'High') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> {val}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{val}</span>;
  };

  const renderSkeleton = () => (
    [1, 2, 3, 4, 5].map((i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td> <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td> <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td> <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td> <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td> <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-8"></div></td>
      </tr>
    ))
  );

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Session Login History</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Track user logins, IP addresses, and device usage</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" 
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}><RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}/></Button>
          <Button variant="outline" className="flex items-center gap-2"><Filter className="w-4 h-4"/> Filter</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
<th className='px-6 py-3'>Timestamp</th><th className='px-6 py-3'>User</th><th className='px-6 py-3'>IP Address</th><th className='px-6 py-3'>Browser</th><th className='px-6 py-3'>Device</th><th className='px-6 py-3'>Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? renderSkeleton() : isError ? (
                <tr><td colSpan={10} className="px-6 py-8 text-center text-red-500">Error loading data. Ensure API is running.</td></tr>
              ) : data?.items?.length === 0 || (!data?.items && data?.length === 0) ? (
                <tr><td colSpan={10} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : (
                (data?.items || data || []).map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
<td className='px-6 py-4 whitespace-nowrap'>{new Date(item.createdAt).toLocaleString()}</td><td className='px-6 py-4 whitespace-nowrap font-medium'>{item.userName}</td><td className='px-6 py-4 whitespace-nowrap font-mono text-xs'>{item.ipAddress}</td><td className='px-6 py-4 whitespace-nowrap'>{item.browser} ({item.operatingSystem})</td><td className='px-6 py-4 whitespace-nowrap'>{item.device}</td><td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4 text-slate-500"/></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing page {page}</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={isLoading || !(data?.items?.length >= 10)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

