import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  CalendarClock, Settings, Users, CalendarRange, 
  ArrowRightLeft, FileText, Download, CalendarDays,
  Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import { ShiftMaster } from './ShiftMaster';
import { ShiftAssignments } from './ShiftAssignments';
import { ShiftRosterPlanner } from './ShiftRosterPlanner';
import { ShiftRequests } from './ShiftRequests';
import { ShiftReports } from './ShiftReports';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function HRShiftDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAutoScheduling, setIsAutoScheduling] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAutoSchedule = () => {
    setIsAutoScheduling(true);
    setTimeout(() => {
      setIsAutoScheduling(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  const shiftData = [
    { name: 'Morning', count: 85, color: '#f59e0b' },
    { name: 'General', count: 120, color: '#3b82f6' },
    { name: 'Evening', count: 45, color: '#8b5cf6' },
    { name: 'Night', count: 35, color: '#6366f1' },
    { name: 'Split', count: 15, color: '#10b981' }
  ];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Shift & Roster</h1>
            <p className="text-slate-500 mt-1">Manage organization-wide schedules, shifts, and rosters.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2"/> Export Schedule</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all" onClick={handleAutoSchedule} disabled={isAutoScheduling}>
            {isAutoScheduling ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Scheduling...</>
            ) : (
              <><CalendarClock className="w-4 h-4 mr-2"/> Auto-Schedule</>
            )}
          </Button>
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Auto-Schedule Complete</p>
              <p className="text-emerald-100 text-sm">Successfully assigned shifts to 285 employees.</p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-lg h-auto flex flex-wrap gap-1 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Dashboard</TabsTrigger>
            <TabsTrigger value="master" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Shift Master</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Shift Assignment</TabsTrigger>
            <TabsTrigger value="roster" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Roster Calendar</TabsTrigger>
            <TabsTrigger value="schedules" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Employee Schedules</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Shift Requests</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-l-4 border-l-indigo-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Clock className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Active Shifts</p><h3 className="text-2xl font-bold text-slate-800">12</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Employees Scheduled</p><h3 className="text-2xl font-bold text-slate-800">285</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><ArrowRightLeft className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Requests</p><h3 className="text-2xl font-bold text-slate-800">8</h3></div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-l-rose-500">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
                  <div><p className="text-sm font-medium text-slate-500">Roster Conflicts</p><h3 className="text-2xl font-bold text-slate-800">3</h3></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Shift Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shiftData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {shiftData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="master"><ShiftMaster /></TabsContent>
          <TabsContent value="assignments"><ShiftAssignments /></TabsContent>
          <TabsContent value="roster"><ShiftRosterPlanner /></TabsContent>
          <TabsContent value="schedules"><ShiftRosterPlanner /></TabsContent>
          <TabsContent value="requests"><ShiftRequests /></TabsContent>
          <TabsContent value="reports"><ShiftReports /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}



