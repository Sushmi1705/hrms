import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getTeamCalendar, getTeamDirectory } from '../api/mssApi';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Clock,
  Plane,
  Flag,
  Cake,
  Filter,
  Users,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  CalendarDays,
  Info
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO 
} from 'date-fns';
import { MssCalendarEventDto } from '../types/mss';

export default function ManagerCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'leave' | 'holiday' | 'birthday'>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');

  // Month navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  // Queries
  const { data: events, isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ['mss-calendar', currentDate.getMonth() + 1, currentDate.getFullYear()],
    queryFn: () => getTeamCalendar(currentDate.getMonth() + 1, currentDate.getFullYear())
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['mss-team-directory'],
    queryFn: () => getTeamDirectory()
  });

  // Calculate calendar grid days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDayOfWeek = monthStart.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Previous month trailing days
  const prevDays: Date[] = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - (i + 1));
    prevDays.push(d);
  }

  // Current month days
  const currentDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Next month leading days to complete full 7-day rows
  const nextDays: Date[] = [];
  const totalDaysSoFar = prevDays.length + currentDays.length;
  const trailingCount = (7 - (totalDaysSoFar % 7)) % 7;
  for (let i = 1; i <= trailingCount; i++) {
    const d = new Date(monthEnd);
    d.setDate(d.getDate() + i);
    nextDays.push(d);
  }

  const allCalendarDays = [...prevDays, ...currentDays, ...nextDays];

  // Helper to match events for a given day (including multi-day leave intervals)
  const getDayEvents = (day: Date): MssCalendarEventDto[] => {
    if (!events) return [];
    const dayStr = format(day, 'yyyy-MM-dd');

    return events.filter(e => {
      // Category filter
      if (categoryFilter !== 'all' && e.type.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      // Employee filter
      if (employeeFilter !== 'all' && e.employeeId && e.employeeId !== employeeFilter) {
        return false;
      }

      if (!e.date) return false;
      const startStr = format(parseISO(e.date), 'yyyy-MM-dd');

      if (e.endDate) {
        const endStr = format(parseISO(e.endDate), 'yyyy-MM-dd');
        return dayStr >= startStr && dayStr <= endStr;
      }
      return dayStr === startStr;
    });
  };

  // Metrics
  const leaveCount = events?.filter(e => e.type.toLowerCase() === 'leave').length ?? 0;
  const holidayCount = events?.filter(e => e.type.toLowerCase() === 'holiday').length ?? 0;
  const birthdayCount = events?.filter(e => e.type.toLowerCase() === 'birthday').length ?? 0;
  const teamSize = teamMembers?.length ?? 0;

  // Selected Day Details
  const selectedDayEvents = selectedDay ? getDayEvents(selectedDay) : [];
  const isSelectedToday = selectedDay ? isSameDay(selectedDay, new Date()) : false;
  const isSelectedWeekend = selectedDay ? (selectedDay.getDay() === 0 || selectedDay.getDay() === 6) : false;

  const getEventBadge = (evt: MssCalendarEventDto) => {
    const type = evt.type.toLowerCase();
    switch(type) {
      case 'holiday':
        return (
          <div 
            className="text-[11px] font-medium px-2 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5 truncate shadow-sm"
            title={`Public Holiday: ${evt.title}`}
          >
            <Flag className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{evt.title}</span>
          </div>
        );
      case 'leave':
        return (
          <div 
            className="text-[11px] font-medium px-2 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/80 flex items-center gap-1.5 truncate shadow-sm"
            title={`${evt.employeeName || 'Team Member'}: ${evt.title}`}
          >
            <Plane className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate font-semibold">{evt.employeeName?.split(' ')[0] || 'Member'}:</span>
            <span className="truncate">{evt.title.replace(/^[^-]+-\s*/, '')}</span>
          </div>
        );
      case 'birthday':
        return (
          <div 
            className="text-[11px] font-medium px-2 py-1 rounded-md bg-pink-950/60 text-pink-300 border border-pink-800/80 flex items-center gap-1.5 truncate shadow-sm"
            title={evt.title}
          >
            <Cake className="w-3 h-3 text-pink-400 shrink-0" />
            <span className="truncate">{evt.title}</span>
          </div>
        );
      default:
        return (
          <div 
            className="text-[11px] font-medium px-2 py-1 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/80 flex items-center gap-1.5 truncate shadow-sm"
            title={evt.title}
          >
            <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{evt.title}</span>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-200">
      
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              Manager Self-Service
            </span>
            <span className="text-xs text-slate-500">• Team Availability Radar</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5 tracking-tight">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            Team Schedule & Leave Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Monitor approved leaves, shifts, company holidays, and team milestones in one unified view
          </p>
        </div>

        {/* Month Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={goToToday}
            className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 active:scale-95"
          >
            Today
          </button>
          
          <div className="flex items-center bg-slate-800/80 rounded-xl border border-slate-700/80 p-1">
            <button 
              onClick={prevMonth} 
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-bold text-white px-3 min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </div>
            <button 
              onClick={nextMonth} 
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Monthly Summary Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{teamSize}</div>
            <div className="text-[11px] text-slate-400 font-medium">Direct Reports</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-400">{leaveCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Leaves This Month</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">{holidayCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Public Holidays</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-pink-400">{birthdayCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Team Birthdays</div>
          </div>
        </div>
      </div>

      {/* 3. Filter & Legend Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['all', 'leave', 'holiday', 'birthday'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' && 'All Events'}
              {cat === 'leave' && '✈️ Leaves'}
              {cat === 'holiday' && '🚩 Holidays'}
              {cat === 'birthday' && '🎂 Birthdays'}
            </button>
          ))}

          {teamMembers && teamMembers.length > 0 && (
            <select
              value={employeeFilter}
              onChange={e => setEmployeeFilter(e.target.value)}
              className="bg-slate-800/90 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 ml-2"
            >
              <option value="all">All Team Members</option>
              {teamMembers.map(m => (
                <option key={m.employeeId} value={m.employeeId}>
                  {m.name} ({m.designation})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Holiday
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Leave
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Birthday
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Today
          </span>
        </div>
      </div>

      {/* 4. Main Calendar & Day Inspection Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Calendar Grid (3 columns on xl) */}
        <div className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
              <div 
                key={day} 
                className={`py-3.5 text-center text-xs font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6 ? 'text-slate-500 bg-slate-900/40' : 'text-slate-300'
                }`}
              >
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          {eventsError ? (
            <div className="p-12 text-center text-rose-400 bg-rose-500/10">
              Failed to load calendar events. Please check your backend connection.
            </div>
          ) : (
            <div className="grid grid-cols-7 bg-slate-800/80 gap-[1px]">
              {allCalendarDays.map((day) => {
                const dayEvents = getDayEvents(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[105px] p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none ${
                      isSelected
                        ? 'bg-indigo-950/40 ring-2 ring-indigo-500 z-10'
                        : isCurrentMonth
                          ? isWeekend
                            ? 'bg-slate-900/80 hover:bg-slate-800/70'
                            : 'bg-slate-900 hover:bg-slate-800/60'
                          : 'bg-slate-950/60 opacity-40 hover:opacity-75'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between">
                      <span 
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                          isToday 
                            ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' 
                            : isSelected
                              ? 'bg-slate-700 text-white'
                              : isCurrentMonth 
                                ? 'text-slate-300' 
                                : 'text-slate-500'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Events List */}
                    <div className="space-y-1 my-1 overflow-hidden">
                      {isEventsLoading ? (
                        <div className="h-4 bg-slate-800/60 rounded animate-pulse"></div>
                      ) : (
                        <>
                          {dayEvents.slice(0, 2).map((evt, idx) => (
                            <React.Fragment key={idx}>
                              {getEventBadge(evt)}
                            </React.Fragment>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] font-semibold text-slate-400 text-center py-0.5 hover:text-indigo-300">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Today indicator accent line */}
                    {isToday && (
                      <div className="h-0.5 w-full bg-indigo-500 rounded-full mt-auto"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Selected Day Detail Sidebar (1 column on xl) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-5">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> Selected Date
                </span>
                {isSelectedToday && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    Today
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSelectedWeekend 
                  ? '🌴 Weekend • Non-working Day' 
                  : selectedDayEvents.some(e => e.type.toLowerCase() === 'holiday')
                    ? '🎉 Official Holiday'
                    : '💼 Standard Working Day'}
              </p>
            </div>

            {/* Event Details List */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="p-6 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-xs font-semibold text-slate-300">Full Team Expected</div>
                  <p className="text-[11px] text-slate-500">
                    No scheduled leaves, holidays, or events recorded for this date.
                  </p>
                </div>
              ) : (
                selectedDayEvents.map((evt, idx) => {
                  const type = evt.type.toLowerCase();
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        type === 'holiday'
                          ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-200'
                          : type === 'leave'
                            ? 'bg-amber-950/30 border-amber-800/70 text-amber-200'
                            : 'bg-pink-950/30 border-pink-800/70 text-pink-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/60 border border-slate-800 flex items-center gap-1">
                          {type === 'holiday' && <Flag className="w-3 h-3 text-emerald-400" />}
                          {type === 'leave' && <Plane className="w-3 h-3 text-amber-400" />}
                          {type === 'birthday' && <Cake className="w-3 h-3 text-pink-400" />}
                          {evt.type}
                        </span>
                        {evt.navigateTo && (
                          <Link 
                            to={evt.navigateTo}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          >
                            Manage <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      <div className="font-bold text-sm text-white mt-1">
                        {evt.title}
                      </div>

                      {evt.employeeName && (
                        <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.employeeName}</span>
                        </div>
                      )}

                      {evt.endDate && evt.date && evt.endDate !== evt.date && (
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{format(parseISO(evt.date), 'dd MMM')} - {format(parseISO(evt.endDate), 'dd MMM')}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Action Footer Links */}
          <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
            <Link 
              to="/manager/leave"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl flex items-center justify-between transition-colors"
            >
              <span>View Leave Requests</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link 
              to="/manager/attendance"
              className="w-full py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-semibold text-indigo-300 border border-indigo-500/30 rounded-xl flex items-center justify-between transition-colors"
            >
              <span>Monthly Attendance Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
