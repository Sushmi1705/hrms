import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { LogOut, FileCheck, HelpCircle, Archive, ClipboardList, Wallet, FileText, CheckCircle } from 'lucide-react';
import { Resignations } from '../components/Resignations';
import { ExitChecklist } from '../components/ExitChecklist';
import { AssetRecovery } from '../components/AssetRecovery';
import { KnowledgeTransfer } from '../components/KnowledgeTransfer';
import { ExitInterviews } from '../components/ExitInterviews';
import { FinalSettlement } from '../components/FinalSettlement';
import { Documentation } from '../components/Documentation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function HROffboardingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const analytics = {
    noticePeriodEmployees: 42,
    pendingClearances: 64,
    activeResignations: 18,
    exitInterviewsPending: 12,
    finalSettlementsPending: 8,
    assetsToRecover: 34
  };

  const attritionData = [
    { name: 'Jan', value: 4 },
    { name: 'Feb', value: 3 },
    { name: 'Mar', value: 7 },
    { name: 'Apr', value: 5 },
    { name: 'May', value: 8 },
    { name: 'Jun', value: 12 }
  ];
  
  const reasonData = [
    { name: 'Better Opportunity', value: 45, color: '#6366f1' },
    { name: 'Relocation', value: 20, color: '#8b5cf6' },
    { name: 'Personal', value: 15, color: '#ec4899' },
    { name: 'Health', value: 10, color: '#f43f5e' },
    { name: 'Other', value: 10, color: '#f97316' }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen pb-10">
      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Offboarding</h1>
            <p className="text-slate-500 mt-1">Employee Separation & Exit Management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-rose-600 hover:bg-rose-700 text-white">Initiate Offboarding</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto inline-flex gap-1 shadow-sm w-max min-w-full">
              <TabsTrigger value="overview" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Dashboard</TabsTrigger>
              <TabsTrigger value="resignations" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Resignations</TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Exit Checklist</TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Asset Recovery</TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Knowledge Transfer</TabsTrigger>
              <TabsTrigger value="interviews" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Exit Interviews</TabsTrigger>
              <TabsTrigger value="settlement" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Final Settlement</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Documentation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-l-4 border-l-rose-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><LogOut className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Active Resignations</p><h3 className="text-2xl font-bold text-slate-800">{analytics.activeResignations}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Archive className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Assets to Recover</p><h3 className="text-2xl font-bold text-slate-800">{analytics.assetsToRecover}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><HelpCircle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Interviews</p><h3 className="text-2xl font-bold text-slate-800">{analytics.exitInterviewsPending}</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Settlements</p><h3 className="text-2xl font-bold text-slate-800">{analytics.finalSettlementsPending}</h3></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Attrition Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800">Reasons for Leaving</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={reasonData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                          {reasonData.map((entry, index) => (
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

          <TabsContent value="resignations" className="mt-6"><Resignations /></TabsContent>
          <TabsContent value="checklist" className="mt-6"><ExitChecklist /></TabsContent>
          <TabsContent value="assets" className="mt-6"><AssetRecovery /></TabsContent>
          <TabsContent value="knowledge" className="mt-6"><KnowledgeTransfer /></TabsContent>
          <TabsContent value="interviews" className="mt-6"><ExitInterviews /></TabsContent>
          <TabsContent value="settlement" className="mt-6"><FinalSettlement /></TabsContent>
          <TabsContent value="documents" className="mt-6"><Documentation /></TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

