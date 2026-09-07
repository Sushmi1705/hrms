import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, Megaphone, Clock, AlertCircle, 
  Sparkles, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { AnnouncementItem, PendingRequestItem } from '../types/ess';

export const EmployeeNotificationsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [notifications, setNotifications] = useState<PendingRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    Promise.all([
      essApi.getAnnouncements(),
      essApi.getNotifications()
    ])
      .then(([annRes, notifRes]) => {
        setAnnouncements(annRes || []);
        setNotifications(notifRes || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load notifications & announcements');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkAllRead = () => {
    toast.success('All notifications marked as read');
    setNotifications(prev => prev.map(n => ({ ...n, status: 'Read' })));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-32 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Notifications & Corporate Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay informed with system alerts, approval status updates, and townhall notices
          </p>
        </div>

        <Button 
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          className="rounded-xl text-xs"
        >
          <CheckCheck className="w-4 h-4 mr-1.5" />
          Mark All As Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Announcements */}
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              Company Announcements
            </CardTitle>
            <CardDescription className="text-xs">
              Official broadcasts from HR and Executive Leadership
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                  {ann.isPinned && (
                    <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.message}</p>
                <p className="text-[10px] text-slate-400">
                  Published on {new Date(ann.publishedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: Notifications */}
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" />
              System Notifications & Approvals
            </CardTitle>
            <CardDescription className="text-xs">
              Alerts regarding your leave, timesheet, and asset requisitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map(notif => (
              <div 
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  notif.status === 'Unread' 
                    ? 'border-indigo-300 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20' 
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</p>
                    <Badge variant="outline" className="text-[9px] border-slate-200">
                      {notif.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{notif.currentApprover || 'System Event'}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(notif.submittedDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
