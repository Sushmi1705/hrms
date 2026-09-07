import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCostCenters, deleteCostCenter, CostCenterDto } from '../api/CostCenterApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Download, MoreHorizontal, FileEdit, Trash2, LayoutGrid, Loader2 } from 'lucide-react';

export function CostCenterList() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['CostCenters'], queryFn: getCostCenters });
  const [search, setSearch] = useState('');

  const deleteMutation = useMutation({
    mutationFn: deleteCostCenter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['CostCenters'] })
  });

  const filteredData = data?.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">CostCenters</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your organization's  records.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-white text-black border border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="shadow-md shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add CostCenter
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search by code or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 shadow-sm h-9" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-white text-slate-600 border border-slate-200 px-3 py-1.5">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </Button>
            <Button className="bg-white text-slate-600 border border-slate-200 px-3 py-1.5">
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                </th>
                <th className="px-6 py-4 uppercase text-xs tracking-wider font-semibold">Code</th>
                <th className="px-6 py-4 uppercase text-xs tracking-wider font-semibold">Name</th>
                <th className="px-6 py-4 uppercase text-xs tracking-wider font-semibold">Status</th>
                <th className="px-6 py-4 uppercase text-xs tracking-wider font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                      <p>Loading records...</p>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/10">
                    Error connecting to backend API.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredData?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900 dark:text-white">No records found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredData?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{item.code}</td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-sm text-slate-500">
          <div>Showing <span className="font-medium text-slate-900 dark:text-white">{filteredData?.length || 0}</span> results</div>
          <div className="flex gap-1">
            <Button className="bg-white text-slate-600 border border-slate-200 px-3 py-1.5 opacity-50 cursor-not-allowed">Previous</Button>
            <Button className="bg-white text-slate-600 border border-slate-200 px-3 py-1.5 opacity-50 cursor-not-allowed">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
