import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';

export function DeductionsConfig() {
  const [showToast, setShowToast] = useState(false);
  const deductions = [
    { id: 1, name: 'Income Tax', type: 'Statutory', calculation: 'Percentage based on slabs', active: true },
    { id: 2, name: 'Provident Fund (PF)', type: 'Statutory', calculation: '12% of Basic Salary', active: true },
    { id: 3, name: 'Late Penalty', type: 'Policy', calculation: 'Variable based on attendance', active: true },
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">New deduction component added.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Deductions Configuration</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add Deduction</Button>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr><th className="px-6 py-4">Component Name</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Calculation Rule</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deductions.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{d.name}</td>
                  <td className="px-6 py-4 text-slate-500">{d.type}</td>
                  <td className="px-6 py-4 text-slate-500">{d.calculation}</td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" className="text-indigo-600">Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
