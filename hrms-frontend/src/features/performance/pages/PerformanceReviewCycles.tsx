import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, Search, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function PerformanceReviewCycles() {
  const [showToast, setShowToast] = useState(false);
  
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cycles = [
    { id: 1, name: 'Annual Performance Review 2026', type: 'Yearly', start: '2026-01-01', end: '2026-12-31', status: 'Active', progress: 65 },
    { id: 2, name: 'Q3 Pulse Check 2026', type: 'Quarterly', start: '2026-07-01', end: '2026-09-30', status: 'Draft', progress: 0 },
    { id: 3, name: 'Annual Performance Review 2025', type: 'Yearly', start: '2025-01-01', end: '2025-12-31', status: 'Archived', progress: 100 }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Action Completed</p>
            <p className="text-emerald-100 text-sm">Review Cycle created successfully.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Review Cycles</h2>
        <Button onClick={handleAction} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Cycle
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search cycles..." className="pl-9" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Cycle Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Completion</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cycles.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                    <td className="px-6 py-4 text-slate-600">{c.type}</td>
                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-slate-400"/> {c.start} to {c.end}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : c.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${c.progress === 100 ? 'bg-slate-500' : 'bg-indigo-600'}`} style={{ width: `${c.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Configure</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
