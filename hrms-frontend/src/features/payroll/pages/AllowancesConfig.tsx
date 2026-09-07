import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, CheckCircle } from 'lucide-react';

export function AllowancesConfig() {
  const [showToast, setShowToast] = useState(false);
  const allowances = [
    { id: 1, name: 'House Rent Allowance (HRA)', type: 'Fixed', taxExempt: 'Partial', active: true },
    { id: 2, name: 'Transport Allowance', type: 'Fixed', taxExempt: 'Full', active: true },
    { id: 3, name: 'Performance Bonus', type: 'Variable', taxExempt: 'None', active: true },
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">New allowance component added.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Allowances & Bonuses</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add Allowance</Button>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr><th className="px-6 py-4">Component Name</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Tax Exemption</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allowances.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{a.name}</td>
                  <td className="px-6 py-4 text-slate-500">{a.type}</td>
                  <td className="px-6 py-4 text-slate-500">{a.taxExempt}</td>
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
