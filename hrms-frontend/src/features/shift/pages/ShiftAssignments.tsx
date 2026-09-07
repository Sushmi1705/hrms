import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Users, CalendarRange, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function ShiftAssignments() {
  const [loading, setLoading] = useState(false);
  const assignments = [
    { id: 1, employee: 'John Doe', dept: 'Engineering', shift: 'Morning Shift', pattern: 'Weekly', nextChange: '2026-09-01' },
    { id: 2, employee: 'Jane Smith', dept: 'Sales', shift: 'General Shift', pattern: 'Fixed', nextChange: '-' },
    { id: 3, employee: 'Michael Brown', dept: 'Support', shift: 'Night Shift', pattern: 'Bi-Weekly', nextChange: '2026-09-15' },
    { id: 4, employee: 'Sarah Connor', dept: 'Engineering', shift: 'Morning Shift', pattern: 'Weekly', nextChange: '2026-09-01' }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Bulk Shift Assignments</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Filter className="w-4 h-4 mr-2" /> Filter Roster
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Users className="w-4 h-4 mr-2" /> Assign Shifts
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search employee assignments..." className="pl-9" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Current Shift</th>
                  <th className="px-6 py-4">Rotation Pattern</th>
                  <th className="px-6 py-4">Next Change</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{a.employee}</td>
                    <td className="px-6 py-4 text-slate-500">{a.dept}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {a.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{a.pattern}</td>
                    <td className="px-6 py-4 text-slate-500">{a.nextChange}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800">Change</Button>
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
