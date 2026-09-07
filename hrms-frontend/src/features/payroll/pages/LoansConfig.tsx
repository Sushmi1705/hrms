import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, CheckCircle, Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function LoansConfig() {
  const [showToast, setShowToast] = useState(false);
  const loans = [
    { id: 1, employee: 'Jane Smith', type: 'Personal', principal: '$50,000', emi: '$4,300', remaining: '$30,000', status: 'Active' },
    { id: 2, employee: 'Michael Brown', type: 'Car', principal: '$150,000', emi: '$12,500', remaining: '$150,000', status: 'Pending Approval' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">Loan approved and disbursed.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Loans & Advances</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search employee..." className="pl-9 w-64 bg-white" />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2" /> New Loan</Button>
        </div>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr><th className="px-6 py-4">Employee</th><th className="px-6 py-4">Loan Type</th><th className="px-6 py-4">Principal</th><th className="px-6 py-4">Monthly EMI</th><th className="px-6 py-4">Remaining Balance</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{l.employee}</td>
                  <td className="px-6 py-4 text-slate-500">{l.type}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{l.principal}</td>
                  <td className="px-6 py-4 text-slate-500">{l.emi}</td>
                  <td className="px-6 py-4 text-rose-600 font-medium">{l.remaining}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${l.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{l.status}</span></td>
                  <td className="px-6 py-4 text-right"><Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="ghost" size="sm" className="text-indigo-600">Approve</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
