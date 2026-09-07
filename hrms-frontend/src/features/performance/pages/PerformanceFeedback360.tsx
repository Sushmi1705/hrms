import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle } from 'lucide-react';

export function PerformanceFeedback360() {
  const [showToast, setShowToast] = useState(false);
  
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const feedbacks = [
    { id: 1, target: 'Jane Smith', reviewer: 'Anonymous', relationship: 'Peer', rating: 4.8, strengths: 'Excellent problem solving', isAnon: true },
    { id: 2, target: 'Michael Brown', reviewer: 'John Doe', relationship: 'Subordinate', rating: 3.5, strengths: 'Clear communication', isAnon: false }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Action Completed</p>
            <p className="text-emerald-100 text-sm">Feedback request sent to peers.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">360-Degree Feedback</h2>
        <Button onClick={handleAction} className="bg-indigo-600 hover:bg-indigo-700 text-white">Request Feedback</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Target Employee</th>
                  <th className="px-6 py-4">Reviewer</th>
                  <th className="px-6 py-4">Relationship</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Key Strengths</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{f.target}</td>
                    <td className="px-6 py-4 text-slate-500">{f.isAnon ? <span className="italic">Anonymous</span> : f.reviewer}</td>
                    <td className="px-6 py-4 text-slate-600">{f.relationship}</td>
                    <td className="px-6 py-4 text-indigo-600 font-semibold">{f.rating} / 5.0</td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{f.strengths}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600">Read</Button>
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
