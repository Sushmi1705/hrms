import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Download, 
  Send, CheckCircle2, AlertCircle, X, Clock, Users, Sparkles, 
  Eye, Check, Lock, Bell
} from 'lucide-react';
import { 
  format, addWeeks, subWeeks, addMonths, subMonths, 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, isToday, parseISO 
} from 'date-fns';

interface RosterEmployee {
  id: string;
  name: string;
  role: string;
  dept: string;
  shifts: Record<string, string>; // keyed by 'yyyy-MM-dd' -> shift name
}

const INITIAL_EMPLOYEES: RosterEmployee[] = [
  { 
    id: 'emp-1', 
    name: 'John Doe', 
    role: 'Software Engineer', 
    dept: 'Engineering',
    shifts: {} 
  },
  { 
    id: 'emp-2', 
    name: 'Jane Smith', 
    role: 'Support Agent', 
    dept: 'Support',
    shifts: {} 
  },
  { 
    id: 'emp-3', 
    name: 'Michael Brown', 
    role: 'Sales Exec', 
    dept: 'Sales',
    shifts: {} 
  },
  { 
    id: 'emp-4', 
    name: 'Sarah Connor', 
    role: 'Manager', 
    dept: 'Engineering',
    shifts: {} 
  },
  { 
    id: 'emp-5', 
    name: 'Wilmer Mayert', 
    role: 'Lead Architect', 
    dept: 'Engineering',
    shifts: {} 
  },
  { 
    id: 'emp-6', 
    name: 'Elena Rostova', 
    role: 'Marketing Lead', 
    dept: 'Marketing',
    shifts: {} 
  },
];

const SHIFT_CHOICES = [
  { name: 'Morning', time: '06:00 - 14:00', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' },
  { name: 'General', time: '09:00 - 18:00', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' },
  { name: 'Evening', time: '14:00 - 22:00', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { name: 'Night', time: '22:00 - 06:00', color: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300' },
  { name: 'Leave', time: 'Paid Time Off', color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300' },
  { name: 'Off', time: 'Rest Day', color: 'bg-slate-100 text-slate-500 border-slate-300 border-dashed dark:bg-slate-800 dark:text-slate-400' },
];

export function ShiftRosterPlanner() {
  // Navigation & View state
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 24)); // Defaults to Aug 24, 2026 as in original mockup
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Roster schedule state
  const [rosterOverrides, setRosterOverrides] = useState<Record<string, Record<string, string>>>({});
  const [publishedPeriods, setPublishedPeriods] = useState<Record<string, boolean>>({});

  // Modals
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ employeeId: string; employeeName: string; dateStr: string; currentShift: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Publish options
  const [notifyEmployees, setNotifyEmployees] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Week calculation (Monday to Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Month calculation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Current period key for publishing
  const currentPeriodKey = viewMode === 'week' 
    ? `week-${format(weekStart, 'yyyy-MM-dd')}`
    : `month-${format(monthStart, 'yyyy-MM')}`;

  const isCurrentPeriodPublished = !!publishedPeriods[currentPeriodKey];

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleToday = () => setCurrentDate(new Date(2026, 7, 24));

  // Determine an employee's shift on a given date (respecting weekend vs weekday defaults + overrides)
  const getEmployeeShift = (empId: string, day: Date): string => {
    const dateStr = format(day, 'yyyy-MM-dd');
    if (rosterOverrides[empId] && rosterOverrides[empId][dateStr]) {
      return rosterOverrides[empId][dateStr];
    }

    const dayOfWeek = day.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      // Support agent has rotating weekend shifts
      if (empId === 'emp-2' && dayOfWeek === 6) return 'Night';
      return 'Off';
    }

    // Default weekday distribution
    switch (empId) {
      case 'emp-1': return 'Morning';
      case 'emp-2': return dayOfWeek === 4 ? 'Off' : 'Night';
      case 'emp-3': return 'General';
      case 'emp-4': return (dayOfWeek === 3 || dayOfWeek === 4) ? 'Leave' : 'General';
      case 'emp-5': return 'General';
      case 'emp-6': return 'Evening';
      default: return 'General';
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'Morning': return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300';
      case 'General': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300';
      case 'Evening': return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'Night': return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'Leave': return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300';
      case 'Off': return 'bg-slate-100 text-slate-500 border-slate-300 border-dashed dark:bg-slate-800/60 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Cell shift update
  const handleSelectShift = (newShift: string) => {
    if (!selectedCell) return;
    const { employeeId, dateStr } = selectedCell;

    setRosterOverrides(prev => ({
      ...prev,
      [employeeId]: {
        ...(prev[employeeId] || {}),
        [dateStr]: newShift
      }
    }));

    showToast(`Updated to ${newShift} for ${selectedCell.employeeName} on ${dateStr}.`);
    setSelectedCell(null);
  };

  // Publish Roster handler
  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    setTimeout(() => {
      setPublishedPeriods(prev => ({ ...prev, [currentPeriodKey]: true }));
      setIsPublishing(false);
      setIsPublishModalOpen(false);
      const periodLabel = viewMode === 'week'
        ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
        : format(currentDate, 'MMMM yyyy');

      showToast(`Roster for ${periodLabel} successfully published! ${notifyEmployees ? 'Notification dispatched to employees.' : ''}`);
    }, 600);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-medium bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Title & Active Date Navigator */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white min-w-[150px]">
            {viewMode === 'week' ? 'Weekly Roster' : 'Monthly Roster'}
          </h2>

          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <button 
              onClick={handlePrev}
              title="Previous"
              className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>

            <span className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              {viewMode === 'week' ? (
                <span>{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
              ) : (
                <span>{format(currentDate, 'MMMM yyyy')}</span>
              )}
            </span>

            <button 
              onClick={handleNext}
              title="Next"
              className="px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 border-l border-slate-200 dark:border-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToday}
            className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Today
          </Button>

          {/* Status Pill */}
          {isCurrentPeriodPublished ? (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-0 flex items-center gap-1 text-[11px]">
              <Check className="w-3 h-3 text-emerald-600" /> Published & Live
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 text-[11px]">
              Draft (Unpublished)
            </Badge>
          )}
        </div>

        {/* View Toggle & Publish Actions */}
        <div className="flex items-center gap-2">
          {/* Month / Week View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Button 
              variant={viewMode === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('week')}
              className={`h-7 px-3 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'week' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Week View
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('month')}
              className={`h-7 px-3 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'month' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Month View
            </Button>
          </div>

          {/* Publish Roster Button */}
          <Button 
            onClick={() => setIsPublishModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isCurrentPeriodPublished ? 'Republish Roster' : 'Publish Roster'}
          </Button>
        </div>
      </div>

      {/* Main Roster Grid */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
              <tr>
                <th className="px-5 py-3.5 font-bold text-slate-700 dark:text-slate-300 min-w-[200px] uppercase tracking-wider">
                  Employee
                </th>
                {(viewMode === 'week' ? weekDays : monthDays).map(d => {
                  const isDayWeekend = d.getDay() === 0 || d.getDay() === 6;
                  const isCurToday = isToday(d);
                  return (
                    <th 
                      key={d.toISOString()} 
                      className={`px-2 py-3 font-semibold text-center uppercase tracking-wider ${
                        viewMode === 'week' ? 'min-w-[120px]' : 'min-w-[70px]'
                      } ${
                        isCurToday
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                          : isDayWeekend
                          ? 'bg-slate-100/60 dark:bg-slate-900/40 text-slate-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div>{format(d, viewMode === 'week' ? 'EEE' : 'EEE')}</div>
                      <div className={`text-xs ${isCurToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}>
                        {format(d, 'd')}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_EMPLOYEES.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{emp.role}</div>
                  </td>
                  {(viewMode === 'week' ? weekDays : monthDays).map(day => {
                    const shift = getEmployeeShift(emp.id, day);
                    const isDayWeekend = day.getDay() === 0 || day.getDay() === 6;
                    const dateStr = format(day, 'yyyy-MM-dd');

                    return (
                      <td 
                        key={day.toISOString()} 
                        className={`px-1.5 py-2 ${isDayWeekend ? 'bg-slate-50/40 dark:bg-slate-900/20' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCell({
                            employeeId: emp.id,
                            employeeName: emp.name,
                            dateStr,
                            currentShift: shift
                          })}
                          title={`Click to edit shift for ${emp.name} on ${format(day, 'EEE, MMM d')}`}
                          className={`w-full text-center py-2 px-1 rounded-md border text-xs font-semibold transition-all hover:scale-[1.02] hover:shadow-xs ${getShiftColor(shift)}`}
                        >
                          <span className="truncate block">
                            {viewMode === 'month' ? shift.substring(0, 3) : shift}
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Interactive Shift Cell Picker Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Assign Shift</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCell.employeeName} &bull; {selectedCell.dateStr}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Select Shift for this date:
              </label>
              {SHIFT_CHOICES.map(choice => (
                <button
                  key={choice.name}
                  type="button"
                  onClick={() => handleSelectShift(choice.name)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    selectedCell.currentShift === choice.name 
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 ring-1 ring-indigo-500' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${choice.color}`}>
                      {choice.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{choice.time}</span>
                  </div>
                  {selectedCell.currentShift === choice.name && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCell(null)} 
                className="w-full text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Roster Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Publish Schedule to Staff
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Finalize roster shifts and dispatch to employees
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="py-4 space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Scheduled Period:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {viewMode === 'week' 
                      ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                      : format(currentDate, 'MMMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Staff Assigned:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {INITIAL_EMPLOYEES.length} Active Employees
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Current Status:</span>
                  <span className={`font-semibold ${isCurrentPeriodPublished ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isCurrentPeriodPublished ? 'Published & Active' : 'Draft / Unpublished'}
                  </span>
                </div>
              </div>

              {/* Notification Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifyEmployees} 
                  onChange={e => setNotifyEmployees(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Dispatch Notifications to Employees
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Sends push alerts and mobile shift schedule updates to all affected staff.
                  </span>
                </div>
              </label>

              <div className="pt-3 flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPublishModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPublishing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isPublishing ? 'Publishing...' : 'Confirm & Publish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
