import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { 
  Search, Filter, MoreHorizontal, CheckCircle2, Clock, 
  AlertCircle, Users, Calendar, MapPin, Download, Check, 
  Send, Video, Presentation, X, UserCheck
} from 'lucide-react';

export interface AttendeeRecord {
  id: string;
  name: string;
  dept: string;
  attended: boolean;
}

export interface ClassroomSessionRecord {
  id: number;
  name: string;
  instructor: string;
  datetime: string;
  location: string;
  capacity: string; // e.g. '24 / 30'
  enrolledCount: number;
  maxCapacity: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  attendees: AttendeeRecord[];
  notes?: string;
}

const INITIAL_SESSIONS: ClassroomSessionRecord[] = [
  {
    id: 1,
    name: 'Executive Storytelling & Pitch Clinic',
    instructor: 'Dr. Evelyn Reed',
    datetime: '2026-09-18 • 10:00 AM - 01:00 PM',
    location: 'Conference Room Apollo (HQ 4th Fl) + Zoom',
    capacity: '24 / 30',
    enrolledCount: 24,
    maxCapacity: 30,
    status: 'Scheduled',
    attendees: [
      { id: '1', name: 'Sarah Jenkins', dept: 'Engineering', attended: false },
      { id: '2', name: 'John Doe', dept: 'Product', attended: false },
      { id: '3', name: 'David Lee', dept: 'Sales', attended: false },
    ],
    notes: 'Bring current project presentation slides for live peer workshop review.'
  },
  {
    id: 2,
    name: 'Kubernetes Pod Disaster Recovery Workshop',
    instructor: 'Vikram Patel',
    datetime: '2026-09-12 • 02:00 PM - 05:00 PM',
    location: 'Cloud Training Lab 2 + Virtual Bastion',
    capacity: '18 / 20',
    enrolledCount: 18,
    maxCapacity: 20,
    status: 'Scheduled',
    attendees: [
      { id: '1', name: 'Julian Casablancas', dept: 'Engineering', attended: false },
      { id: '2', name: 'Sophie Laurent', dept: 'Engineering', attended: false },
    ],
    notes: 'Access keys to staging cluster will be distributed at start of session.'
  },
  {
    id: 3,
    name: 'Design Systems Architecture Sprint',
    instructor: 'Chloe Bennett',
    datetime: '2026-08-28 • 11:00 AM - 02:00 PM',
    location: 'Design Studio Lounge (Room 201)',
    capacity: '15 / 15',
    enrolledCount: 15,
    maxCapacity: 15,
    status: 'Completed',
    attendees: [
      { id: '1', name: 'Maya Lin', dept: 'Design', attended: true },
      { id: '2', name: 'Amanda Fox', dept: 'Design', attended: true },
    ],
    notes: 'Session recorded and uploaded to company LMS archive.'
  }
];

export function ClassroomTraining() {
  const [sessions, setSessions] = useState<ClassroomSessionRecord[]>(INITIAL_SESSIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Scheduled' | 'Completed'>('All');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ClassroomSessionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const handleToggleAttendance = (attendeeId: string) => {
    if (!selectedRecord) return;
    const updatedAttendees = selectedRecord.attendees.map(a => 
      a.id === attendeeId ? { ...a, attended: !a.attended } : a
    );
    const updatedRecord = { ...selectedRecord, attendees: updatedAttendees };
    setSelectedRecord(updatedRecord);
    setSessions(prev => prev.map(s => s.id === updatedRecord.id ? updatedRecord : s));
    showToast('Attendance record updated');
  };

  const handleMarkCompleted = (id: number) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'Completed',
        attendees: s.attendees.map(a => ({ ...a, attended: true }))
      };
    }));
    setActiveDropdown(null);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? {
        ...prev,
        status: 'Completed',
        attendees: prev.attendees.map(a => ({ ...a, attended: true }))
      } : null);
    }
    showToast('Classroom session marked completed with full attendance logged!');
  };

  const handleDownloadRoster = (rec: ClassroomSessionRecord) => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = `===============================================================
            CLASSROOM TRAINING ATTENDANCE ROSTER
===============================================================
Session Name  : ${rec.name}
Instructor    : ${rec.instructor}
Date & Time   : ${rec.datetime}
Location/Room : ${rec.location}
Capacity      : ${rec.capacity} Enrolled
Session Status: ${rec.status.toUpperCase()}
Exported Date : ${todayStr}
---------------------------------------------------------------
ATTENDEE ROSTER & VERIFICATION
---------------------------------------------------------------
${rec.attendees.map((a, i) => `${i + 1}. [${a.attended ? 'ATTENDED' : 'REGISTERED'}] ${a.name} (${a.dept})`).join('\n')}

---------------------------------------------------------------
Instructor Notes:
"${rec.notes || 'None'}"

===============================================================
Instructor Signature: __________________   Date: ______________
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Roster_${rec.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Roster exported for ${rec.name}`);
    setActiveDropdown(null);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-sm flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Classroom Sessions</span>
            <Presentation className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{sessions.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Workshops scheduled</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Upcoming / Open</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {sessions.filter(i => i.status === 'Scheduled').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Registration open</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Seats Reserved</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {sessions.reduce((acc, curr) => acc + curr.enrolledCount, 0)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Enrolled attendees</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {sessions.filter(i => i.status === 'Completed').length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Delivered workshops</div>
        </div>
      </div>

      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">Classroom & Workshop Training</CardTitle>
          <p className="text-sm text-slate-500 mt-0.5">Manage live instructor-led seminars, conference room schedules, and rosters</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search workshops, instructor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border-slate-200 rounded-md text-sm w-64 h-9" 
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md text-xs font-medium text-slate-600">
            {(['All', 'Scheduled', 'Completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === f 
                    ? 'bg-white text-blue-700 shadow-xs font-semibold' 
                    : 'hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Session Name</th>
                <th className="px-6 py-3.5">Instructor</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Capacity</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No classroom training sessions match your search.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                        {item.instructor}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {item.datetime}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {item.capacity}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600"/> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Calendar className="w-3 h-3 mr-1 text-blue-600"/> Scheduled
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative inline-flex items-center justify-end gap-1.5">
                        {/* Direct Roster Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(item)}
                          className="h-8 px-2.5 text-xs text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 border-blue-200 font-medium flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Roster
                        </Button>

                        {/* Dropdown Menu Toggle */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        >
                          <MoreHorizontal className="w-4 h-4"/>
                        </Button>

                        {/* Dropdown Menu */}
                        {activeDropdown === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setActiveDropdown(null)} 
                            />
                            <div className="absolute right-0 top-9 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                Session Actions
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                Inspect Session & Roster
                              </button>

                              <button
                                onClick={() => handleMarkCompleted(item.id)}
                                className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-medium"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Mark Session Completed
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                onClick={() => handleDownloadRoster(item)}
                                className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-500" />
                                Download Roster (.txt)
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredSessions.length} of {sessions.length} entries</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredSessions.length <= 10}>Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Classroom Session Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold">{selectedRecord.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedRecord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instructor: {selectedRecord.instructor} • {selectedRecord.capacity} Seats
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Session Overview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Date & Schedule:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.datetime}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Room / Venue:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedRecord.location}</div>
                </div>
              </div>

              {/* Attendees Roster */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Attendees & Attendance Check</span>
                  <span className="text-slate-400 font-normal">{selectedRecord.enrolledCount} Registered</span>
                </div>

                <div className="space-y-1.5">
                  {selectedRecord.attendees.map((attendee) => (
                    <div 
                      key={attendee.id} 
                      onClick={() => handleToggleAttendance(attendee.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors cursor-pointer text-xs ${
                        attendee.attended 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={attendee.attended} 
                          onChange={() => {}} // Handled by div click
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{attendee.name}</div>
                          <div className="text-[11px] text-slate-400">{attendee.dept}</div>
                        </div>
                      </div>

                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        attendee.attended ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {attendee.attended ? 'Attended' : 'Registered'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Instructor Workshop Notes:</span> {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadRoster(selectedRecord)}
                className="text-xs text-slate-600 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Roster (.txt)
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleMarkCompleted(selectedRecord.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Mark Completed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
