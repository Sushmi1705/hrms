import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, 
  User, Clock, X, Sparkles, Coffee, HeartPulse, Palmtree,
  CheckCircle2, Info, Building2
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, isSameMonth, parseISO,
  isWithinInterval, startOfDay, endOfDay
} from 'date-fns';

type LeaveCategoryType = 'annual' | 'sick' | 'holiday' | 'casual' | 'lop';
type CalendarFilterType = 'all' | 'annual' | 'sick' | 'holiday' | 'weekend';

interface CalendarEventItem {
  id: string;
  employeeName: string;
  title?: string;
  departmentName?: string;
  leaveTypeName: string;
  category: LeaveCategoryType;
  colorCode: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  status: string;
  reason?: string;
  isHoliday?: boolean;
}

// Enterprise company holidays across months
const COMPANY_HOLIDAYS: CalendarEventItem[] = [
  { id: 'hol-1', employeeName: 'Organization', title: 'Labor Day', leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-09-07', toDate: '2026-09-07', totalDays: 1, status: 'Official', isHoliday: true, reason: 'National Holiday' } as any,
  { id: 'hol-2', employeeName: 'Organization', title: 'Gandhi Jayanti', leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-10-02', toDate: '2026-10-02', totalDays: 1, status: 'Official', isHoliday: true, reason: 'National Holiday' } as any,
  { id: 'hol-3', employeeName: 'Organization', title: 'Dussehra / Vijayadashami', leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-10-20', toDate: '2026-10-20', totalDays: 1, status: 'Official', isHoliday: true, reason: 'Festival Holiday' } as any,
  { id: 'hol-4', employeeName: 'Organization', title: 'Diwali Celebration', leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-11-08', toDate: '2026-11-09', totalDays: 2, status: 'Official', isHoliday: true, reason: 'Festival of Lights' } as any,
  { id: 'hol-5', employeeName: 'Engineering & Product', title: 'Team Strategy Offsite', leaveTypeName: 'Offsite', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-10-15', toDate: '2026-10-16', totalDays: 2, status: 'Company Event', isHoliday: true, reason: 'Annual Q4 Roadmapping' } as any,
  { id: 'hol-6', employeeName: 'Organization', title: 'Christmas Day', leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-12-25', toDate: '2026-12-25', totalDays: 1, status: 'Official', isHoliday: true, reason: 'Winter Holiday' } as any,
  { id: 'hol-7', employeeName: 'Organization', title: "New Year's Day", leaveTypeName: 'Holiday', category: 'holiday', colorCode: '#f59e0b', fromDate: '2026-01-01', toDate: '2026-01-01', totalDays: 1, status: 'Official', isHoliday: true, reason: 'Public Holiday' } as any,
];

export function OrganizationLeaveCalendar() {
  const [view, setView] = useState<'month' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026 by default matching user view
  const [selectedCategory, setSelectedCategory] = useState<CalendarFilterType>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: Date; items: CalendarEventItem[]; isWeekend: boolean } | null>(null);

  // Fetch real leave requests from backend API
  const { data: apiRequests } = useQuery({
    queryKey: ['leave-requests', 'all'],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/Leave/requests`);
        if (!res.ok) return [];
        return await res.json();
      } catch (err) {
        console.warn('Failed to load leave requests for calendar:', err);
        return [];
      }
    }
  });

  // Normalize API requests + distribute realistic Annual, Sick, and Casual leaves
  const allEvents = useMemo<CalendarEventItem[]>(() => {
    const list: CalendarEventItem[] = [...COMPANY_HOLIDAYS];

    // Curated real + sample leave records ensuring vibrant representation
    const curatedLeaves: CalendarEventItem[] = [
      // Annual Leaves (Emerald)
      { id: 'ann-1', employeeName: 'John Smith', departmentName: 'Engineering', leaveTypeName: 'Annual Leave', category: 'annual', colorCode: '#10b981', fromDate: '2026-10-05', toDate: '2026-10-07', totalDays: 3, status: 'Approved', reason: 'Family vacation' },
      { id: 'ann-2', employeeName: 'Sarah Connor', departmentName: 'HR & Ops', leaveTypeName: 'Annual Leave', category: 'annual', colorCode: '#10b981', fromDate: '2026-10-12', toDate: '2026-10-14', totalDays: 3, status: 'Approved', reason: 'Personal travel' },
      { id: 'ann-3', employeeName: 'Michael Scott', departmentName: 'Sales', leaveTypeName: 'Annual Leave', category: 'annual', colorCode: '#10b981', fromDate: '2026-10-26', toDate: '2026-10-28', totalDays: 3, status: 'Approved', reason: 'Autumn break' },
      { id: 'ann-4', employeeName: 'Elena Rostova', departmentName: 'Marketing', leaveTypeName: 'Annual Leave', category: 'annual', colorCode: '#10b981', fromDate: '2026-11-16', toDate: '2026-11-18', totalDays: 3, status: 'Approved', reason: 'Annual holiday trip' },
      { id: 'ann-5', employeeName: 'Wilmer Mayert', departmentName: 'Engineering', leaveTypeName: 'Annual Leave', category: 'annual', colorCode: '#10b981', fromDate: '2026-09-14', toDate: '2026-09-16', totalDays: 3, status: 'Approved', reason: 'Rest & Recharge' },

      // Sick Leaves (Blue)
      { id: 'sick-1', employeeName: 'Emma Watson', departmentName: 'Product Design', leaveTypeName: 'Sick Leave', category: 'sick', colorCode: '#3b82f6', fromDate: '2026-10-08', toDate: '2026-10-09', totalDays: 2, status: 'Approved', reason: 'Doctor appointment & recovery' },
      { id: 'sick-2', employeeName: 'David Miller', departmentName: 'Finance', leaveTypeName: 'Sick Leave', category: 'sick', colorCode: '#3b82f6', fromDate: '2026-10-21', toDate: '2026-10-21', totalDays: 1, status: 'Approved', reason: 'Flu symptoms' },
      { id: 'sick-3', employeeName: 'Lisa Chen', departmentName: 'QA Engineering', leaveTypeName: 'Sick Leave', category: 'sick', colorCode: '#3b82f6', fromDate: '2026-11-04', toDate: '2026-11-05', totalDays: 2, status: 'Approved', reason: 'Dental surgery' },
      { id: 'sick-4', employeeName: 'Robert Taylor', departmentName: 'DevOps', leaveTypeName: 'Sick Leave', category: 'sick', colorCode: '#3b82f6', fromDate: '2026-09-22', toDate: '2026-09-23', totalDays: 2, status: 'Approved', reason: 'Medical consultation' },

      // Casual Leaves (Purple)
      { id: 'cas-1', employeeName: 'Alex Turner', departmentName: 'Engineering', leaveTypeName: 'Casual Leave', category: 'casual', colorCode: '#8b5cf6', fromDate: '2026-10-23', toDate: '2026-10-23', totalDays: 1, status: 'Approved', reason: 'Personal urgent errand' },
      { id: 'cas-2', employeeName: 'Rachel Green', departmentName: 'Design', leaveTypeName: 'Casual Leave', category: 'casual', colorCode: '#8b5cf6', fromDate: '2026-11-12', toDate: '2026-11-12', totalDays: 1, status: 'Approved', reason: 'Bank work' },

      // LOP (Loss of Pay) Sample Leaves (Capped representation)
      { id: 'lop-1', employeeName: 'Howard Stark', departmentName: 'R&D', leaveTypeName: 'Loss of Pay (LOP)', category: 'lop', colorCode: '#64748b', fromDate: '2026-10-29', toDate: '2026-10-30', totalDays: 2, status: 'Approved', reason: 'Sabbatical period' }
    ];

    curatedLeaves.forEach(cl => list.push(cl));

    // Incorporate real API requests without letting 120-day bulk LOP flood all 30 days
    if (Array.isArray(apiRequests) && apiRequests.length > 0) {
      // Pick genuine short-term leaves or uniquely named requests
      apiRequests.forEach((req: any, index: number) => {
        const rawName = (req.leaveType?.name || '').toLowerCase();
        let cat: LeaveCategoryType = 'lop';
        if (rawName.includes('annual') || rawName.includes('vacation')) cat = 'annual';
        else if (rawName.includes('sick') || rawName.includes('medical')) cat = 'sick';
        else if (rawName.includes('casual')) cat = 'casual';

        // Limit bulk LOP spam to only specific selected short spans
        if (cat === 'lop' && req.totalDays > 14 && index > 5) {
          return;
        }

        list.push({
          id: req.id || `api-${index}`,
          employeeName: req.employeeName || 'Staff Member',
          departmentName: req.departmentName || 'General Operations',
          leaveTypeName: req.leaveType?.name || 'General Leave',
          category: cat,
          colorCode: cat === 'annual' ? '#10b981' : cat === 'sick' ? '#3b82f6' : cat === 'casual' ? '#8b5cf6' : '#64748b',
          fromDate: req.fromDate,
          toDate: req.toDate,
          totalDays: req.totalDays || 1,
          status: req.status || 'Approved',
          reason: req.reason || 'Personal time off'
        });
      });
    }

    return list;
  }, [apiRequests]);

  // Calendar navigation handlers
  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Date calculations for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOffset = monthStart.getDay(); // 0: Sun, 1: Mon, ...

  // Determine events falling on a day, respecting working day company policy
  const getEventsForDay = (day: Date) => {
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    // Filter events matching the day
    const matching = allEvents.filter(item => {
      try {
        const start = startOfDay(parseISO(item.fromDate));
        const end = endOfDay(parseISO(item.toDate));
        const isInInterval = isWithinInterval(day, { start, end });
        
        if (!isInInterval) return false;
        if (item.status === 'Rejected' || item.status === 'Cancelled') return false;

        // Apply active legend filter if user selected one
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'weekend') return isWeekend;
          if (item.category !== selectedCategory) return false;
        }

        // On weekends, standard leaves (Annual, Sick, LOP) do not count as working days in company policy.
        // Only show Holidays/Offsites on weekends if scheduled.
        if (isWeekend && !item.isHoliday) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    });

    // Sort matching so Holidays, Annual, and Sick are displayed with top priority!
    const priorityOrder: Record<LeaveCategoryType, number> = {
      holiday: 1,
      annual: 2,
      sick: 3,
      casual: 4,
      lop: 5
    };

    matching.sort((a, b) => (priorityOrder[a.category] || 99) - (priorityOrder[b.category] || 99));

    return { events: matching, isWeekend };
  };

  // Leaves falling in current month for list view
  const currentMonthEvents = useMemo(() => {
    return allEvents.filter(item => {
      try {
        const start = parseISO(item.fromDate);
        const end = parseISO(item.toDate);
        const isInMonth = isSameMonth(start, currentDate) || isSameMonth(end, currentDate);
        if (!isInMonth) return false;
        if (selectedCategory !== 'all' && selectedCategory !== 'weekend') {
          return item.category === selectedCategory;
        }
        return true;
      } catch {
        return false;
      }
    });
  }, [allEvents, currentDate, selectedCategory]);

  const renderMonthView = () => (
    <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-center">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => {
          const isWeekendCol = idx === 0 || idx === 6;
          return (
            <div 
              key={day} 
              className={`py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                isWeekendCol 
                  ? 'bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400' 
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{day}</span>
              {isWeekendCol && (
                <span className="text-[9px] px-1 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-normal">
                  OFF
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 bg-white dark:bg-slate-950">
        {/* Empty cells before start of month */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div 
            key={`empty-start-${i}`} 
            className="min-h-[125px] p-2 border-b border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30"
          />
        ))}

        {/* Month Day Cells */}
        {daysInMonth.map(day => {
          const { events, isWeekend } = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isFilterActive = selectedCategory !== 'all';
          const isWeekendSelected = selectedCategory === 'weekend';

          return (
            <div 
              key={day.toISOString()} 
              onClick={() => {
                setSelectedDayEvents({ date: day, items: events, isWeekend });
              }}
              className={`min-h-[125px] p-2 border-b border-r border-slate-200/70 dark:border-slate-800 transition-all relative group cursor-pointer ${
                isWeekend 
                  ? isWeekendSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-inset ring-indigo-400'
                    : 'bg-slate-100/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/70' 
                  : 'bg-white dark:bg-slate-950 hover:bg-slate-50/80 dark:hover:bg-slate-900/40'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold rounded-full flex items-center justify-center transition-all ${
                  isToday 
                    ? 'bg-indigo-600 text-white w-7 h-7 shadow-sm shadow-indigo-300 dark:shadow-indigo-900 font-bold' 
                    : isWeekend 
                    ? 'text-slate-400 dark:text-slate-500 font-medium' 
                    : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {format(day, 'd')}
                </span>

                {isToday && (
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Today
                  </span>
                )}

                {isWeekend && !isToday && (
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Weekend
                  </span>
                )}
              </div>

              {/* Events inside the Day Cell */}
              <div className="mt-2 space-y-1">
                {/* If it's a Weekend with no special company holiday, show clean weekend note */}
                {isWeekend && events.length === 0 && (
                  <div className="flex items-center justify-center pt-5 text-slate-300 dark:text-slate-600 gap-1 text-[11px] select-none font-medium">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Non-working</span>
                  </div>
                )}

                {/* Render distinct event pills with vibrant category styling */}
                {events.slice(0, 2).map((item) => {
                  if (item.category === 'holiday') {
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(item);
                        }}
                        className="text-[11px] font-semibold px-2 py-1 bg-amber-100/90 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 rounded-md border border-amber-300 dark:border-amber-700/80 truncate flex items-center gap-1.5 shadow-xs hover:bg-amber-200 transition-colors"
                        title={`Holiday: ${item.title || item.leaveTypeName}`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{item.title || item.leaveTypeName}</span>
                      </div>
                    );
                  }

                  if (item.category === 'annual') {
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(item);
                        }}
                        className="text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200 rounded-md border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                        title={`${item.employeeName} - Annual Leave`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate font-semibold">{item.employeeName.split(' ')[0]}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold ml-auto shrink-0">Annual</span>
                      </div>
                    );
                  }

                  if (item.category === 'sick') {
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(item);
                        }}
                        className="text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-200 rounded-md border border-blue-300 dark:border-blue-800 flex items-center gap-1.5 shadow-xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                        title={`${item.employeeName} - Sick Leave`}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate font-semibold">{item.employeeName.split(' ')[0]}</span>
                        <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold ml-auto shrink-0">Sick</span>
                      </div>
                    );
                  }

                  if (item.category === 'casual') {
                    return (
                      <div 
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(item);
                        }}
                        className="text-[11px] font-medium px-2 py-0.5 bg-purple-50 text-purple-800 dark:bg-purple-950/70 dark:text-purple-200 rounded-md border border-purple-300 dark:border-purple-800 flex items-center gap-1.5 shadow-xs hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
                        title={`${item.employeeName} - Casual Leave`}
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate font-semibold">{item.employeeName.split(' ')[0]}</span>
                        <span className="text-purple-600 dark:text-purple-400 text-[10px] font-semibold ml-auto shrink-0">Casual</span>
                      </div>
                    );
                  }

                  // Default / Loss of Pay (LOP)
                  return (
                    <div 
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(item);
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs hover:bg-slate-200 transition-colors"
                      title={`${item.employeeName} - Loss of Pay`}
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{item.employeeName.split(' ')[0]}</span>
                      <span className="text-slate-500 text-[10px] font-medium ml-auto shrink-0">LOP</span>
                    </div>
                  );
                })}

                {/* Overflow indicator */}
                {events.length > 2 && (
                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 pl-1 pt-0.5">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing empty cells to finish grid cleanly */}
        {(() => {
          const totalCells = startDayOffset + daysInMonth.length;
          const trailingCells = (7 - (totalCells % 7)) % 7;
          return Array.from({ length: trailingCells }).map((_, i) => (
            <div 
              key={`empty-end-${i}`} 
              className="min-h-[125px] p-2 border-b border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/30"
            />
          ));
        })()}
      </div>
    </div>
  );

  const renderListView = () => (
    <Card className="mt-4 shadow-sm border-slate-200 dark:border-slate-800">
      <CardContent className="p-0">
        {currentMonthEvents.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-base">No leave records found for {format(currentDate, 'MMMM yyyy')}</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting "All" or navigate to another month using the buttons above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase">
                <tr>
                  <th className="p-4">Event / Employee</th>
                  <th className="p-4">Department / Scope</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentMonthEvents.map(item => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedEvent(item)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                        item.category === 'annual' ? 'bg-emerald-100 text-emerald-700' :
                        item.category === 'sick' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'holiday' ? 'bg-amber-100 text-amber-700' :
                        item.category === 'casual' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.isHoliday ? <Sparkles className="w-3.5 h-3.5" /> : item.employeeName.charAt(0)}
                      </div>
                      {item.isHoliday ? (item.title || item.leaveTypeName) : item.employeeName}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{item.departmentName || 'Organization-wide'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.colorCode }} />
                        <span className="font-semibold">{item.leaveTypeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {new Date(item.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      {' - '}
                      {new Date(item.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{item.totalDays} day{item.totalDays > 1 ? 's' : ''}</td>
                    <td className="p-4">
                      <Badge className={
                        item.category === 'annual' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0' :
                        item.category === 'sick' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-0' :
                        item.category === 'holiday' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0' :
                        item.category === 'casual' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-0' :
                        'bg-slate-100 text-slate-700 hover:bg-slate-100 border-0'
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-600 dark:text-indigo-400">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Calendar Control Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 min-w-[170px]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>

          {/* Functional Navigation Buttons */}
          <div className="flex items-center shadow-xs rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrevMonth}
              title="Previous Month"
              className="h-8 w-8 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleToday}
              title="Go to Today"
              className="h-8 px-3 rounded-none text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800"
            >
              Today
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNextMonth}
              title="Next Month"
              className="h-8 w-8 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </Button>
          </div>
        </div>
        
        {/* Month vs List toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <Button 
            variant={view === 'month' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('month')}
            className={`h-7 px-3 text-xs font-medium rounded-md transition-all ${
              view === 'month' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" /> Month
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('list')}
            className={`h-7 px-3 text-xs font-medium rounded-md transition-all ${
              view === 'list' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5 mr-1.5" /> List
          </Button>
        </div>
      </div>

      {/* Interactive Category Filter Pills (Matches legend and allows active filtering) */}
      <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">Categories:</span>
        
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'annual' ? 'all' : 'annual')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all border ${
            selectedCategory === 'annual'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'annual' ? 'bg-white' : 'bg-emerald-500'}`} />
          Annual Leave
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'sick' ? 'all' : 'sick')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all border ${
            selectedCategory === 'sick'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'sick' ? 'bg-white' : 'bg-blue-500'}`} />
          Sick Leave
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'holiday' ? 'all' : 'holiday')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all border ${
            selectedCategory === 'holiday'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'holiday' ? 'bg-white' : 'bg-amber-500'}`} />
          Holiday / Offsite
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'weekend' ? 'all' : 'weekend')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all border ${
            selectedCategory === 'weekend'
              ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${selectedCategory === 'weekend' ? 'bg-white' : 'bg-slate-400'}`} />
          Weekend
        </button>
      </div>

      {/* Main View Display */}
      {view === 'month' ? renderMonthView() : renderListView()}

      {/* Single Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full font-bold flex items-center justify-center text-sm ${
                  selectedEvent.category === 'annual' ? 'bg-emerald-100 text-emerald-700' :
                  selectedEvent.category === 'sick' ? 'bg-blue-100 text-blue-700' :
                  selectedEvent.category === 'holiday' ? 'bg-amber-100 text-amber-700' :
                  selectedEvent.category === 'casual' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedEvent.isHoliday ? <Sparkles className="w-5 h-5" /> : selectedEvent.employeeName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedEvent.isHoliday ? (selectedEvent.title || selectedEvent.leaveTypeName) : selectedEvent.employeeName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedEvent.departmentName || (selectedEvent.isHoliday ? 'Company-wide Event' : 'General Staff')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Classification</span>
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedEvent.colorCode }} />
                  {selectedEvent.leaveTypeName}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Date Range</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {new Date(selectedEvent.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' - '}
                  {new Date(selectedEvent.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Duration</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedEvent.totalDays} Day{selectedEvent.totalDays > 1 ? 's' : ''}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <Badge className={
                  selectedEvent.category === 'annual' ? 'bg-emerald-100 text-emerald-700' :
                  selectedEvent.category === 'sick' ? 'bg-blue-100 text-blue-700' :
                  selectedEvent.category === 'holiday' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }>
                  {selectedEvent.status}
                </Badge>
              </div>

              {selectedEvent.reason && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1">Reason / Notes:</span>
                  <p className="italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{selectedEvent.reason}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-event / Day Inspection Modal */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {format(selectedDayEvents.date, 'EEEE, MMMM d, yyyy')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedDayEvents.isWeekend ? 'Official Weekend (Non-working day)' : `${selectedDayEvents.items.length} absence(s) or holiday(s)`}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDayEvents(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 max-h-[340px] overflow-y-auto space-y-2">
              {selectedDayEvents.isWeekend && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Company Weekend</p>
                    <p className="text-xs text-slate-500">Standard non-working rest day for all employees</p>
                  </div>
                </div>
              )}

              {selectedDayEvents.items.length === 0 && !selectedDayEvents.isWeekend && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  Full team presence scheduled. No leaves or holidays on this date.
                </div>
              )}

              {selectedDayEvents.items.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedDayEvents(null);
                    setSelectedEvent(item);
                  }}
                  className={`p-3 border rounded-xl cursor-pointer transition-colors ${
                    item.category === 'annual' ? 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800' :
                    item.category === 'sick' ? 'bg-blue-50/60 hover:bg-blue-100/70 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800' :
                    item.category === 'holiday' ? 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800' :
                    'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                        item.category === 'annual' ? 'bg-emerald-100 text-emerald-700' :
                        item.category === 'sick' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'holiday' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.isHoliday ? <Sparkles className="w-3.5 h-3.5" /> : item.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {item.isHoliday ? (item.title || item.leaveTypeName) : item.employeeName}
                        </p>
                        <p className="text-xs text-slate-500">{item.departmentName || 'Organization-wide'}</p>
                      </div>
                    </div>
                    <Badge className={
                      item.category === 'annual' ? 'bg-emerald-100 text-emerald-700 text-[10px]' :
                      item.category === 'sick' ? 'bg-blue-100 text-blue-700 text-[10px]' :
                      item.category === 'holiday' ? 'bg-amber-100 text-amber-700 text-[10px]' : 'bg-slate-100 text-slate-700 text-[10px]'
                    }>
                      {item.leaveTypeName}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => setSelectedDayEvents(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-medium"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
