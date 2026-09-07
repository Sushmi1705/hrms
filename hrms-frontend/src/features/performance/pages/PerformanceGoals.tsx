import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Target, Search, Filter, CheckCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function PerformanceGoals() {
  const [showToast, setShowToast] = useState(false);
  
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const goals = [
    { id: 1, title: 'Increase Q3 Revenue by 15%', owner: 'Sales Department', type: 'Department', weight: 40, status: 'In Progress', progress: 65 },
    { id: 2, title: 'Launch Enterprise Shift Module', owner: 'Engineering Team', type: 'Department', weight: 30, status: 'Completed', progress: 100 },
    { id: 3, title: 'Reduce Server Latency to < 100ms', owner: 'John Doe', type: 'Individual', weight: 20, status: 'Overdue', progress: 45 }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Action Completed</p>
            <p className="text-emerald-100 text-sm">New Goal assigned successfully.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Goals & OKRs</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
          <Button onClick={handleAction} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Target className="w-4 h-4 mr-2" /> New Goal</Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Goal Title</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goals.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{g.title}</td>
                    <td className="px-6 py-4 text-slate-600">{g.owner}</td>
                    <td className="px-6 py-4 text-slate-500">{g.type}</td>
                    <td className="px-6 py-4 text-slate-500">{g.weight}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${g.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : g.status === 'Overdue' ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${g.status === 'Completed' ? 'bg-emerald-500' : g.status === 'Overdue' ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${g.progress}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Update</Button>
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
