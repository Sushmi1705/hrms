import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeamCalendar } from '../api/mssApi';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Clock,
  Briefcase,
  Plane,
  AlertCircle
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

export default function ManagerCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['mss-calendar', currentDate.getMonth() + 1, currentDate.getFullYear()],
    queryFn: () => getTeamCalendar(currentDate.getMonth() + 1, currentDate.getFullYear())
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const getDayEvents = (day: Date) => {
    if (!events) return [];
    return events.filter(e => isSameDay(parseISO(e.date), day));
  };

  const getEventIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'leave': return <Plane className="w-3 h-3" />;
      case 'training': return <Briefcase className="w-3 h-3" />;
      case 'review': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-indigo-400" />
            Team Calendar
          </h1>
          <p className="text-gray-400 mt-1">View team availability, leaves, and important events</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-300">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-white w-40 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-300">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-center">
          Failed to load calendar events.
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-900/80">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 bg-gray-800 gap-[1px]">
            {/* Fill empty days before start of month */}
            {Array.from({ length: startDate.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-900/50 min-h-[120px]" />
            ))}

            {days.map((day, idx) => {
              const dayEvents = getDayEvents(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div 
                  key={day.toISOString()} 
                  className={`bg-gray-900 min-h-[120px] p-2 transition-colors hover:bg-gray-800/50 ${!isSameMonth(day, monthStart) ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-500 text-white' : 'text-gray-300'}`}>
                      {format(day, dateFormat)}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="animate-pulse space-y-2 mt-2">
                      <div className="h-4 bg-gray-800 rounded w-full"></div>
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    </div>
                  ) : (
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 3).map((evt, i) => (
                        <div 
                          key={i}
                          className="text-xs p-1.5 rounded-md flex items-center gap-1.5 truncate shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ 
                            backgroundColor: evt.color ? `${evt.color}20` : 'rgba(99, 102, 241, 0.1)',
                            color: evt.color || '#818cf8',
                            borderLeft: `2px solid ${evt.color || '#6366f1'}`
                          }}
                          title={`${evt.title} (${evt.employeeName})`}
                        >
                          {getEventIcon(evt.type)}
                          <span className="truncate">{evt.employeeName?.split(' ')[0]}: {evt.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center mt-1 font-medium hover:text-gray-300 cursor-pointer">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
