import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Settings, FileText, CheckSquare, Clock, AlertTriangle, ShieldCheck, Mail, Smartphone, BellRing, Megaphone } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { NotificationInbox } from '../components/NotificationInbox';
import { Templates } from '../components/Templates';
import { EmailTemplates } from '../components/EmailTemplates';
import { SmsTemplates } from '../components/SmsTemplates';
import { PushTemplates } from '../components/PushTemplates';
import { Announcements } from '../components/Announcements';
import { ReminderScheduler } from '../components/ReminderScheduler';
import { NotificationQueue } from '../components/NotificationQueue';
import { DeliveryLogs } from '../components/DeliveryLogs';
import { NotificationSettings } from '../components/NotificationSettings';

const deliveryTrendData = [
  { month: 'Jan', email: 4000, sms: 2400, push: 2400 },
  { month: 'Feb', email: 3000, sms: 1398, push: 2210 },
  { month: 'Mar', email: 2000, sms: 9800, push: 2290 },
  { month: 'Apr', email: 2780, sms: 3908, push: 2000 },
  { month: 'May', email: 1890, sms: 4800, push: 2181 },
  { month: 'Jun', email: 2390, sms: 3800, push: 2500 },
];

const moduleData = [
  { name: 'Email', value: 65 },
  { name: 'SMS', value: 25 },
  { name: 'Push', value: 10 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function HRNotificationDashboard() {
  const [stats, setStats] = useState<any>({
    unread: 154,
    today: 432,
    failed: 12,
    pending: 45,
    emailsSent: 12000,
    smsSent: 4500,
    pushSent: 8200,
    activeAnnouncements: 3
  });

  useEffect(() => {
    fetch('http://localhost:5002/api/v1/notification/analytics')
      .then(res => res.json())
      .then(data => {
        if (data && data.today !== undefined) {
          setStats(data);
        }
      })
      .catch(err => console.error('Failed to load notification stats', err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Enterprise Notification Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Centralized Omni-Channel Communication Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Traffic</CardTitle>
            <BellRing className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
            <p className="text-xs text-slate-500 mt-1">Notifications processed today</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Queue Processing</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
            <p className="text-xs text-slate-500 mt-1">Jobs actively processing</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Failed Deliveries</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.failed}</div>
            <p className="text-xs text-slate-500 mt-1">Errors today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Announcements</CardTitle>
            <Megaphone className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.activeAnnouncements}</div>
            <p className="text-xs text-slate-500 mt-1">Pinned across platform</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
          <TabsList className="w-max inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="inbox">Notification Center</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="scheduler">Reminder Scheduler</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Volume Trends</CardTitle>
                <CardDescription>Messages sent over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={deliveryTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="email" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Email" />
                    <Area type="monotone" dataKey="sms" stackId="1" stroke="#10b981" fill="#10b981" name="SMS" />
                    <Area type="monotone" dataKey="push" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Push" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delivery Distribution</CardTitle>
                <CardDescription>Share of traffic by channel</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={moduleData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                      {moduleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inbox" className="mt-6"><NotificationInbox /></TabsContent>
        <TabsContent value="templates" className="mt-6"><Templates /></TabsContent>
        <TabsContent value="email" className="mt-6"><EmailTemplates /></TabsContent>
        <TabsContent value="sms" className="mt-6"><SmsTemplates /></TabsContent>
        <TabsContent value="push" className="mt-6"><PushTemplates /></TabsContent>
        <TabsContent value="announcements" className="mt-6"><Announcements /></TabsContent>
        <TabsContent value="scheduler" className="mt-6"><ReminderScheduler /></TabsContent>
        <TabsContent value="queue" className="mt-6"><NotificationQueue /></TabsContent>
        <TabsContent value="logs" className="mt-6"><DeliveryLogs /></TabsContent>
        <TabsContent value="settings" className="mt-6"><NotificationSettings /></TabsContent>

      </Tabs>
    </div>
  );
}
