import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, PlayCircle, CheckCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function PerformanceReviewsList() {
  const [showToast, setShowToast] = useState(false);
  
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const reviews = [
    { id: 1, employee: 'Jane Smith', manager: 'Michael Brown', cycle: 'Annual 2026', selfRating: 4.5, managerRating: 4.2, status: 'Manager Reviewed' },
    { id: 2, employee: 'John Doe', manager: 'Sarah Connor', cycle: 'Annual 2026', selfRating: 3.8, managerRating: null, status: 'Submitted' },
    { id: 3, employee: 'Alice Johnson', manager: 'Michael Brown', cycle: 'Annual 2026', selfRating: null, managerRating: null, status: 'Draft' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Action Completed</p>
            <p className="text-emerald-100 text-sm">Performance Review initiated.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Performance Reviews</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2"/> Filter Status</Button>
          <Button onClick={handleAction} className="bg-indigo-600 hover:bg-indigo-700 text-white"><PlayCircle className="w-4 h-4 mr-2" /> Start Review</Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Review Cycle</th>
                  <th className="px-6 py-4">Self Rating</th>
                  <th className="px-6 py-4">Manager Rating</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.employee}</td>
                    <td className="px-6 py-4 text-slate-600">{r.manager}</td>
                    <td className="px-6 py-4 text-slate-500">{r.cycle}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{r.selfRating ? `${r.selfRating} / 5.0` : '-'}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{r.managerRating ? `${r.managerRating} / 5.0` : '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.status === 'Manager Reviewed' ? 'bg-emerald-100 text-emerald-800' : r.status === 'Submitted' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">View</Button>
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
