import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Download, FileText, PieChart, TrendingUp, Users } from 'lucide-react';

export function LeaveReports() {
  const reports = [
    {
      id: 1,
      title: 'Leave Utilization Report',
      description: 'Detailed analysis of leave quota consumption across all departments.',
      icon: <PieChart className="w-8 h-8 text-indigo-500" />,
      lastRun: 'Today, 08:00 AM'
    },
    {
      id: 2,
      title: 'Loss of Pay (LOP) Summary',
      description: 'Monthly summary of unpaid leaves and unauthorized absences.',
      icon: <TrendingUp className="w-8 h-8 text-rose-500" />,
      lastRun: 'Yesterday, 18:30 PM'
    },
    {
      id: 3,
      title: 'Department Absence Trends',
      description: 'Comparison of absence rates between different business units.',
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      lastRun: 'Oct 15, 09:15 AM'
    },
    {
      id: 4,
      title: 'Carry Forward Balance Report',
      description: 'Year-end summary of unused leaves eligible for encashment or carry forward.',
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      lastRun: 'Dec 31, 23:59 PM'
    }
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Analytics & Export Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Generate and download enterprise-wide leave statistics and compliance reports.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800">
          <Download className="w-4 h-4 mr-2" /> Custom Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => (
          <Card key={report.id} className="hover:border-indigo-200 transition-colors cursor-pointer group shadow-sm">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{report.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400">Last generated: {report.lastRun}</span>
                  <Button variant="outline" size="sm" className="h-8 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                    <Download className="w-3 h-3 mr-2" /> Download CSV
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
