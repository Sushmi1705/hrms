import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, AlertTriangle, UserPlus, X } from 'lucide-react';

export function PerformancePips() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const handleInitiate = () => {
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pips = [
    { id: 1, employee: 'John Doe', coach: 'Michael Brown', status: 'Active', startDate: '2026-08-01', endDate: '2026-10-01', reason: 'Consistently missing targets' },
    { id: 2, employee: 'Sarah Connor', coach: 'Jane Smith', status: 'Extended', startDate: '2026-07-15', endDate: '2026-10-15', reason: 'Communication gaps' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">PIP Initiated</p>
            <p className="text-emerald-100 text-sm">Successfully created the Performance Improvement Plan.</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-lg shadow-xl animate-in zoom-in-95">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" /> Initiate PIP
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                  <select className="w-full border-slate-200 rounded-md text-sm p-2 border">
                    <option>Select Employee...</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Coach / Mentor</label>
                  <select className="w-full border-slate-200 rounded-md text-sm p-2 border">
                    <option>Select Coach...</option>
                    <option>Michael Brown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason for PIP</label>
                  <textarea className="w-full border-slate-200 rounded-md text-sm p-2 border h-20" placeholder="Describe the performance gap..."></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={handleInitiate} className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Plan</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Performance Improvement Plans (PIP)</h2>
        <Button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <AlertTriangle className="w-4 h-4 mr-2" /> Initiate PIP
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Coach</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pips.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.employee}</td>
                    <td className="px-6 py-4 text-slate-600">{p.coach}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'Active' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{p.startDate} to {p.endDate}</td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{p.reason}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Track</Button>
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
