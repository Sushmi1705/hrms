import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, FileText, Send } from 'lucide-react';

export function OfferManagement() {
  const [showToast, setShowToast] = useState(false);

  const offers = [
    { id: 1, candidate: 'David Wilson', role: 'Frontend Dev', package: '$95,000', joining: '2026-09-15', status: 'Pending Acceptance' },
    { id: 2, candidate: 'Elena Rodriguez', role: 'Data Scientist', package: '$140,000', joining: '2026-10-01', status: 'Draft' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Offer Sent</p><p className="text-emerald-100 text-sm">Offer letter emailed to candidate.</p></div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Offer Management</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><FileText className="w-4 h-4 mr-2" /> Generate Offer</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Candidate Name</th><th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">CTC Package</th><th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offers.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{o.candidate}</td>
                  <td className="px-6 py-4 text-slate-500">{o.role}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{o.package}</td>
                  <td className="px-6 py-4 text-slate-500">{o.joining}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status === 'Pending Acceptance' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-600"><FileText className="w-4 h-4 mr-2" /> View</Button>
                    {o.status === 'Draft' && (
                      <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="ghost" size="sm" className="text-indigo-600"><Send className="w-4 h-4 mr-2" /> Send</Button>
                    )}
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

