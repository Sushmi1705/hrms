import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, CheckCircle2, Globe, Building } from 'lucide-react';
import { HolidayCalendarItem, HolidayCalendarDayItem } from '../types/systemAdmin';
import { systemAdminApi } from '../api/systemAdminApi';

export const HolidayCalendarSettings: React.FC = () => {
  const [calendars, setCalendars] = useState<HolidayCalendarItem[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showDayModal, setShowDayModal] = useState(false);
  const [dayForm, setDayForm] = useState<{ name: string; date: string; type: string; isRecurring: boolean }>({
    name: '',
    date: '2026-01-01',
    type: 'Public',
    isRecurring: true
  });

  const fetchCalendars = async () => {
    setLoading(true);
    try {
      const data = await systemAdminApi.getHolidayCalendars();
      setCalendars(data);
      if (data.length > 0 && !selectedCalendarId) {
        setSelectedCalendarId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch calendars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const activeCalendar = calendars.find(c => c.id === selectedCalendarId) || calendars[0];

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCalendar) return;

    const newDay: HolidayCalendarDayItem = {
      name: dayForm.name,
      date: dayForm.date,
      type: dayForm.type as any,
      isRecurring: dayForm.isRecurring
    };

    const updatedDays = [...activeCalendar.days, newDay];

    try {
      await systemAdminApi.saveHolidayCalendar({
        id: activeCalendar.id,
        code: activeCalendar.code,
        name: activeCalendar.name,
        description: activeCalendar.description,
        year: activeCalendar.year,
        companyName: activeCalendar.companyName,
        branchName: activeCalendar.branchName,
        isDefault: activeCalendar.isDefault,
        days: updatedDays
      });
      setShowDayModal(false);
      setDayForm({ name: '', date: '2026-01-01', type: 'Public', isRecurring: true });
      fetchCalendars();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add holiday');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Organization Holiday & Regional Calendars</h3>
            <p className="text-xs text-slate-500">Configure global, statutory, and branch-specific holiday schedules</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCalendarId}
            onChange={e => setSelectedCalendarId(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
          >
            {calendars.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.daysCount} days)
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowDayModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Holiday
          </button>
        </div>
      </div>

      {/* Calendar Details & Days Table */}
      {loading || !activeCalendar ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading holiday calendars...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">{activeCalendar.name}</span>
              <span className="text-[10px] font-mono text-slate-400">({activeCalendar.code})</span>
              {activeCalendar.isDefault && (
                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-primary/10 text-primary">
                  DEFAULT
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">Branch: {activeCalendar.branchName}</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Holiday Name</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Recurring</th>
                <th className="px-5 py-3 text-right">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {activeCalendar.days.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No holidays scheduled for this calendar.</td>
                </tr>
              ) : (
                activeCalendar.days.map(d => (
                  <tr key={d.id || d.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3 font-semibold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                      {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        d.type === 'Public'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                          : d.type === 'Company'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400'
                      }`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{d.isRecurring ? 'Annual (Recurring)' : 'One-time'}</td>
                    <td className="px-5 py-3 text-right text-slate-400">{d.description || 'Statutory holiday'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Holiday Modal */}
      {showDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-200">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Holiday to Calendar</h3>
            
            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Independence Day"
                  value={dayForm.name}
                  onChange={e => setDayForm({ ...dayForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={dayForm.date}
                    onChange={e => setDayForm({ ...dayForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={dayForm.type}
                    onChange={e => setDayForm({ ...dayForm, type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    <option value="Public">Public</option>
                    <option value="Company">Company</option>
                    <option value="Regional">Regional</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs pt-1">
                <input
                  type="checkbox"
                  checked={dayForm.isRecurring}
                  onChange={e => setDayForm({ ...dayForm, isRecurring: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Repeats annually on the same date</span>
              </label>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDayModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
