import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Target, Award, AlertTriangle, TrendingUp, Download, CheckCircle, 
  BarChart2, Users, FileText, ClipboardList
} from 'lucide-react';
import { PerformanceReviewCycles } from './PerformanceReviewCycles';
import { PerformanceGoals } from './PerformanceGoals';
import { PerformanceReviewsList } from './PerformanceReviewsList';
import { PerformanceFeedback360 } from './PerformanceFeedback360';
import { PerformanceCompetencies } from './PerformanceCompetencies';
import { PerformancePips } from './PerformancePips';
import { PerformancePromotions } from './PerformancePromotions';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export function HRPerformanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showToast, setShowToast] = useState(false);
  
  const handleLaunch = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  const [analytics, setAnalytics] = useState<any>({
    activePips: 14,
    pendingReviews: 45,
    completedReviews: 120,
    averageRating: 4.2,
    activeCycleName: 'Annual Performance Review 2026'
  });

  const ratingData = [
    { name: '1', count: 2 },
    { name: '2', count: 15 },
    { name: '3', count: 85 },
    { name: '4', count: 150 },
    { name: '5', count: 48 }
  ];

  const competencyData = [
    { subject: 'Leadership', A: 120, B: 110, fullMark: 150 },
    { subject: 'Communication', A: 98, B: 130, fullMark: 150 },
    { subject: 'Technical', A: 86, B: 130, fullMark: 150 },
    { subject: 'Problem Solving', A: 99, B: 100, fullMark: 150 },
    { subject: 'Innovation', A: 85, B: 90, fullMark: 150 },
    { subject: 'Teamwork', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Performance Management</h1>
            <p className="text-slate-500 mt-1">Active Cycle: {analytics.activeCycleName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2"/> Export Reports</Button>
            <Button onClick={handleLaunch} className="bg-indigo-600 hover:bg-indigo-700 text-white"><FileText className="w-4 h-4 mr-2"/> Launch New Cycle</Button>
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Action Completed</p>
              <p className="text-emerald-100 text-sm">New performance cycle launched organization-wide.</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto flex flex-wrap gap-1 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Dashboard</TabsTrigger>
            <TabsTrigger value="cycles" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Review Cycles</TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Goals (OKR)</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Performance Reviews</TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">360 Feedback</TabsTrigger>
            <TabsTrigger value="competencies" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Competencies</TabsTrigger>
            <TabsTrigger value="pips" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">PIP Workflows</TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Promotions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Average Rating</p><h3 className="text-2xl font-bold text-slate-800">{analytics.averageRating} <span className="text-sm text-slate-400 font-normal">/ 5.0</span></h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Completed Reviews</p><h3 className="text-2xl font-bold text-slate-800">{analytics.completedReviews}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><ClipboardList className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Reviews</p><h3 className="text-2xl font-bold text-slate-800">{analytics.pendingReviews}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-rose-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Employees on PIP</p><h3 className="text-2xl font-bold text-slate-800">{analytics.activePips}</h3></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Organization Bell Curve (Calibration)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ratingData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#c7d2fe" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Organization Competency Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar name="Q1 Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                        <Radar name="Q2 Score" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                        <RechartsTooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cycles"><PerformanceReviewCycles /></TabsContent>
          <TabsContent value="goals"><PerformanceGoals /></TabsContent>
          <TabsContent value="reviews"><PerformanceReviewsList /></TabsContent>
          <TabsContent value="feedback"><PerformanceFeedback360 /></TabsContent>
          <TabsContent value="competencies"><PerformanceCompetencies /></TabsContent>
          <TabsContent value="pips"><PerformancePips /></TabsContent>
          <TabsContent value="promotions"><PerformancePromotions /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


