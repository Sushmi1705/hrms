import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, CheckCircle, Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function PayslipsList() {
  const [showToast, setShowToast] = useState(false);

  const payslips = [
    { id: 1, employee: 'Jane Smith', month: 'August 2026', gross: '$12,500', net: '$10,250', status: 'Generated' },
    { id: 2, employee: 'Michael Brown', month: 'August 2026', gross: '$14,200', net: '$11,360', status: 'Generated' },
    { id: 3, employee: 'John Doe', month: 'August 2026', gross: '$8,500', net: '$7,200', status: 'Generated' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Downloaded</p>
            <p className="text-emerald-100 text-sm">Payslip PDF downloaded successfully.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Employee Payslips</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search employee..." className="pl-9 w-64 bg-white" />
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4">Gross Salary</th>
                  <th className="px-6 py-4">Net Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.employee}</td>
                    <td className="px-6 py-4 text-slate-600">{p.month}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{p.gross}</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">{p.net}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-medium">{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="outline" size="sm" className="text-slate-600">
                        <Download className="w-4 h-4 mr-2" /> PDF
                      </Button>
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
