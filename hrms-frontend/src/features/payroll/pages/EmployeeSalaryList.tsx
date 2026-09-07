import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Edit } from 'lucide-react';

export function EmployeeSalaryList() {
  const employees = [
    { id: 1, name: 'Jane Smith', role: 'Engineering Director', band: 'Management Band (Level 2)', gross: '$14,200', active: true },
    { id: 2, name: 'Michael Brown', role: 'Senior Developer', band: 'Professional Band (Level 3)', gross: '$8,500', active: true },
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Employee Salary Mapping</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Salary Structure</th>
                  <th className="px-6 py-4">Monthly Gross</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{e.name}</td>
                    <td className="px-6 py-4 text-slate-500">{e.role}</td>
                    <td className="px-6 py-4 text-indigo-600">{e.band}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{e.gross}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-slate-600"><Edit className="w-4 h-4" /></Button>
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
