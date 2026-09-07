import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Filter, Share2 } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function JobOpenings() {
  const openings = [
    { id: 1, title: 'Senior Backend Engineer', location: 'Remote', type: 'Full-time', vacancies: 2, status: 'Published' },
    { id: 2, title: 'Product Designer', location: 'New York, NY', type: 'Hybrid', vacancies: 1, status: 'Draft' }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Job Openings (Postings)</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search jobs..." className="pl-9 w-64 bg-white" />
          </div>
        </div>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Job Title</th><th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Type</th><th className="px-6 py-4">Vacancies</th>
                <th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openings.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{o.title}</td>
                  <td className="px-6 py-4 text-slate-500">{o.location}</td>
                  <td className="px-6 py-4 text-slate-500">{o.type}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{o.vacancies}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status === 'Published' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-indigo-600"><Share2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-slate-600">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
