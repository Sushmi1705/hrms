import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Activity, ShieldAlert, Users, Database, FileText, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AuditOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['AuditAnalytics'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5002/api/v1/audit/analytics');
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Audit Analytics...</div>;

  const kpis = [
    { title: "Today's Activities", value: data?.todayActivities || 0, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Failed Logins", value: data?.failedLogins || 0, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Critical Events", value: data?.criticalEvents || 0, icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Active Users", value: data?.activeUsers || 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Data Changes", value: data?.dataChanges || 0, icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Exports", value: data?.exports || 0, icon: FileText, color: "text-cyan-600", bg: "bg-cyan-50" }
  ];

  const trendData = [
    { name: 'Mon', activities: 4000, logins: 2400 },
    { name: 'Tue', activities: 3000, logins: 1398 },
    { name: 'Wed', activities: 2000, logins: 9800 },
    { name: 'Thu', activities: 2780, logins: 3908 },
    { name: 'Fri', activities: 1890, logins: 4800 },
    { name: 'Sat', activities: 2390, logins: 3800 },
    { name: 'Sun', activities: 3490, logins: 4300 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`p-3 rounded-full ${kpi.bg} ${kpi.color} mb-3`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{kpi.value.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">7-Day Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  <Line type="monotone" dataKey="activities" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Login Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  <Bar dataKey="logins" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

