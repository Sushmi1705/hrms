import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, Search, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function JobRequisitions() {
  const [showToast, setShowToast] = useState(false);
  const requisitions = [
    { id: 1, title: 'Senior Backend Engineer', dept: 'Engineering', hiringManager: 'Alice Cooper', budget: '$120,000', status: 'Approved' },
    { id: 2, title: 'HR Specialist', dept: 'HR & Admin', hiringManager: 'Bob Smith', budget: '$65,000', status: 'Pending Approval' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">Action completed successfully.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Job Requisitions</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search requisitions..." className="pl-9 w-64 bg-white" />
          </div>
          <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </div>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Job Title</th><th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Hiring Manager</th><th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requisitions.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{r.title}</td>
                  <td className="px-6 py-4 text-slate-500">{r.dept}</td>
                  <td className="px-6 py-4 text-slate-500">{r.hiringManager}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{r.budget}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" className="text-indigo-600" onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
