import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { X } from 'lucide-react';
import { ApplyLeaveForm } from './ApplyLeaveForm';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { 
  Users, CalendarClock, CheckCircle, XCircle, Clock, CalendarDays, 
  TrendingUp, AlertTriangle, Briefcase, FilePlus, Download, RefreshCw
} from 'lucide-react';
import { LeaveRequestsRegister } from './LeaveRequestsRegister';
import { OrganizationLeaveCalendar } from './OrganizationLeaveCalendar';
import { LeaveReports } from './LeaveReports';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export function HRLeaveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplyLeave, setShowApplyLeave] = useState(false);

  // We fetch actual data from the new endpoint!
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['leave-analytics'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5002/api/v1/Leave/dashboard');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests', 'pending'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5002/api/v1/Leave/requests?status=Pending');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (analyticsLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Enterprise Leave Dashboard...</div>;
  }

  // Dummy Chart Data until we build out full analytics backend
  const monthlyTrendData = [
    { name: 'Jan', approved: 45, rejected: 10, pending: 5 },
    { name: 'Feb', approved: 52, rejected: 8, pending: 12 },
    { name: 'Mar', approved: 38, rejected: 15, pending: 2 },
    { name: 'Apr', approved: 65, rejected: 12, pending: 8 },
    { name: 'May', approved: 48, rejected: 9, pending: 4 },
  ];

  const leaveTypeData = [
    { name: 'Annual Leave', value: 400, color: '#3b82f6' },
    { name: 'Sick Leave', value: 300, color: '#ef4444' },
    { name: 'Casual Leave', value: 300, color: '#10b981' },
    { name: 'Loss of Pay (LOP)', value: 200, color: '#f59e0b' },
  ];

  const departmentData = [
    { name: 'Engineering', count: 120 },
    { name: 'Sales', count: 80 },
    { name: 'Marketing', count: 65 },
    { name: 'HR', count: 25 },
    { name: 'Finance', count: 40 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Leave Management</h1>
          <p className="text-slate-500">Comprehensive overview of organization-wide time off and requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export Report</Button>
          <Button onClick={() => setShowApplyLeave(true)}><FilePlus className="w-4 h-4 mr-2"/> Apply Leave</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
          <TabsTrigger value="reports">Analytics & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">On Leave Today</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analytics?.employeesOnLeaveToday || 0}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analytics?.pendingApprovals || 0}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved Today</p>
                  <h3 className="text-2xl font-bold text-slate-900">12</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-rose-500 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Rejected Today</p>
                  <h3 className="text-2xl font-bold text-slate-900">3</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Upcoming Leave</p>
                  <h3 className="text-2xl font-bold text-slate-900">45</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Returning Today</p>
                  <h3 className="text-2xl font-bold text-slate-900">8</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Leave Utilization</p>
                  <h3 className="text-2xl font-bold text-slate-900">68%</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">LOP Days (Month)</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analytics?.lopDaysThisMonth || 0}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Leave Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend iconType="circle" />
                      <Bar dataKey="approved" name="Approved" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Leave Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {leaveTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Pending Approvals ({requests?.length || 0})</CardTitle>
                <Button variant="link" onClick={() => setActiveTab('requests')}>View All</Button>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="text-slate-500 animate-pulse py-4">Loading pending requests...</div>
                ) : (
                  <div className="space-y-4">
                    {requests?.slice(0, 5).map((req: any) => (
                      <div key={req.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            {req.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{req.employeeName}</p>
                            <p className="text-xs text-slate-500">{req.leaveType.name} • {req.totalDays} Days</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">Approve</Button>
                          <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">Reject</Button>
                        </div>
                      </div>
                    ))}
                    {requests?.length === 0 && (
                      <div className="text-center text-slate-500 py-8">No pending approvals! You are all caught up.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Department Leave Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} width={80} />
                      <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Leave Requests Register</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveRequestsRegister />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Organization Leave Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationLeaveCalendar />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <LeaveReports />
        </TabsContent>
      </Tabs>
      {showApplyLeave && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowApplyLeave(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <ApplyLeaveForm />
          </div>
        </div>
      )}
    </div>
  );
}






