import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';

export function InterviewManagement() {
  const [showToast, setShowToast] = useState(false);

  const interviews = [
    { id: 1, candidate: 'Michael Chen', role: 'Backend Eng.', round: 'Technical Round 1', date: 'Today, 2:00 PM', duration: '60 min', panel: 'Alice Cooper', status: 'Scheduled' },
    { id: 2, candidate: 'Sarah Jenkins', role: 'Product Mgr', round: 'HR Final', date: 'Tomorrow, 11:00 AM', duration: '30 min', panel: 'Bob Smith', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Feedback Submitted</p><p className="text-emerald-100 text-sm">Interview ratings saved successfully.</p></div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Upcoming Interviews</h2>
        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Calendar className="w-4 h-4 mr-2" /> Schedule Interview</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map(i => (
          <Card key={i.id} className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{i.candidate}</h3>
                  <p className="text-sm text-slate-500">{i.role}</p>
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">{i.round}</span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> {i.date}</div>
                <div className="flex items-center text-sm text-slate-600"><Clock className="w-4 h-4 mr-2 text-slate-400" /> {i.duration}</div>
                <div className="flex items-center text-sm text-slate-600"><Video className="w-4 h-4 mr-2 text-slate-400" /> Microsoft Teams</div>
              </div>
              <div className="flex gap-2">
                <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Join Call</Button>
                <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="outline" className="w-full">Feedback</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

