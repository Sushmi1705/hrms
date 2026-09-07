import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Building, 
  CheckCircle2, Sparkles, Shield, Flag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { HolidayItem, WorkScheduleData } from '../types/ess';

export const EmployeeCalendarPage: React.FC = () => {
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [schedule, setSchedule] = useState<WorkScheduleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      essApi.getHolidays(),
      essApi.getSchedule()
    ])
      .then(([holRes, schedRes]) => {
        setHolidays(holRes || []);
        setSchedule(schedRes);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load schedule & holidays');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-44 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Calendar & Work Schedule
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Corporate holiday schedule and current shift assignment parameters
        </p>
      </div>

      {/* 1. WORK SCHEDULE CARD */}
      {schedule && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/40 dark:from-slate-900 dark:to-slate-800/60 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                    {schedule.shiftCode}
                  </Badge>
                  <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-300">
                    Active Assignment
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {schedule.shiftName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Working Hours: <strong className="text-indigo-600 dark:text-indigo-400">{schedule.startTimeFormatted} - {schedule.endTimeFormatted}</strong> • {schedule.timeZone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-full md:w-auto">
              <div>
                <span className="text-slate-400">Working Days:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{schedule.workingDays}</p>
              </div>
              <div>
                <span className="text-slate-400">Grace Period:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{schedule.graceTimeMinutes} Minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. OFFICIAL COMPANY HOLIDAYS */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            Official Holidays Schedule ({new Date().getFullYear()})
          </CardTitle>
          <CardDescription className="text-xs">
            Scheduled corporate closures and statutory national observances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No holidays scheduled for this calendar year.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holidays.map(h => (
                <div 
                  key={h.id} 
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex flex-col items-center justify-center font-bold text-center">
                      <span className="text-[10px] uppercase">{new Date(h.date).toLocaleDateString([], { month: 'short' })}</span>
                      <span className="text-base leading-none">{new Date(h.date).getDate()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{h.name}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          {h.holidayType}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(h.date).toLocaleDateString([], { weekday: 'long' })} • {h.description || 'Company Holiday'}
                      </p>
                    </div>
                  </div>

                  <Badge className={
                    h.daysRemaining < 0 ? 'bg-slate-100 text-slate-500' :
                    h.daysRemaining === 0 ? 'bg-rose-500 text-white animate-pulse' :
                    'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }>
                    {h.daysRemaining < 0 ? 'Passed' : h.daysRemaining === 0 ? 'Today' : `in ${h.daysRemaining} days`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
