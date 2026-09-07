import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, CheckCircle, FileText } from 'lucide-react';

export function PayrollReports() {
  const [showToast, setShowToast] = useState(false);
  
  const reports = [
    { id: 1, name: 'Monthly Salary Register', format: 'Excel' },
    { id: 2, name: 'Bank Transfer File', format: 'CSV' },
    { id: 3, name: 'Tax Deduction Report', format: 'PDF' },
    { id: 4, name: 'PF & Statutory Report', format: 'Excel' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">Report download initiated.</p></div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Payroll Reports</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map(r => (
          <Card key={r.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-medium text-slate-800 mb-2">{r.name}</h3>
              <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <Download className="w-4 h-4 mr-2" /> Download {r.format}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
