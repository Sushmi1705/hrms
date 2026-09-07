import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { User, Calendar, CheckCircle } from 'lucide-react';

export function HiringPipeline() {
  const [showToast, setShowToast] = useState(false);

  // Kanban Data
  const stages = [
    { id: 'applied', title: 'Applied', count: 12 },
    { id: 'screening', title: 'Screening', count: 8 },
    { id: 'technical', title: 'Technical', count: 4 },
    { id: 'hr', title: 'HR Round', count: 3 },
    { id: 'offered', title: 'Offered', count: 2 }
  ];

  const candidates = [
    { id: 1, name: 'Michael Chen', role: 'Backend Eng.', stage: 'technical', date: '2d ago' },
    { id: 2, name: 'Sarah Jenkins', role: 'Product Mgr', stage: 'hr', date: '1d ago' },
    { id: 3, name: 'David Wilson', role: 'Frontend Dev', stage: 'offered', date: '4h ago' },
    { id: 4, name: 'Emma Watson', role: 'HR Spec.', stage: 'screening', date: '3d ago' },
    { id: 5, name: 'John Smith', role: 'Backend Eng.', stage: 'applied', date: '5h ago' }
  ];

  return (
    <div className="space-y-6 mt-6 relative h-[700px] flex flex-col">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
          <CheckCircle className="w-5 h-5" />
          <div><p className="font-medium">Moved</p><p className="text-emerald-100 text-sm">Candidate successfully moved to next stage.</p></div>
        </div>
      )}
      
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-xl font-semibold text-slate-800">Hiring Pipeline</h2>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {stages.map(stage => (
            <div key={stage.id} className="w-80 bg-slate-100/50 rounded-xl border border-slate-200 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur flex justify-between items-center sticky top-0">
                <h3 className="font-semibold text-slate-700">{stage.title}</h3>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">{stage.count}</span>
              </div>
              <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                {candidates.filter(c => c.stage === stage.id).map(c => (
                  <Card key={c.id} className="shadow-sm border border-slate-200 cursor-grab hover:border-indigo-300 transition-colors bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">{c.name.charAt(0)}</div>
                          <div>
                            <p className="font-medium text-sm text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {c.date}</span>
                        <Button onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} variant="ghost" className="h-6 px-2 text-indigo-600 hover:bg-indigo-50">Move</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {candidates.filter(c => c.stage === stage.id).length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">No candidates</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
