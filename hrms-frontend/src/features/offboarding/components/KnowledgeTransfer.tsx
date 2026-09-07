import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function KnowledgeTransfer() {
  const data = [{name:'Alex Turner', rep:'Yes', kt:'In Progress', mgr:'Pending', status:'In Progress'},{name:'Tom Holland', rep:'Yes', kt:'Done', mgr:'Approved', status:'Completed'}];

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Knowledge Transfer</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Ensure proper handover of responsibilities</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
          </div>
          <Button variant="outline" className="flex items-center gap-2"><Filter className="w-4 h-4"/> Filter</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
<th className='px-6 py-3'>Employee</th><th className='px-6 py-3'>Replacement Assigned</th><th className='px-6 py-3'>KT Plan Documented</th><th className='px-6 py-3'>Manager Sign-off</th><th className='px-6 py-3'>Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  {Object.values(item).map((val, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      {val === 'Completed' || val === 'Approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> {val}</span>
                      ) : val === 'Pending' || val === 'In Progress' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> {val}</span>
                      ) : val === 'Rejected' || val === 'Failed' || val === 'Overdue' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> {val}</span>
                      ) : (
                        <span className="text-slate-700">{val}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4 text-slate-500"/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to {data.length} of {data.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

