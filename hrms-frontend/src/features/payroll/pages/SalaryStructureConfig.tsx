import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';

export function SalaryStructureConfig() {
  const [showToast, setShowToast] = useState(false);

  const structures = [
    { id: 1, band: 'Executive Band (Level 1)', base: '$150,000', components: 8, active: true },
    { id: 2, band: 'Management Band (Level 2)', base: '$90,000', components: 6, active: true },
    { id: 3, band: 'Professional Band (Level 3)', base: '$50,000', components: 5, active: true },
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Saved</p>
            <p className="text-emerald-100 text-sm">Salary Structure template saved.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Salary Structures</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Structure
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Band / Name</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">Components</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {structures.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{s.band}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{s.base}</td>
                    <td className="px-6 py-4 text-slate-500">{s.components} Active</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Edit</Button>
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
