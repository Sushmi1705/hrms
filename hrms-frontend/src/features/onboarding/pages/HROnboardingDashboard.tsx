import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Users, Briefcase, FileText, CheckCircle, AlertTriangle, BarChart2, TrendingUp, Calendar, Search, Filter } from 'lucide-react';
import { JoiningEmployeesList } from '../components/JoiningEmployeesList';
import { PreBoarding } from '../components/PreBoarding';
import { Documents } from '../components/Documents';
import { BackgroundVerification } from '../components/BackgroundVerification';
import { EquipmentIT } from '../components/EquipmentIT';
import { TaskChecklist } from '../components/TaskChecklist';
import { Probation } from '../components/Probation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function HROnboardingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const analytics = {
    joiningToday: 14,
    joiningThisWeek: 45,
    pendingTasks: 120,
    pendingDocuments: 34,
    activeBackgroundChecks: 56,
    equipmentPending: 23,
    itAccountsPending: 18,
    probationEmployees: 156
  };

  const departmentHiring = [
    { name: 'Engineering', value: 45 },
    { name: 'Sales', value: 25 },
    { name: 'Marketing', value: 15 },
    { name: 'HR', value: 8 },
    { name: 'Finance', value: 7 }
  ];
  
  const completionStatus = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#f59e0b' },
    { name: 'Not Started', value: 10, color: '#ef4444' }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen pb-10">
      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Onboarding</h1>
            <p className="text-slate-500 mt-1">New Hire Integration & Tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Trigger Workflow</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto inline-flex gap-1 shadow-sm w-max min-w-full">
              <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Dashboard</TabsTrigger>
              <TabsTrigger value="joining" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Joining Employees</TabsTrigger>
              <TabsTrigger value="preboarding" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Pre-Boarding</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Documents</TabsTrigger>
              <TabsTrigger value="background" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Background Verification</TabsTrigger>
              <TabsTrigger value="equipment" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Equipment & IT</TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Task Checklist</TabsTrigger>
              <TabsTrigger value="probation" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Probation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Joining This Week</p><h3 className="text-2xl font-bold text-slate-800">{analytics.joiningThisWeek}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-sky-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-lg"><FileText className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Documents</p><h3 className="text-2xl font-bold text-slate-800">{analytics.pendingDocuments}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Tasks</p><h3 className="text-2xl font-bold text-slate-800">{analytics.pendingTasks}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-rose-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Equipment Pending</p><h3 className="text-2xl font-bold text-slate-800">{analytics.equipmentPending}</h3></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Department Hiring Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentHiring} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24}>
                          {departmentHiring.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Overall Onboarding Completion</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={completionStatus} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                          {completionStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
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

          <TabsContent value="joining" className="mt-6"><JoiningEmployeesList /></TabsContent>
          <TabsContent value="preboarding" className="mt-6"><PreBoarding /></TabsContent>
          <TabsContent value="documents" className="mt-6"><Documents /></TabsContent>
          <TabsContent value="background" className="mt-6"><BackgroundVerification /></TabsContent>
          <TabsContent value="equipment" className="mt-6"><EquipmentIT /></TabsContent>
          <TabsContent value="tasks" className="mt-6"><TaskChecklist /></TabsContent>
          <TabsContent value="probation" className="mt-6"><Probation /></TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

