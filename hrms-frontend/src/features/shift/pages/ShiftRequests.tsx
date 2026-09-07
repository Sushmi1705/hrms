import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Check, X } from 'lucide-react';

export function ShiftRequests() {
  const requests = [
    { id: 1, employee: 'John Doe', type: 'Shift Swap', current: 'Morning', requested: 'Evening', reason: 'Personal appointment', date: '2026-08-28', status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Change Shift', current: 'Night', requested: 'General', reason: 'Health reasons', date: '2026-09-01', status: 'Pending' }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Pending Shift Requests</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Request Type</th>
                  <th className="px-6 py-4">Current Shift</th>
                  <th className="px-6 py-4">Requested Shift</th>
                  <th className="px-6 py-4">Date Effect</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.employee}</td>
                    <td className="px-6 py-4 text-slate-600">{r.type}</td>
                    <td className="px-6 py-4 text-slate-500">{r.current}</td>
                    <td className="px-6 py-4 text-indigo-600 font-medium">{r.requested}</td>
                    <td className="px-6 py-4 text-slate-600">{r.date}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{r.reason}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 p-0"><Check className="w-4 h-4" /></Button>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white h-8 w-8 p-0"><X className="w-4 h-4" /></Button>
                      </div>
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
