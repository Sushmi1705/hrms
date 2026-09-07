import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Search, Download, User } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export function CandidateDatabase() {
  const candidates = [
    { id: 1, name: 'Michael Chen', email: 'michael.c@example.com', role: 'Backend Engineer', source: 'LinkedIn', score: 85 },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Product Manager', source: 'Referral', score: 92 },
    { id: 3, name: 'David Wilson', email: 'david.w@example.com', role: 'Frontend Dev', source: 'Career Site', score: 78 }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Candidate Database</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by skills or name..." className="pl-9 w-80 bg-white" />
          </div>
        </div>
      </div>
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Candidate Name</th><th className="px-6 py-4">Applied Role</th>
                <th className="px-6 py-4">Source</th><th className="px-6 py-4">Match Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600"><User className="w-4 h-4" /></div>
                      <div>
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.role}</td>
                  <td className="px-6 py-4 text-slate-500">{c.source}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${c.score}%` }}></div>
                      </div>
                      <span className="text-xs font-medium">{c.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-600"><Download className="w-4 h-4 mr-2" /> Resume</Button>
                    <Button variant="ghost" size="sm" className="text-indigo-600">Profile</Button>
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
