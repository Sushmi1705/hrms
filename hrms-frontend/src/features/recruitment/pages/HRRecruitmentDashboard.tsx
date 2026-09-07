import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Users, Briefcase, FileText, CheckCircle, AlertTriangle, 
  BarChart2, TrendingUp, Calendar, Search, Filter, Plus, UserPlus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// Import subcomponents (which we will build next)
import { HiringPipeline } from './HiringPipeline';
import { JobOpenings } from './JobOpenings';
import { CandidateDatabase } from './CandidateDatabase';
import { InterviewManagement } from './InterviewManagement';
import { OfferManagement } from './OfferManagement';
import { JobRequisitions } from './JobRequisitions';

export function HRRecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showGlobalToast, setShowGlobalToast] = useState(false);
  const [globalToastMsg, setGlobalToastMsg] = useState('');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  
  const handleGlobalAction = (msg: string) => {
    setGlobalToastMsg(msg);
    setShowGlobalToast(true);
    setTimeout(() => setShowGlobalToast(false), 3000);
  };

  const [analytics, setAnalytics] = useState<any>({
    activeJobOpenings: 12,
    totalActiveCandidates: 543,
    applicationsInPipeline: 1042,
    interviewsScheduledThisWeek: 45,
    offersAccepted: 18,
    offersSent: 25,
    hiresThisMonth: 14,
    averageTimeToHireDays: 24.5
  });

  const hiringFunnel = [
    { name: 'Applied', value: 1042 },
    { name: 'Screening', value: 450 },
    { name: 'Technical', value: 120 },
    { name: 'HR Round', value: 60 },
    { name: 'Offered', value: 25 },
    { name: 'Hired', value: 18 }
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 45, color: '#0077B5' },
    { name: 'Career Site', value: 25, color: '#10b981' },
    { name: 'Referrals', value: 20, color: '#f59e0b' },
    { name: 'Agency', value: 10, color: '#6366f1' }
  ];

  const COLORS = ['#0077B5', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen pb-10">
      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        {showGlobalToast && (
          <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100]">
            <CheckCircle className="w-5 h-5" />
            <div><p className="font-medium">Success</p><p className="text-emerald-100 text-sm">{globalToastMsg}</p></div>
          </div>
        )}
        
                {/* Modals */}
        {isPostJobModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Post New Job Opening</h2>
                <p className="text-sm text-slate-500 mt-1">Create a new job requisition and publish to career site.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Job Title</label><Input placeholder="e.g. Senior Frontend Engineer" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Department</label><Input placeholder="e.g. Engineering" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Location</label><Input placeholder="e.g. Remote" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Employment Type</label><Input placeholder="e.g. Full-time" /></div>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Job Description</label><textarea className="w-full min-h-[100px] p-3 rounded-md border border-slate-200" placeholder="Enter job requirements..."></textarea></div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsPostJobModalOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { setIsPostJobModalOpen(false); handleGlobalAction("Job Opening Published Successfully!"); }}>Publish Job</Button>
              </div>
            </div>
          </div>
        )}

        {isAddCandidateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Add Candidate Manually</h2>
                <p className="text-sm text-slate-500 mt-1">Enter candidate details or upload resume.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-sm font-medium">First Name</label><Input placeholder="John" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Last Name</label><Input placeholder="Doe" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" placeholder="john@example.com" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input placeholder="+1 234 567 890" /></div>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Applying For</label><Input placeholder="e.g. Senior Frontend Engineer" /></div>
                <div className="mt-4 p-6 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                  <p className="text-sm text-slate-500">Drag and drop resume here, or <span className="text-indigo-600 font-medium cursor-pointer">browse</span></p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddCandidateModalOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { setIsAddCandidateModalOpen(false); handleGlobalAction("Candidate Added Successfully!"); }}>Save Candidate</Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Talent Acquisition</h1>
            <p className="text-slate-500 mt-1">Enterprise Applicant Tracking System</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsPostJobModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2"/> Post New Job</Button>
            <Button onClick={() => setIsAddCandidateModalOpen(true)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"><UserPlus className="w-4 h-4 mr-2"/> Add Candidate</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto inline-flex gap-1 shadow-sm w-max min-w-full">
              <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Dashboard</TabsTrigger>
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Hiring Pipeline (Kanban)</TabsTrigger>
              <TabsTrigger value="requisitions" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Job Requisitions</TabsTrigger>
              <TabsTrigger value="openings" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Job Openings</TabsTrigger>
              <TabsTrigger value="candidates" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Candidate Database</TabsTrigger>
              <TabsTrigger value="interviews" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Interviews</TabsTrigger>
              <TabsTrigger value="offers" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Offers & Onboarding</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Active Job Openings</p><h3 className="text-2xl font-bold text-slate-800">{analytics.activeJobOpenings}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-sky-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-lg"><Users className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Candidates</p><h3 className="text-2xl font-bold text-slate-800">{analytics.totalActiveCandidates}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Hires This Month</p><h3 className="text-2xl font-bold text-slate-800">{analytics.hiresThisMonth}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Time to Hire (Days)</p><h3 className="text-2xl font-bold text-slate-800">{analytics.averageTimeToHireDays}</h3></div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Recruitment Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hiringFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Application Sources</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sourceData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline"><HiringPipeline /></TabsContent>
          <TabsContent value="requisitions"><JobRequisitions /></TabsContent>
          <TabsContent value="openings"><JobOpenings /></TabsContent>
          <TabsContent value="candidates"><CandidateDatabase /></TabsContent>
          <TabsContent value="interviews"><InterviewManagement /></TabsContent>
          <TabsContent value="offers"><OfferManagement /></TabsContent>

        </Tabs>
      </div>
    </div>
  );
}


