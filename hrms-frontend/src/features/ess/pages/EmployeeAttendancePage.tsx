import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Square, Calendar as CalendarIcon, CheckCircle2, 
  AlertCircle, ChevronLeft, ChevronRight, Plus, Send, MapPin, 
  ShieldCheck, RefreshCw, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { AttendanceCalendarDay, AttendanceCorrectionItem, WebClockStatus } from '../types/ess';

export const EmployeeAttendancePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<AttendanceCalendarDay[]>([]);
  const [todayStatus, setTodayStatus] = useState<WebClockStatus | null>(null);
  const [corrections, setCorrections] = useState<AttendanceCorrectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<AttendanceCalendarDay | null>(null);

  // Regularization Modal
  const [showRegModal, setShowRegModal] = useState(false);
  const [regDate, setRegDate] = useState('');
  const [regType, setRegType] = useState('Regularization');
  const [regIn, setRegIn] = useState('09:00');
  const [regOut, setRegOut] = useState('17:00');
  const [regReason, setRegReason] = useState('');
  const [submittingReg, setSubmittingReg] = useState(false);

  const fetchAttendance = (date: Date) => {
    setLoading(true);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    Promise.all([
      essApi.getAttendance(m, y),
      essApi.getAttendanceRequests()
    ])
      .then(([attRes, reqRes]) => {
        setCalendar(attRes.calendar || []);
        setTodayStatus(attRes.todayStatus);
        setCorrections(reqRes || []);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load attendance logs');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const res = await essApi.clockIn({ location: 'Corporate HQ' });
      toast.success(res.message || 'Successfully clocked in!');
      fetchAttendance(currentDate);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clock in');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      const res = await essApi.clockOut({ location: 'Corporate HQ' });
      toast.success(res.message || 'Successfully clocked out!');
      fetchAttendance(currentDate);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to clock out');
    } finally {
      setClockLoading(false);
    }
  };

  const handleRegularizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDate || !regReason.trim()) {
      toast.error('Please specify target date and reason');
      return;
    }
    setSubmittingReg(true);
    try {
      await essApi.submitAttendanceCorrection({
        date: regDate,
        requestType: regType,
        requestedCheckIn: regIn + ':00',
        requestedCheckOut: regOut + ':00',
        reason: regReason
      });
      toast.success('Attendance regularization request submitted');
      setShowRegModal(false);
      setRegDate('');
      setRegReason('');
      fetchAttendance(currentDate);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmittingReg(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'Late': return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400';
      case 'Leave': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400';
      case 'Holiday': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-400';
      case 'Weekend': return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
      case 'Absent': return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const isClockedIn = todayStatus?.isClockedIn;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP WEB CLOCK HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isClockedIn ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={isClockedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}>
                  {todayStatus?.status || 'Not Clocked In'}
                </Badge>
                <span className="text-xs text-slate-500">General Shift (09:00 AM - 05:00 PM)</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Web Clock & Attendance Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Worked duration today: <span className="font-semibold text-slate-800 dark:text-slate-200">{todayStatus?.workedDuration || '0h 0m'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              size="lg"
              onClick={() => isClockedIn ? handleClockOut() : handleClockIn()}
              disabled={clockLoading}
              className={`rounded-2xl font-semibold shadow-md flex-1 md:flex-initial ${
                isClockedIn 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isClockedIn ? (
                <>
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  Clock Out Now
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Clock In Now
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowRegModal(true)}
              className="rounded-2xl border-slate-300 dark:border-slate-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Regularize
            </Button>
          </div>
        </div>
      </div>

      {/* 2. MONTH NAVIGATION & CALENDAR GRID */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              Monthly Timesheet Calendar
            </CardTitle>
            <CardDescription className="text-xs">
              Daily punches, working hours, and leave records
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="rounded-xl h-8 w-8 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-bold min-w-[140px] text-center">
              {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth} className="rounded-xl h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 text-center font-semibold text-xs text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 gap-2">
                {calendar.map((day) => {
                  const isToday = new Date(day.date).toDateString() === new Date().toDateString();
                  return (
                    <div 
                      key={day.date}
                      onClick={() => setSelectedDay(day)}
                      className={`min-h-[90px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isToday ? 'border-indigo-500 shadow-sm bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {new Date(day.date).getDate()}
                        </span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 border font-medium ${getStatusColor(day.status)}`}>
                          {day.status}
                        </Badge>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
                        {day.clockInFormatted && (
                          <p className="truncate font-mono">In: {day.clockInFormatted}</p>
                        )}
                        {day.clockOutFormatted && (
                          <p className="truncate font-mono">Out: {day.clockOutFormatted}</p>
                        )}
                        {day.workedHours > 0 && (
                          <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {day.workedHours} hrs
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. PENDING ATTENDANCE REGULARIZATIONS */}
      <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Attendance Regularization Requests</CardTitle>
          <CardDescription className="text-xs">Punch correction requests submitted to line managers</CardDescription>
        </CardHeader>
        <CardContent>
          {corrections.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No regularization requests filed.</p>
          ) : (
            <div className="space-y-3">
              {corrections.map(c => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {c.requestType} for {new Date(c.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Badge className={c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Requested Punch: {c.requestedCheckIn || '09:00'} - {c.requestedCheckOut || '17:00'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Reason: {c.reason}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL: REGULARIZE ATTENDANCE */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Attendance Regularization</h3>
            <p className="text-xs text-slate-500">
              Submit a correction for missed punches, offsite client visits, or technical errors.
            </p>
            <form onSubmit={handleRegularizeSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Date *</label>
                <input 
                  type="date" 
                  value={regDate} 
                  onChange={e => setRegDate(e.target.value)} 
                  required
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Correction Category</label>
                <select 
                  value={regType} 
                  onChange={e => setRegType(e.target.value)}
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                >
                  <option value="Regularization">Punch Regularization</option>
                  <option value="MissedPunch">Missed Check-Out Punch</option>
                  <option value="WorkFromHome">Remote Work / WFH Punch</option>
                  <option value="ClientVisit">Offsite Client Deployment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">In Time</label>
                  <input 
                    type="time" 
                    value={regIn} 
                    onChange={e => setRegIn(e.target.value)} 
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Out Time</label>
                  <input 
                    type="time" 
                    value={regOut} 
                    onChange={e => setRegOut(e.target.value)} 
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Reason / Notes *</label>
                <textarea 
                  value={regReason} 
                  onChange={e => setRegReason(e.target.value)} 
                  required
                  rows={3}
                  placeholder="Explain why punch was missed"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowRegModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingReg} className="bg-indigo-600 text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
