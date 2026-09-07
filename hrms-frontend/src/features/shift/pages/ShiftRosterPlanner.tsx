import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download } from 'lucide-react';

export function ShiftRosterPlanner() {
  const days = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28', 'Sat 29', 'Sun 30'];
  const employees = [
    { name: 'John Doe', role: 'Software Engineer', shifts: ['Morning', 'Morning', 'Morning', 'Morning', 'Morning', 'Off', 'Off'] },
    { name: 'Jane Smith', role: 'Support Agent', shifts: ['Night', 'Night', 'Night', 'Off', 'Night', 'Night', 'Off'] },
    { name: 'Michael Brown', role: 'Sales Exec', shifts: ['General', 'General', 'General', 'General', 'General', 'Off', 'Off'] },
    { name: 'Sarah Connor', role: 'Manager', shifts: ['General', 'General', 'Leave', 'Leave', 'General', 'Off', 'Off'] },
  ];

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'Morning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'General': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Night': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Leave': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Off': return 'bg-slate-100 text-slate-500 border-slate-200 border-dashed';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-800">Weekly Roster</h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button className="px-3 py-1.5 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
            <span className="px-4 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Aug 24 - Aug 30, 2026
            </span>
            <button className="px-3 py-1.5 hover:bg-slate-50 border-l border-slate-200"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white text-slate-600">Month View</Button>
          <Button className="bg-indigo-600 text-white">Publish Roster</Button>
        </div>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-500 min-w-[200px]">Employee</th>
                {days.map(d => (
                  <th key={d} className="px-2 py-3 font-medium text-slate-500 text-center min-w-[120px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{emp.name}</div>
                    <div className="text-xs text-slate-500">{emp.role}</div>
                  </td>
                  {emp.shifts.map((shift, j) => (
                    <td key={j} className="px-2 py-2">
                      <div className={`text-center py-2 px-1 rounded border text-xs font-medium cursor-pointer transition-all hover:shadow-sm ${getShiftColor(shift)}`}>
                        {shift}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
