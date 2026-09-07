import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, FileText, PieChart, Clock } from 'lucide-react';

export function ShiftReports() {
  const reports = [
    { title: 'Shift Roster Export', desc: 'Download the complete organization roster for the current month in Excel.', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Overtime Eligibility Report', desc: 'List of employees eligible for overtime based on their shift assignments.', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Night Shift Allowance', desc: 'Extract employees who completed night shifts for payroll processing.', icon: PieChart, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((r, i) => (
          <Card key={i} className="shadow-sm hover:shadow-md transition-shadow border border-slate-200">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className={`p-3 rounded-lg ${r.bg} ${r.color} h-min`}>
                  <r.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{r.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{r.desc}</p>
                  <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Download className="w-4 h-4 mr-2" /> Generate CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
