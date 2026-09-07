import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';

export function OrganizationLeaveCalendar() {
  const [view, setView] = useState<'month' | 'list'>('month');
  
  // Dummy data for calendar
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 3; // Wednesday

  const renderMonthView = () => (
    <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-white">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r border-slate-100 bg-slate-50/50"></div>
        ))}
        
        {days.map(day => (
          <div key={day} className="min-h-[120px] p-2 border-b border-r border-slate-100 hover:bg-slate-50 transition-colors relative group">
            <span className={`text-sm font-medium ${day === 15 ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
              {day}
            </span>
            
            <div className="mt-2 space-y-1">
              {day === 4 && (
                <div className="text-xs p-1 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 truncate">
                  John S. (Annual)
                </div>
              )}
              {day === 12 && (
                <div className="text-xs p-1 bg-blue-100 text-blue-700 rounded border border-blue-200 truncate">
                  Emma W. (Sick)
                </div>
              )}
              {day >= 20 && day <= 22 && (
                <div className="text-xs p-1 bg-amber-100 text-amber-700 rounded border border-amber-200 truncate">
                  Team Offsite
                </div>
              )}
            </div>
            
            <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100">
              <CalendarIcon className="w-3 h-3 text-slate-400" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">October 2026</h2>
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" className="h-8 rounded-none border-x-0">Today</Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <Button 
            variant={view === 'month' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('month')}
            className={view === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}
          >
            <CalendarIcon className="w-4 h-4 mr-2" /> Month
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}
          >
            <List className="w-4 h-4 mr-2" /> List
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Annual Leave</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Sick Leave</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Holiday</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Weekend</div>
      </div>

      {view === 'month' ? renderMonthView() : (
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="text-center py-12 text-slate-500">List view is currently empty for this month.</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
