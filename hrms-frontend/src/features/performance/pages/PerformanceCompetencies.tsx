import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle } from 'lucide-react';

export function PerformanceCompetencies() {
  const [showToast, setShowToast] = useState(false);
  
  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const data = [
    { subject: 'Leadership', A: 120, fullMark: 150 },
    { subject: 'Communication', A: 98, fullMark: 150 },
    { subject: 'Technical', A: 86, fullMark: 150 },
    { subject: 'Problem Solving', A: 99, fullMark: 150 },
    { subject: 'Innovation', A: 85, fullMark: 150 },
    { subject: 'Teamwork', A: 65, fullMark: 150 },
  ];

  return (
    <div className="space-y-6 mt-6 relative">
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Action Completed</p>
            <p className="text-emerald-100 text-sm">Competency Evaluation assigned.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Competency Assessments</h2>
        <Button onClick={handleAction} className="bg-indigo-600 hover:bg-indigo-700 text-white">Evaluate Employee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">John Doe - Competency Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
