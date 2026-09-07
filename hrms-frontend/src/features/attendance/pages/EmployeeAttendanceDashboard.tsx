import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Clock, Play, Square, Pause, Calendar as CalendarIcon, CheckCircle2, ChevronRight, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AttendanceTimeline } from '../components/AttendanceTimeline';

// MOCK USER FOR NOW
const EMPLOYEE_ID = '6cad3153-350a-4802-a4aa-b1e46b028373';

export function EmployeeAttendanceDashboard() {
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['employeeLogs', EMPLOYEE_ID],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5002/api/v1/Attendance/logs/${EMPLOYEE_ID}`);
      return res.data.data;
    }
  });

  const handleClockIn = async () => {
    try {
      await axios.post('http://localhost:5002/api/v1/Attendance/clock-in', { 
        employeeId: EMPLOYEE_ID,
        ipAddress: '192.168.1.100',
        location: 'Office HQ',
        device: 'Desktop Web'
      });
      setClockedIn(true);
      toast.success('Successfully clocked in!');
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      await axios.post('http://localhost:5002/api/v1/Attendance/clock-out', { 
        employeeId: EMPLOYEE_ID,
        ipAddress: '192.168.1.100',
        location: 'Office HQ',
        device: 'Desktop Web'
      });
      setClockedIn(false);
      toast.success('Successfully clocked out!');
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to clock out');
    }
  };

  // Convert logs to timeline events
  const timelineEvents = [];
  if (logs && logs.length > 0) {
    const todayLog = logs[0]; // Assuming ordered descending
    if (todayLog.clockInTime) {
      timelineEvents.push({
        time: new Date(todayLog.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Clocked In',
        location: todayLog.clockInLocation,
        device: todayLog.clockInDevice,
        type: 'in' as const
      });
    }
    if (todayLog.clockOutTime) {
      timelineEvents.push({
        time: new Date(todayLog.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: 'Clocked Out',
        location: todayLog.clockOutLocation,
        device: todayLog.clockOutDevice,
        type: 'out' as const
      });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your daily time tracking and requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clock In Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden h-full">
            <div className="absolute -top-12 -right-12 text-slate-50 dark:text-slate-900 pointer-events-none">
              <Clock className="w-48 h-48" />
            </div>
            
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 z-10">Time Tracker</h2>
            
            <div className="text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-2 z-10 font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-slate-500 font-medium mb-10 z-10">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <div className="w-full space-y-4 z-10 mt-auto">
              {!clockedIn ? (
                <Button onClick={handleClockIn} size="lg" className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all">
                  <Play className="w-5 h-5 mr-2" fill="currentColor" /> Clock In
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline" size="lg" className="w-full h-14 text-lg rounded-2xl border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-900/50 dark:text-amber-500 dark:hover:bg-amber-900/20 transition-all">
                    <Pause className="w-5 h-5 mr-2" fill="currentColor" /> Break
                  </Button>
                  <Button onClick={handleClockOut} size="lg" className="w-full h-14 text-lg rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 transition-all">
                    <Square className="w-5 h-5 mr-2" fill="currentColor" /> Clock Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Employee KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">98%</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Attendance Score</p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">14</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Days Present</p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">0</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Late Arrivals</p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">42h</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Total Hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm">
               <AttendanceTimeline events={timelineEvents} />
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col">
               <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 <Button variant="outline" className="w-full justify-start h-12">Request Regularization</Button>
                 <Button variant="outline" className="w-full justify-start h-12">Request Overtime</Button>
                 <Button variant="outline" className="w-full justify-start h-12">Request Permission</Button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
